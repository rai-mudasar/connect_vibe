"use server";

import mongoose from "mongoose";
import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import commentModel from "@/models/commentModel";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "./userActions";
import { sendNotification } from "./notificationActions";
import { deleteFromCloudinary } from "@/helpers/Cloudinary";

export async function getPostById(postId) {
  try {
    if (!postId) throw new Error("Post id is required!")

    const [loggedInUser, post] = await Promise.all([
      getSessionUser(),
      postModel.findById(postId).populate('author', 'firstName lastName profileImageUrl').lean()
    ])

    if (!post) throw new Error('Post not found!')

    return {
      success: true,
      message: 'Successfully completed!',
      data: { "loggedInUser": loggedInUser, 'fetchedPost': JSON.parse(JSON.stringify(post)) }
    }
  } catch (error) {
    // console.error(`Error in get post by id action : ${error.message || error}`);

    return {
      success: false,
      message: `Error in get post by id action : ${error.message || error}`,
    };
  }
}

export async function getAllPosts() {
  await connection()
  try {
    const [_, allPosts] = await Promise.all([
      getSessionUser(),
      postModel
        .find({})
        .sort({ createdAt: -1 })
        .populate("author", "firstName lastName username profileImageUrl")
        .lean(),
    ]);

    return {
      success: true,
      message: "Fetched Successfully",
      data: JSON.parse(JSON.stringify(allPosts)),
    };
  } catch (error) {
    console.error(`Error in getting All post action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getting All post action : ${error.message || error}`,
    };
  }
}

export async function getAllPostByAuthorId(authorId) {
  try {
    const [sessionUser, allPosts] = await Promise.all([
      getSessionUser(),
      postModel
        .find({ author: authorId })
        .sort({ createdAt: -1 })
        .populate("author", "username firstName lastName profileImageUrl")
        .lean(),
    ]);

    if (!allPosts || allPosts.length === 0) {
      return {
        success: true,
        message: 'No post found',
        data: []
      }
    }

    return {
      success: true,
      message: "Fetched Successfully",
      data: JSON.parse(JSON.stringify(allPosts)),
    };
  } catch (error) {
    console.error(`Error in getAllPostByAuthorId action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getAllPostByAuthorId action : ${error.message || error}`,
    };
  }
}

export async function getPostAllcomments(postId) {
  try {
    const [_, allComments] = await Promise.all([
      getSessionUser(),
      commentModel
        .find({ postId })
        .sort({ createdAt: -1 })
        .populate("author", "firstName lastName profileImageUrl")
        .lean(),
    ]);

    if (!allComments || allComments.length === 0) {
      return {
        success: true,
        message: "No Comment Available",
        data: []
      };
    }

    return {
      success: true,
      message: "Fetched Successfully",
      data: JSON.parse(JSON.stringify(allComments)),
    };
  } catch (error) {
    // console.error(`Error in getPostAllcomments action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getPostAllcomments action : ${error.message || error}`,
    };
  }
}

export async function getCommentReplies(parentId) {
  try {
    await getSessionUser()

    const replies = await commentModel.find({ parentId })
      .populate("author", "firstName lastName profileImageUrl")
      .sort({ createdAt: 1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(replies))
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

export async function toggleLikes(postId) {

  try {
    const [sessionUser, post] = await Promise.all([
      getSessionUser(),
      postModel.findById(postId)
    ])

    if (!post) {
      throw new Error("No post found!")
    }

    const hasLiked = post.likes.includes(sessionUser.id);

    if (hasLiked) {
      const [updatedPost, _] = await Promise.all([
        postModel.findByIdAndUpdate(postId, {
          $pull: { likes: sessionUser.id },
        }),

        sendNotification(
          sessionUser.id,
          JSON.parse(JSON.stringify(post.author._id)),
          'UNLIKE',
          `${process.env.NEXTAUTH_URL}/post/${postId}`
        )
      ]);

      if (!updatedPost) throw new Error("Something went wrong!")
    } else {
      const [updatedPost, _] = await Promise.all([
        postModel.findByIdAndUpdate(postId, {
          $addToSet: { likes: sessionUser.id },
        }),

        sendNotification(
          sessionUser.id,
          JSON.parse(JSON.stringify(post.author._id)),
          'LIKE',
          `/post/${postId}`
        )
      ]);
      if (!updatedPost) throw new Error("Something went wrong!")
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/home`);
    return {
      success: true,
      message: hasLiked ? "Unliked" : "Liked",
    };
  } catch (error) {
    console.log(`Error in like post action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in like post action : ${error.message || error}`
    }
  }
}

export async function toggleCommentLike(commentId) {
  try {
    const user = await getSessionUser();

    // 1. Pehle current comment check karein (Lean is fine here just for status check)
    const comment = await commentModel.findById(commentId).lean();
    if (!comment) return {
      success: false,
      message: "Comment not found"
    };

    const isLiked = comment.likes.map(id => id.toString()).includes(user.id);
    const updateOperator = isLiked
      ? { $pull: { likes: user.id } }
      : { $addToSet: { likes: user.id } };

    const updatedComment = await commentModel.findByIdAndUpdate(
      commentId,
      updateOperator,
      { new: true, runValidators: true }
    );

    return {
      success: true,
      likes: JSON.parse(JSON.stringify(updatedComment.likes))
    };

  } catch (error) {
    console.error(`Error inside toggleCommentLike action: ${error.message || error}`);
    return {
      success: false,
      message: `Error inside toggleCommentLike action: ${error.message || error}`
    };
  }
}

export async function addNewComment(postId, comment) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sessionUser = await getSessionUser();

    const newComment = new commentModel({
      postId,
      author: sessionUser.id,
      content: comment,
    });

    await newComment.save({ session })

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    if (!updatedPost) throw new Error("Post not found");


    const receiverId = JSON.parse(JSON.stringify(updatedPost?.author));
    if (sessionUser.id !== receiverId) {
      await sendNotification(
        sessionUser.id,
        receiverId,
        "COMMENT",
        `/post/${updatedPost._id}`
      );
    }

    await session.commitTransaction()
    session.endSession()
    revalidatePath(`/home`);
    const updatedComment = await commentModel.findById(newComment.id).populate("author", "firstName lastName profileImageUrl")
    return {
      success: true,
      message: "Comment Posted",
      data: JSON.parse(JSON.stringify(updatedComment)),
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(`Error in post comment action and transation aborted with error : ${error.message || error}`);

    return {
      success: false,
      message: `Error in post comment action and transation aborted with error : ${error.message || error}`,
    };
  }
}

export async function addCommentReply(postId, parentId, content) {
  try {
    const user = await getSessionUser();
    // Create Reply document
    const newReply = await commentModel.create({
      postId,
      author: user.id,
      content,
      parentId,
    });

    // Parent comment ka repliesCount increment karein
    await commentModel.findByIdAndUpdate(parentId, {
      $inc: { repliesCount: 1 }
    });

    await postModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 }
    });

    // Populate author data for instant UI render
    const populatedReply = await commentModel.findById(newReply._id).populate(
      "author",
      "firstName lastName profileImageUrl"
    ).lean();

    return {
      success: true,
      message: "Reply posted!",
      data: JSON.parse(JSON.stringify(populatedReply))
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

export async function deleteComment(commentId) {
  try {
    const user = await getSessionUser();

    const comment = await commentModel.findById(commentId);
    if (!comment) return {
      success: false,
      message: "Comment not found"
    };

    const post = await postModel.findById(comment.postId);

    // 2. 🔒 Check permission: Ya toh comment ka author ho ya post ka owner
    const isCommentAuthor = comment.author.toString() === user.id;
    const isPostOwner = post && post.author.toString() === user.id;

    if (!isCommentAuthor && !isPostOwner) {
      return { success: false, message: "You don't have permission to delete this comment." };
    }

    const totalDeletedDocs = await commentModel.countDocuments({
      $or: [
        { _id: commentId },
        { parentId: commentId }
      ]
    });

    // 3. Agar yeh ek REPLY hai, toh parent comment ka repliesCount decrement karein
    if (comment.parentId) {
      await commentModel.findByIdAndUpdate(comment.parentId, {
        $inc: { repliesCount: -1 }
      });
    }

    // 4. 🧹 Recursive Cleanup: Is comment ko aur iske andar ke saare nested replies ko delete karein
    // Chunki hamare naye 2-level structure mein replies ki parentId main comment hoti hai, yeh query sab saaf kar degi
    await commentModel.deleteMany({
      $or: [
        { _id: commentId },
        { parentId: commentId }
      ]
    });

    await postModel.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -totalDeletedDocs }
    });

    return { success: true, message: "Comment deleted successfully!" };

  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, message: error.message };
  }
}

export async function deletePostById(postId) {
  try {
    const [sessionUser, post] = await Promise.all([
      getSessionUser(),
      postModel.findById(postId)
    ])

    if (!post) throw new Error("Post not exist!");
    if (sessionUser.id !== post.author._id.toString())
      throw new Error("Unathorized! You can only delete what is yours.");

    if (post.media) {
      await deleteFromCloudinary(post.media);
    }

    await Promise.all([
      postModel.findByIdAndDelete(postId),
      commentModel.deleteMany({ postId: postId }),
      userModel.findByIdAndUpdate(post.author._id, {
        $pull: { posts: postId },
        $inc: { postCount: -1 },
      }),
    ]);

    return {
      success: true,
      message: "Post deleted successfully!",
    };
  } catch (error) {
    console.log(`Error in Post deletion action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in Post deletion action : ${error.message || error}`,
    };
  }
}
"use server";

import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import commentModel from "@/models/commentModel";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "./userActions";
import { sendNotification } from "./notificationActions";
import { deleteFromCloudinary } from "@/helpers/Cloudinary";
import mongoose from "mongoose";

// export async function updatePost(postId, imageFile, postCaption) {
//   if (!imageFile) {
//     return {
//       success: false,
//       message: "No file image reached",
//     }
//   }

//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return {
//         success: false,
//         message: "Unauthorize",
//       }
//     }

//     const post = await postModel.findById(postId)

//     if (!post) {
//       return {
//         success: false,
//         message: "Post not found to edit",
//       }
//     }

//     if (!post.author._id === session.user.id) {
//       return {
//         success: false,
//         message: "You can edit what you own",
//       }
//     }

//     const response = await uploadToCloudinary(imageFile);

//     const newPost = new postModel({
//       author: session.user.id,
//       media: response.url,
//       mediaType: "image",
//       caption: postCaption,
//     });

//     await newPost.save();

//     const user = await userModel.findByIdAndUpdate(
//       session.user.id,
//       { $push: { posts: newPost._id } },
//       { new: true },
//     );

//     if (!user) {
//       return {
//           success: false,
//           message: "No user found for this post",
//         }
//     }

//     return {
//       success: true,
//       message: "Image Posted to user feed",
//     }
//   } catch (error) {
//     console.log("Error is Create Post route : ", error);
//     return {
//       success: false,
//       message: "Error is Create Post route",
//     }
//   }
// }

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
    console.error(`Error in get post by id action : ${error.message || error}`);

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
          `${process.env.NEXTAUTH_URL}/post/${postId}`
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
    console.error(`Error in getting All comment action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getting All comment action : ${error.message || error}`,
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
      { $push: { comments: newComment._id } },
      { new: true, session },
    )

    if (!updatedPost) throw new Error("Post not found");

    await session.commitTransaction()
    session.endSession()
    revalidatePath(`/home`);

    const receiverId = JSON.parse(JSON.stringify(updatedPost?.author));
    if (sessionUser.id !== receiverId) {
      await sendNotification(
        sessionUser.id,
        receiverId,
        "COMMENT",
        `${process.env.NEXTAUTH_URL}/post/${updatedPost._id}`
      );
    }
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
      userModel.findByIdAndUpdate(post.author._Id, {
        $pull: { posts: postId },
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

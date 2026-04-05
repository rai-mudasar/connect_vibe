"use server";

import { authOptions } from "@/lib/authOptions";
import connectToDb from "@/lib/dbConnect";
import commentModel from "@/models/commentModel";
import postModel from "@/models/postModel";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notificationActions";
import { deleteFromCloudinary } from "@/helpers/Cloudinary";
import userModel from "@/models/userModel";

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

export async function getAllPost() {
  try {
    connectToDb();

    const posts = await postModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName username profileImageUrl")
      .lean();

    if (!posts || posts.length === 0) {
      return {
        success: false,
        message: "No post Available",
        data: [],
      };
    }

    return {
      success: true,
      message: "Fetched Successfully",
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error) {
    console.log("Error in getting All post action : ", error);
    return {
      success: false,
      message: "Error in getting All post action",
    };
  }
}

export async function toggleLikes(postId) {
  console.log('Entered back');
  const session = await getServerSession(authOptions);

  try {
    await connectToDb();

    const post = await postModel.findById(postId);

    if (!post) {
      throw new Error("No post found!")
    }

    const hasLiked = post.likes.includes(session.user.id);

    if (hasLiked) {
      await postModel.findByIdAndUpdate(postId, {
        $pull: { likes: session.user.id },
      });
    } else {
      await postModel.findByIdAndUpdate(postId, {
        $addToSet: { likes: session.user.id },
      });
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/home`);
    return {
      success: true,
      message: hasLiked ? "Unliked" : "Liked",
    };
  } catch (error) {
    console.log("Error in like action : ", error);
    return {
      success: false,
      message: `Error in like action : ${error.message || error}`
    }
  }
}

export async function getPostAllcomments(postId) {
  try {
    connectToDb();

    const allComments = await commentModel
      .find({ postId })
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName profileImageUrl")
      .lean();

    if (!allComments || allComments.length === 0) {
      return {
        success: false,
        message: "No Comment Available",
      };
    }

    return {
      success: true,
      message: "Fetched Successfully",
      data: JSON.parse(JSON.stringify(allComments)),
    };
  } catch (error) {
    console.log("Error in getting All comment action : ", error);
    return {
      success: false,
      message: "Error in getting All comment action",
    };
  }
}

export async function addComment(postId, comment) {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session.user.id;

  try {
    await connectToDb();

    const newComment = await commentModel.create({
      postId,
      author: loggedInUserId,
      content: comment,
    });

    const post = await postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true },
    );

    if (!post) {
      return {
        success: false,
        message: "No post found for this comment",
      };
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/home`);

    const receiverId = post.author._id.toString();
    const response = await sendNotification(
      loggedInUserId,
      receiverId,
      "COMMENT",
    );
    if (response.success) {
      return {
        success: true,
        message: response.message,
      };
    }
  } catch (error) {
    console.log("Error in comment action : ", error);
    return {
      success: false,
      message: `Error in comment action : ${error.message}`,
    };
  }
}

export async function deletePost(postId) {
  try {
    await connectToDb();
    
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("You must be logged in");

    const post = await postModel.findById(postId);
    if (!post) throw new Error("Post not exist!");
    if (session.user.id !== post.author._id.toString())
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
    console.log(`Error in Post deletion : ${error.message || error}`);
    return {
      success: false,
      message: `Error in Post deletion : ${error.message || error}`,
    };
  }
}

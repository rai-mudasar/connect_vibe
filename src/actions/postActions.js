"use server";

import { authOptions } from "@/lib/authOptions";
import connectToDb from "@/lib/dbConnect";
import commentModel from "@/models/commentModel";
import postModel from "@/models/postModel";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notificationActions";

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
  const session = await getServerSession(authOptions);

  try {
    await connectToDb();
    const post = await postModel.findById(postId);

    if (!post) {
      return {
        success: false,
        message: "No post found!",
        data: [],
      };
    }

    const hasLiked = post.likes.some((id) => id.toString() === session.user.id);

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
      message: `Error in like action : ${error}`,
      data: [],
    };
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

    const receiverId = post.author._id.toString()
    const response =  await sendNotification(loggedInUserId, receiverId, "COMMENT");
    if(response.success) {
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

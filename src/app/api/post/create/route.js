import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/actions/userActions";
import { deleteFromCloudinary, uploadToCloudinary } from "@/helpers/Cloudinary";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const postCaption = formData.get("text");
  const postPrivacy = formData.get("privacy");

  let response;

  if (!file && !postCaption) {
    return NextResponse.json(
      {
        success: false,
        message: "Empty post is not allowed",
      },
      { status: 400 },
    );
  }

  try {
    const sessionUser = await getSessionUser();

    const user = await userModel.findById(sessionUser.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found for this post",
        },
        { status: 404 },
      );
    }

    response = file ? await uploadToCloudinary(file) : null;

    const newPost = new postModel({
      author: user._id,
      media: response?.url,
      mediaType: file ? "image" : null,
      caption: postCaption,
      privacy: postPrivacy,
    });

    user.posts.addToSet(newPost._id)
    user.postCount += 1
    await Promise.all([newPost.save(), user.save()]);


    return NextResponse.json(
      {
        success: true,
        message: "Image Posted to user feed",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(`Error is Create Post route : ${error.message || error}`);
    if (response?.url) {
      await deleteFromCloudinary(response?.url)
    }
    return NextResponse.json(
      {
        success: false,
        message: `Error is Create Post route : ${error.message || error}`,
      },
      { status: 500 },
    );
  }
}

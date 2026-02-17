import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import uploadToCloudinary from "@/helpers/uploadToCloudinary";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const postCaption = formData.get("text");

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: "No file image reached",
      },
      { status: 400 },
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 500 },
      );
    }

    const response = await uploadToCloudinary(file);

    if (!response?.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in Upload to cloudinary",
        },
        { status: 500 },
      );
    }

    const newPost = new postModel({
      author: session.user.id,
      media: response.url,
      mediaType: "image",
      caption: postCaption,
    });

    await newPost.save();

    const user = await userModel.findByIdAndUpdate(
      session.user.id,
      { $push: { posts: newPost._id } },
      { new: true },
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found for this post",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image Posted to user feed",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error is Create Post route : ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error is Create Post route",
      },
      { status: 500 },
    );
  }
}

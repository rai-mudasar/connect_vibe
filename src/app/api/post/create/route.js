import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { deleteFromCloudinary, uploadToCloudinary } from "@/helpers/Cloudinary";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const postCaption = formData.get("text");

  let response;

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

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 500 },
      );
    }

    const user = await userModel.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found for this post",
        },
        { status: 404 },
      );
    }

    response = await uploadToCloudinary(file);

    const newPost = new postModel({
      author: session.user.id,
      media: response.url,
      mediaType: "image",
      caption: postCaption,
    });

    user.posts.addToSet(newPost._id)
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
    if (response.url) {
      await deleteFromCloudinary(response.url)
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

import connectToDb from "@/lib/dbConnect";
import postModel from "@/models/postModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDb();

    const posts = await postModel
      .find({})
      .sort({ createdAt: -1})
      .populate("author", "firstName lastName username profileImageUrl")
      .lean();

    if (!posts || posts.length === 0) {
      console.log('No Post to show');
      return NextResponse.json(
        {
          success: false,
          message: "No post Available",
        },
        { status: 404 },
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "Fetched Successfully",
          data: posts,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log("Error in getting All post route : ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in getting All post route",
      },
      { status: 500 },
    );
  }
}

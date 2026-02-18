"use server";

import connectToDb from "@/lib/dbConnect";
import postModel from "@/models/postModel";
import { NextResponse } from "next/server";

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
      data: []
    };
  }
}

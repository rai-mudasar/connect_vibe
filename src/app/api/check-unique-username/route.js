import userModel from "@/models/userModel";
import connectToDb from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDb();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const existingUserByUsername = await userModel.findOne({
      username: queryParams.username,
    });

    if (existingUserByUsername) {
      if (existingUserByUsername.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Username is already taken",
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          {
            success: true,
            message: "Username is available",
          },
          { status: 200 },
        );
      }
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "Username is available",
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log("Error occur in unique username check: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

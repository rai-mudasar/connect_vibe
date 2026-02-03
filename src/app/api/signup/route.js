import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDb from "@/lib/dbConnect";
import sendEmail from "@/helpers/sendEmail";

export default async function POST(request) {
  await connectToDb();

  try {
    const { email, username, password } = await request.json();

    const existingUserByVerifiedEmail = await User.findOne({
      email,
      isVerified: true,
    });

    if (existingUserByVerifiedEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User exist with this email",
        },
        { status: 500 },
      );
    } else {
      const existingUserByVerifiedUsername = await User.findOne({
        username,
        isVerified: true,
      });

      if (existingUserByVerifiedUsername) {
        return NextResponse.json(
          {
            success: false,
            message: "User exist with this username",
          },
          { status: 500 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date.now();
        expiry.setHours(expiry.getHours() + 1);

        const newUser = {
          username,
          email,
          password: hashedPassword,
          isVerified: false,
          verificationOtp: otp,
          verificationOtpExpiry: expiry,
        };

        newUser.save();

        const emailResponse = sendEmail(username, email, otp);
        if (emailResponse.success) {
          return NextResponse.json(
            {
              success: true,
              message: 'Verfication Email sent successfully',
            },
            { status: 500 },
          );
        } else {
          return NextResponse.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 },
          );
        }
      }
    }
  } catch (error) {
    console.log("Error in signup : ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occurs in signup",
      },
      { status: 500 },
    );
  }
}

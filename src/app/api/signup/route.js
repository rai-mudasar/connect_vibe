import bcryptjs from "bcryptjs";
import connectToDb from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import userModel from "@/models/userModel";
import sendEmailToUser from "@/helpers/sendEmail";

export async function POST(request) {
  await connectToDb();

  try {
    const { email, username, password } = await request.json();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('Username : ', username);
    console.log('Email : ', email);
    const existingVerifiedUser = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User exist with this email or username",
        },
        { status: 500 },
      );
    } else {
      const existingUserUnVerified = await userModel.findOne({
        $or: [{ email: email }, { username: username }],
        isVerified: false,
      });

      if (existingUserUnVerified) {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        
        await userModel.findOneAndUpdate(
          {
            $or: [{ username: username }, { email: email }],
          },
          {
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationOtp: otp,
            verificationOtpExpiry: expiry,
          },
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        const newUser = new userModel({
          username,
          email,
          password: hashedPassword,
          isVerified: false,
          verificationOtp: otp,
          verificationOtpExpiry: expiry,
        });

        await newUser.save();
      }

      const emailResponse = await sendEmailToUser({
        username,
        email,
        otp,
        emailType: "VERIFY",
      });

      if (emailResponse.success) {
        return NextResponse.json(
          {
            success: true,
            message: emailResponse.message,
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log("Error in trycatch block of signup : ", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error occurs in signup : ${error.message}`,
      },
      { status: 500 },
    );
  }
}

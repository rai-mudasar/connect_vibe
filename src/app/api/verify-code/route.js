import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, code } = await request.json();

    try {
        await connectToDb();

        const user = await userModel.findOne({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 })
        }

        const validUser = user.verificationOtp == code;
        const codeNotExpired = new Date(user.verificationOtpExpiry) > new Date();

        if (validUser && codeNotExpired) {
            user.isVerified = true;
            user.verificationOtp = undefined;
            user.verificationOtpExpiry = undefined;
            await user.save();
            return NextResponse.json({
                success: true,
                message: "User Verified Successfully"
            }, { status: 200 })
        } else if (!validUser) {
            return NextResponse.json({
                success: false,
                message: "Invalid OTP"
            }, { status: 400 })
        } else {
            return NextResponse.json({
                success: false,
                message: "OTP is expired, please signup again"
            }, { status: 400 })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Verifying user error!"
        }, { status: 500 })
    }
}
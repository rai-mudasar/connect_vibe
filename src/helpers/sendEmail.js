import { NextResponse } from "next/server";
import resend from "@/lib/resend";
import emailTemplate from "../../emails/emailTemplate";

export default async function sendEmail({username, email, otp, emailType}) {
  try {
      const {data, error} = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Facebook | ${emailType}`,
      react: emailTemplate({username, otp, emailType}),
    })

    if(error) {
      return {
        success: false,
        message: `Error occurs in sending email : ${error.message}`,
      };
    }

    return {
      success: true,
      message: `${emailType} email send successfully`,
      data: data,
    };

  } catch (error) {
    console.log('Error in trycatch block of send email : ', error);
    return {
        success: false,
        message: `Something went wrong in sending email`,
      };
  }
}
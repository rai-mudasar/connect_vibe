import { sendEmail } from "@/lib/nodeMailer";
import { render } from "@react-email/render";
import emailTemplate from "../../emails/emailTemplate";

export default async function sendEmailToUser({ name, email, otp, emailType, resetLink }) {

  const emailHtml = await render(emailTemplate({ name, otp, emailType, resetLink }))
  try {
    const response = await sendEmail({
      to: email,
      subject: `Connect Vibe | ${emailType}`,
      html: emailHtml,
    });


    if (response.accepted.includes(email)) {
      return {
        success: true,
        message: `${emailType} email send successfully`,
      };
    }
    
    return {
      success: false,
      message: `Error occurs in sending email : ${error.message}`,
    };
  } catch (error) {
    console.log("Error in trycatch block of send email : ", error);
    return {
      success: false,
      message: `Error in sending email : ${error.message}`,
    };
  }
}

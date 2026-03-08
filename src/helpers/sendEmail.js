import { sendEmail } from "@/lib/nodeMailer";
import { render } from "@react-email/render";
import emailTemplate from "../../emails/emailTemplate";

export default async function sendEmailToUser({ username, email, otp, emailType }) {

  const emailHtml = await render(emailTemplate({ username, otp, emailType }))
  try {
    const response = await sendEmail({
      to: email,
      subject: `Facebook | ${emailType}`,
      html: emailHtml,
    });

    console.log('email response: ', response.accepted.includes(email));

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

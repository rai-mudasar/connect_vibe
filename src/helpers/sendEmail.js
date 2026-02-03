import resend from "@/lib/resend";
import emailTemplate from "../../emails/emailTemplate";

export default async function sendEmail({username, email, otp, emailType}) {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Facebook | '+ emailType,
      react: emailTemplate({username, otp, emailType}),
    })
}
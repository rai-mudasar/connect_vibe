import { validateResetPasswordOtp } from "@/actions/userActions";
import NewPassword from "./NewPassword";
import Link from "next/link";

export default async function ForgotPasswordNewWrapper({ param }) {
    const { code } = await param;
    const response = await validateResetPasswordOtp(code);
    const userId = response.success ? response.data : null;

    return (
        <div className={`w-full h-screen bg-bg-gray1 ${userId == null ? "flex justify-center pt-20 md:pt-10" : ""}`}>
            {userId != null ?
                <NewPassword userId={userId} />
                :
                <div className="h-[30%] md:h-[40%] bg-bg-white1 border border-border rounded-xl flex flex-col items-center py-13 px-10 text-center">
                    <p className="text-lg md:text-2xl text-text1">The reset password link is expired.<br />Please try again!</p>
                    <Link href={'/forgot-password'} className="text-md md:text-lg font-semibold px-6 py-2 mt-8 border border-border rounded-xl bg-primary text-white">Resend again</Link>
                </div>
            }
        </div>
    )
}

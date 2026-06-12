
import { Suspense } from "react";
import Loading from "@/components/Loading";
import ForgotPasswordNewWrapper from "@/components/forgot-password/ForgotPasswordNewWrapper";

export default function newPage({ params }) {
    const param = params;
    
    return (
        <Suspense fallback={<div className='w-screen h-screen'><Loading /></div>}>
            <ForgotPasswordNewWrapper param={param} />
        </Suspense>
    )
}
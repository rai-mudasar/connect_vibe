import { Suspense } from 'react';
import Loading from '@/components/Loading';
import ForgotPassword from '@/components/forgot-password/ForgotPassword';

export default function forgotPage() {
    return (
        <Suspense fallback={<div className='w-screen h-screen'><Loading /></div>}>
            <ForgotPassword />
        </Suspense>
    )
}
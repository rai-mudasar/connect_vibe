import { Suspense } from 'react';
import Loading from '@/components/Loading';
import Verify from '@/components/verify/Verify';

export default function verifyPage() {
    return (
        <Suspense fallback={<Loading />}>
            <Verify />
        </Suspense>
    )
}
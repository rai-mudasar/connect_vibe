import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="w-16 h-16 text-[#0866FF] transition animate-spin" />
        </div>
    )
}
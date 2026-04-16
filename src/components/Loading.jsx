import { Loader2 } from "lucide-react";

export default function Loading({className}) {
    return (
        <div className={`w-full h-full flex justify-center items-center ${className}`}>
            <Loader2 className="w-16 h-16 text-[#0866FF] transition animate-spin" />
        </div>
    )
}
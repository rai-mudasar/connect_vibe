import { Loader2 } from "lucide-react";

export default function Loading({className}) {
    return (
        <div className={`w-full h-full bg-bg flex justify-center items-center ${className}`}>
            <Loader2 className="w-16 h-16 text-primary transition animate-spin" />
        </div>
    )
}
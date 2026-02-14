// components/Modal.tsx
"use client";
import { useRouter } from "next/navigation";

export default function Modal({ children }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-brightness-25"
      onClick={() => router.back()}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

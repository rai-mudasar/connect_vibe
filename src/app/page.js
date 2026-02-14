'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();
  useEffect( () => {
    router.replace("/profile");
  }, [])
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-6xl font-bold">Hlow world</h1>
      <div className="w-40 text-2xl font-bold bg-amber-600 border-2 border-amber-600">
        <Link href={"/home"}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}

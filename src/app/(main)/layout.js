import { Suspense } from "react";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import NavbarSkeleton from "@/components/navbar/NavbarSkeleton";

export default function MainLayout({ children }) {
  return (
    <div className="w-full relative">
      <Suspense fallback={<NavbarSkeleton />}>
        <NavbarWrapper />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}

import { Suspense } from "react";
import Loading from "@/components/Loading";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";

export default function MainLayout({ children }) {
  return (
    <div className="w-full relative">
      <Suspense fallback={<Loading />}>
        <NavbarWrapper />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}

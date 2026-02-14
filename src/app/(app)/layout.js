import Navbar from "@/components/Navbar";



export default function MainLayout({ children, modal }) {
  return (
    <div className="w-full relative">
        {/* <NavBar /> */}
        <Navbar />
      <main>{children}</main>
      {modal}
    </div>
  )
}
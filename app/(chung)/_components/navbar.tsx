"use client"
import { NavbarRoutes } from "@/components/navbar-routes"
import { Logo } from "./logo"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export const Navbar = () => {
  const routes = useRouter()

  const handleNavigation = () => {
    const role = Cookies.get("role")
    switch (role) {
      case "sv":
          routes.push("/sinhvien/tkbsinhvien");
          break;
      case "gv":
          routes.push("/giangvien/tkbgv");
          break;
      case "admin":
          routes.push("/admin/quanly");
          break;
      default:
          break;
  }}

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm w-full">
      <div className="cursor-pointer flex gap-2 items-center text-xl font-bold" onClick={handleNavigation}><Logo />VLUTE ELEARNING</div>
      <NavbarRoutes />
    </div>
  )
}
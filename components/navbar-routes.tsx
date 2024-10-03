"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { redirect,usePathname } from "next/navigation";
import Link from "next/link";


export const NavbarRoutes = () => {
  return (
    <div className="flex gap-x-5 ml-auto">
          <div>
            <Link href={"/"} className="font-bold">
              Exit
            </Link>
          </div>
    </div>
  )
}
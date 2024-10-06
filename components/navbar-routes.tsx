"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineLogin } from "react-icons/md";
import Link from "next/link";
import Cookie from "js-cookie";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavbarRoutes = () => {
  const [loginstatus, setLoginStatus] = useState("");

  useEffect(() => {
    const status = Cookie.get("login") || "";
    setLoginStatus(status);
  }, []);

  const handleSignOut = () => {
    Cookie.remove("id");
    Cookie.remove("mssv");
    Cookie.remove("name");
    Cookie.set("login", "false");
    setLoginStatus("false");
  };

  return (
    <div className="flex gap-x-5 ml-auto">
      {loginstatus === "true" ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="ring-0 ">
              <Avatar className="bg-gray-300 p-1">
                <AvatarImage src="https://ems.vlute.edu.vn/images/vlute_icon36.png" alt="@shadcn" />
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Setting</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div>
          <Link href={"/login"} className="font-bold py-2 px-3 bg-blue-500 flex rounded-lg text-white justify-center items-center gap-2">
            <MdOutlineLogin fontWeight={100} size={25} className="font-black" />
            <span>Login</span>
          </Link>
        </div>
      )}
    </div>
  );
};

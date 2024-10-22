"use client";

import { BookMarked  } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

const Chungroute = [
  {
    icon: BookMarked,
    label: "Khóa học",
    href: "/books",
  },
];


export const SidebarRoutes = () => {

  return (
    <div className="flex flex-col w-full">
      {Chungroute.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

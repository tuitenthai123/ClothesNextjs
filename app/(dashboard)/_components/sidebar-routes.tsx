"use client";

import { FileCog , List,CalendarDays,BookMarked } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: CalendarDays,
    label: "Thời khóa biểu",
    href: "/",
  },
  {
    icon: BookMarked,
    label: "Môn học",
    href: "/monhoc",
  },
];

const teacherRoutes = [
  {
    icon: FileCog,
    label: "Chỉnh sửa khóa học",
    href: "/teacher/course",
  },
  {
    icon: List,
    label: "Quản lý khóa học",
    href: "/teacher/manager",
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}
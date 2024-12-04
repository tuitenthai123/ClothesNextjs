"use client";

import { useEffect, useState } from "react";
import { List, CalendarDays, BookMarked,UserRoundPen,ListChecks   } from "lucide-react";
import Cookies from "js-cookie";
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: CalendarDays,
    label: "Thời khóa biểu sinh viên",
    href: "/",
  },

  {
    icon: BookMarked,
    label: <p>Khóa học</p>,
    href: "/books",
  },
];

const sinhvienRoutes = [
  {
    icon: CalendarDays,
    label: <p>Thời khóa biểu sinh viên</p>,
    href: "/sinhvien/tkbsinhvien",
  },
  {
    icon: ListChecks,
    label: "Đề xuất khóa học",
    href: "/sinhvien/dexuat",
  },
  {
    icon: BookMarked,
    label: <p>Khóa học</p>,
    href: "/books",
  },

];

const teacherRoutes = [
  {
    icon: CalendarDays,
    label: "Lịch giảng viên",
    href: "/giangvien/tkbgv",
  },
  {
    icon: List,
    label: "Quản lý khóa học",
    href: "/giangvien/manager",
  },
  {
    icon: ListChecks,
    label: "Tra cứu đề xuất",
    href: "/giangvien/dexuat",
  },
  {
    icon: BookMarked,
    label: <p>Khóa học</p>,
    href: "/books",
  },
];

const adminRoutes = [
  {
    icon: UserRoundPen,
    label: "Quản lý tài khoản",
    href: "/admin/quanly",
  },
];

export const SidebarRoutes = () => {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    const cookieRole = Cookies.get("role");
    setRole(cookieRole || "guest"); 
  }, []);

  let routes;

  switch (role) {
    case "sv":
      routes = sinhvienRoutes;
      break;
    case "gv":
      routes = teacherRoutes;
      break;
    case "admin":
      routes = adminRoutes;
      break;
    default:
      routes = guestRoutes;
      break;
  }

  // Chỉ render khi role đã được lấy
  if (!role) return null;

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
  );
};

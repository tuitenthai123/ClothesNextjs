"use client"
import React, { useState } from "react"
import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sleep } from "@/lib/sleep";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import axios from "axios"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "masv",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
                >
                    Mã số SV
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
                >
                    Họ và tên
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "password",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
                >
                    Mật khẩu
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
                >
                    Quyền
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },


    {
        id: "actions",
        cell: ({ row }) => {
            const { id, masv, name, password, role } = row.original;
            const [isSheetOpen, setIsSheetOpen] = useState(false);
            const [newName, setNewName] = useState(name);
            const [newPassword, setNewPassword] = useState(password);
            const [newRole, setNewRole] = useState(role);
            const router = useRouter();

            const handleSaveChangeInfo = async () => {
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/admin/settinginfo`, {
                        id: id,
                        masv: masv,
                        name: newName,
                        password: newPassword,
                        role: newRole,
                    });
                    if (response?.data?.status) {
                        toast.success("chỉnh sửa thành công", {
                            autoClose: 2000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            theme: "light",
                        })
                        await sleep(5000)
                        router.refresh()
                    } else {
                        toast.error("chỉnh sửa thất bại", {
                            autoClose: 5000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            theme: "light",
                        })
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật thông tin:", error);
                }
            };

            return (
                <>
                    <ToastContainer />
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                                <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Chỉnh sửa</SheetTitle>
                                <SheetDescription>
                                    Chỉnh sửa thông tin: {name}
                                </SheetDescription>
                            </SheetHeader>
                            <div>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Họ và tên
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newName || ""}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            Mật khẩu
                                        </Label>
                                        <Input
                                            id="password"
                                            value={newPassword || ""}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            Quyền
                                        </Label>
                                        <Select value={newRole || ""} onValueChange={setNewRole}>
                                            <SelectTrigger className="w-64">
                                                <SelectValue placeholder={role} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="sv">Sinh viên</SelectItem>
                                                    <SelectItem value="gv">Giảng viên</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button
                                        type="button"
                                        className="bg-blue-600"
                                        onClick={handleSaveChangeInfo}
                                    >
                                        Lưu thông tin
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </>
            )
        }
    }
]

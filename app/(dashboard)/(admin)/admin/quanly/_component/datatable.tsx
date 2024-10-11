"use client"

import * as React from "react"
import axios from "axios";
import { LuRefreshCw } from "react-icons/lu";
import { TbUserX, TbUserPlus } from "react-icons/tb";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/sleep";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}
interface UserData {
    id: string;
    maso: string;
    hoten: string;
    pass: string;
    role: string;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
    const [isdeleteOpen, setIsdeleteOpen] = React.useState(false);
    const [iscreateOpen, setiscreateOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        maso: '',
        hoten: '',
        pass: '',
        role: "",
    });
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })
    const router = useRouter()

    const handleSelectRow = (rowId: string) => {
        setSelectedRows((prevSelectedRows) => {
            const updatedRows = new Set(prevSelectedRows)
            if (updatedRows.has(rowId)) {
                updatedRows.delete(rowId)
            } else {
                updatedRows.add(rowId)
            }
            return updatedRows
        })
    }



    const handleCreateUser = async () => {
        const cleanFormData = {
            maso: formData.maso.trim(),
            hoten: formData.hoten.trim(),
            pass: formData.pass.trim(),
            role: formData.role.trim(),
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/admin/themuser`, cleanFormData);
            if (response?.data?.status) {
                toast.success("Tạo sinh viên/giảng viên thành công", {
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
                await sleep(5000);
                router.refresh();
            } else {
                toast.error("Tạo thất bại", {
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDeleteUser = async () => {
        const selectedIds = Array.from(selectedRows);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/admin/xoauser`, {
                ids: selectedIds,
            });

            if (response?.data?.status) {
                toast.success("Xóa người dùng thành công", {
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
                await sleep(4000);
                setSelectedRows(new Set());
                router.refresh();
            } else {
                toast.error("Xóa thất bại", {
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Đã xảy ra lỗi khi xóa", {
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
        }
    };

    const isRowSelected = (rowId: string) => selectedRows.has(rowId)
    const isDeleteButtonDisabled = selectedRows.size === 0

    return (
        <Dialog open={iscreateOpen} onOpenChange={setiscreateOpen}>
            <ToastContainer />
            <AlertDialog open={isdeleteOpen} onOpenChange={setIsdeleteOpen}>
                <div className="flex items-center py-6 justify-between">
                    <div className="flex gap-5 w-full">
                        <Input
                            placeholder="tìm tên người dùng..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm p-6"
                        />
                        <Select
                            value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                            onValueChange={(value) => {
                                if (value === "all") {
                                    table.getColumn("role")?.setFilterValue(undefined); // Không lọc nếu chọn "Tất cả"
                                } else {
                                    table.getColumn("role")?.setFilterValue(value); // Lọc theo giá trị đã chọn
                                }
                            }}
                        >
                            <SelectTrigger className="max-w-sm p-6">
                                <SelectValue placeholder="Chọn quyền" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="sv">Sinh viên</SelectItem>
                                    <SelectItem value="gv">Giảng viên</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>


                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <Button onClick={() => { router.refresh(); }} variant={"outline"} size={"icon"}><LuRefreshCw size={24} /></Button>
                        <Button onClick={() => { setiscreateOpen(true) }} className="bg-green-400 flex gap-2 hover:bg-green-500" ><TbUserPlus size={24} /> Thêm user</Button>
                        <Button onClick={() => { setIsdeleteOpen(true) }} variant={"destructive"} className="gap-2 flex" disabled={isDeleteButtonDisabled}>
                            <TbUserX size={24} /> Xóa user
                        </Button>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedRows.size === table.getRowModel().rows.length}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRows(new Set(table.getRowModel().rows.map(row => row.id)))
                                                } else {
                                                    setSelectedRows(new Set())
                                                }
                                            }}
                                        />
                                    </TableHead>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        <TableCell className="w-12">
                                            <Checkbox
                                                checked={isRowSelected(row.original?.id)}
                                                onCheckedChange={() => handleSelectRow(row.original.id)}
                                            />
                                        </TableCell>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Một khi đã xác nhận User sẽ bị xóa và không thể khôi phục
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-600">Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* tạo user */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm sinh viên - giảng viên</DialogTitle>
                    <DialogDescription>
                        Thêm thông tin sinh viên và giảng viên tại đây
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maso" className="text-right">
                            Mã số
                        </Label>
                        <Input
                            id="maso"
                            name="maso"
                            value={formData.maso}
                            onChange={handleChange}
                            className="col-span-3"

                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hoten" className="text-right">
                            Họ và tên
                        </Label>
                        <Input
                            id="hoten"
                            name="hoten"
                            value={formData.hoten}
                            onChange={handleChange}
                            className="col-span-3"

                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pass" className="text-right">
                            Mật khẩu
                        </Label>
                        <Input
                            id="pass"
                            name="pass"
                            value={formData.pass}
                            onChange={handleChange}
                            className="col-span-3"

                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Quyền
                        </Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, role: value })} // Cập nhật role trực tiếp vào formData
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn quyền" />
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
                <DialogFooter>
                    <Button type="submit" onClick={handleCreateUser}>Thêm Sinh viên/Giảng viên</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

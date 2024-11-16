"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import { Separator } from "@/components/ui/separator"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Cookies from "js-cookie";
import { CiStar } from "react-icons/ci";
import { IoMdLock } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { FaPen, FaUserLock,FaUsers  } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { vi } from "date-fns/locale";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sleep } from '@/lib/sleep';
import { Spinner } from 'flowbite-react';

interface DataKhoaHoc {
  id_khoa: string;
  tenchuong: string;
  mota: string;
  permission: string;
  createdAt: string;
  updatedAt: string;
  tentacgia: string;
}
interface Datachuong {
  ten_chuong: string;
  id_chuong: string;
}
interface Datakiemtra {
  ten_kiemtra: string;
  id_khoahoc: string;
  id_kiemtra: string;
}

export default function Page() {
  const params = useParams<{ khoahoc: string }>();
  const routes = useRouter();
  const [teacher, setteacher] = React.useState("");
  const [datakhoahoc, setdatakhoahoc] = React.useState<DataKhoaHoc | null>(null);
  const [datachuong, setdatachuong] = React.useState<Datachuong[]>([]);
  const [datakiemtra, setdatakiemtra] = React.useState<Datakiemtra[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const [daghidanh, setdaghidanh] = useState(true);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    const fetchdata = async () => {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        makhoahoc: params?.khoahoc
      });
      const responseghidanh = await axios.post(`/api/tracuu/sinhvien/ghidanh`, { useId: Cookies.get("mssv"), khoahocId: params.khoahoc })
      const responsequiz = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/quiz`, {
        makhoahoc: params?.khoahoc
      });
      responseghidanh.data[0] ? setdaghidanh(true) : setdaghidanh(false);
      setdatakiemtra(responsequiz?.data);
      setdatakhoahoc(response?.data?.datakhoahoc[0]);
      setdatachuong(response?.data?.datachuong);
      setSelectedPermission(response?.data?.datakhoahoc[0]?.permission || "");
      await sleep(2000);
      setLoading(false);
    };

    if (Cookies.get("role") === "gv") {
      setteacher("true");
    } else {
      setteacher("false");
    }

    fetchdata();
  }, [params?.khoahoc]);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="flex gap-3 justify-center items-center">
          <Spinner aria-label="Default status example" size="xl" />
          <span className="text-gray-500 text-2xl font-bold">Đang tải...</span>
        </div>
      </div>
    )
  }

  const handleUpdate = async () => {
    try {
      await axios.post("/api/giangvien/updatekhoahoc", {
        id_khoa: datakhoahoc?.id_khoa,
        permission: selectedPermission
      });
      alert("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      alert("Đã xảy ra lỗi khi cập nhật quyền!");
    }
  };

  const handleGhidanh = async () => {
    try {
      const mssv = Cookies.get("mssv")
      await axios.post(`/api/sinhvien/ghidanh`, { useId: mssv, khoahocId: params.khoahoc })
      await sleep(1000)
      location.reload()
    } catch (error) {
      toast.error('Bạn đã ghi danh vào lớp học!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
  const handleRutghidanh = async () => {
    try {
      const mssv = Cookies.get("mssv")
      await axios.delete(`/api/sinhvien/ghidanh`, {
        params: {
          useId: mssv,
          khoahocId: params.khoahoc
        }
      })
      await sleep(1000)
      location.reload()
    } catch (error) {
      toast.error('Bạn đã ghi danh vào lớp học!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <Sheet>
      <ToastContainer />
      <div className='flex justify-between'>
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-transparent px-5 py-3 dark:bg-gray-800">
          <Breadcrumb.Item href="/books" icon={HiHome}>Home</Breadcrumb.Item>
          <Breadcrumb.Item >{datakhoahoc?.tenchuong || ""}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex flex-col items-center">
          {teacher === "true" ? "" : (
            !daghidanh ? (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-4 w-full"
                onClick={handleGhidanh}
              >
                Ghi danh vào khóa học
              </Button>
            ) : (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mb-4 w-full"
                onClick={handleRutghidanh}
              >
                Rời khỏi khóa học
              </Button>
            )
          )}

        </div>
      </div>
      <div className='p-5 w-full flex'>
        <div className='w-1/12'></div>
        <div className='ring-1 ring-gray-400/40 shadow-xl rounded-xl p-5 flex flex-col md:mx-10 bg-white flex-1'>
          <div className="w-full flex justify-between flex-1">
            <div className='flex flex-col gap-4 w-full'>
              <div className='flex flex-col gap-5 w-full'>
                <span className='text-4xl font-semibold text-left'>{datakhoahoc?.tenchuong}</span>
                <Separator className="w-full" />
                <span className='text-sm font-normal opacity-70 text-justify'>{datakhoahoc?.mota}</span>
              </div>
              <Separator className="w-full" />
              {datachuong.length > 0 ? datachuong.map((item) => (
                <div className='space-y-5' key={item.id_chuong}>
                  <div className='flex-1 h-16 flex items-center hover:bg-gray-100 rounded-md cursor-pointer' onClick={() => {
                    routes.push(`/books/${params?.khoahoc}/${item.id_chuong}`)
                  }}>
                    <div className='border-l-4 border-[#97b4ca] pl-2 p-2 ml-4'>
                      <span className='text-lg font-medium'>{item.ten_chuong}</span>
                    </div>
                  </div>
                </div>
              )) : <div className='flex items-center flex-1 justify-center'><span className='text-2xl '>Hiện chưa có chương nào được tạo</span></div>}
              {datakiemtra.map((item) => (
                <div className='space-y-5' key={item.id_kiemtra}>
                  <div className='flex-1 h-16 flex items-center hover:bg-gray-100 rounded-md cursor-pointer' onClick={() => {
                    routes.push(`/books/${params?.khoahoc}/kiemtra/${item.id_kiemtra}`)
                  }}>
                    <div className='border-l-4 border-orange-500/60 pl-2 p-2 ml-4'>
                      <span className='text-lg font-medium'>{item.ten_kiemtra}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-2/12 px-2 py-4 flex flex-col gap-5 ">
          <div className='opacity-55 hover:opacity-100 flex flex-col gap-2'>
            <span className="text-xl font-bold mt-2">Details</span>
            <ul>
              <div className="flex flex-col text-sm opacity-70 gap-2 justify-center">
                <div className="flex items-center gap-2">
                  <CiStar size={20} />
                  <span>
                    {datakhoahoc?.createdAt
                      ? formatDistanceToNow(parseISO(datakhoahoc.createdAt), { addSuffix: true, locale: vi })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPen size={16} />
                  <span>
                    {datakhoahoc?.updatedAt
                      ? formatDistanceToNow(parseISO(datakhoahoc.updatedAt), { addSuffix: true, locale: vi })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserClock size={20} />
                  <span className="">{datakhoahoc?.tentacgia}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaUserLock size={20} />
                  <span className="">{selectedPermission}</span>
                </div>
              </div>
            </ul>
          </div>
          {teacher === "true" ? (
            <div className='opacity-55 hover:opacity-100 flex gap-2 flex-col'>
              <span className="text-xl font-bold">Actions</span>
              <ul className=" ">
                <li><button onClick={() => { routes.push(`${params?.khoahoc}/addchuong`) }} className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><FiPlusCircle size={25} />Thêm chương</button></li>
                <li><button onClick={() => { routes.push(`${params?.khoahoc}/addkiemtra`) }} className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><FiPlusCircle size={25} />Thêm Kiểm tra</button></li>
                <li className='p-3'><Separator className="w-2/3 bg-gray-300" /></li>
                <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center" onClick={() => { routes.push(`${params?.khoahoc}/chinhsuabooks`) }}> <MdModeEditOutline size={25} />Chỉnh sửa</button></li>
                <SheetTrigger asChild>
                  <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><IoMdLock size={25} />Quyền</button></li>
                </SheetTrigger>
              </ul>
              <Separator className="w-2/3 bg-gray-300" />
              <span className="text-xl font-bold">Quản lý</span>
              <ul className=" ">
                <li><button onClick={() => { routes.push(`${params?.khoahoc}/quanlysinhvien`) }} className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><FaUsers  size={25} />Quản lý sinh viên</button></li>
              </ul>
            </div>
            
          ) : null}
        </aside>

        <SheetContent>
          <Select value={selectedPermission} onValueChange={setSelectedPermission}>
            <SheetHeader>
              <SheetTitle>Chỉnh sửa quyền</SheetTitle>
              <SheetDescription>
                Bạn có thể ẩn, chỉ xem, và toàn quyền
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="permission" className="text-right font-medium">
                  Quyền
                </Label>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedPermission} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup >
                    <SelectItem value="Lock">Lock</SelectItem>
                    <SelectItem value="View">View</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" onClick={handleUpdate}>Lưu thay đổi</Button>
              </SheetClose>
            </SheetFooter>
          </Select>
        </SheetContent>
      </div>
    </Sheet>
  );
}

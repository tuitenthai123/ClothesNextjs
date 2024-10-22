"use client";
import React, { useEffect, useState } from 'react';
import { FaUserLarge, FaBook } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Avatar } from "flowbite-react";
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import BookCard from '@/components/bookcard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = () => {

  interface User {
    name: string,
    role: string,
    maso: string,
  }

  interface KhoaHoc {
    id_khoa: string;
    tenchuong: string;
    mota: string;
    magv: string;
    tentacgia: string;
    createdAt: string;
    updatedAt: string;
    image: string;
  }
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [khoahoc, setkhoahoc] = useState<KhoaHoc[]>([])


  useEffect(() => {
    const name = Cookies.get("name") || "";
    const role = Cookies.get("role") === "gv" ? "Giảng viên" : "Sinh viên";
    const maso = Cookies.get("mssv") || "";

    const handlefetchkhoahoc = async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        maso
      })
      setkhoahoc(response?.data)
    }

    setUser({
      name: name.toUpperCase(),
      role: role,
      maso: maso
    });
    handlefetchkhoahoc()
  }, []);

  return (
    <div>
      <div className='p-2 flex flex-col gap-12'>
        {/* THÔNG TIN */}
        <div className='flex flex-col gap-2'>
          <div className='w-full'>
            <span className='text-2xl font-semibold text-blue-500 flex gap-2 items-center'>
              <FaUserLarge /> THÔNG TIN GIẢNG VIÊN
            </span>
            <Separator className="my-2 w-[30%] font-semibold bg-slate-700/30 md:block hidden" />
          </div>
          <div className='ring-1 ring-gray-400/40 shadow-lg rounded-xl p-5 flex gap-5 justify-between mx-3'>
            <div className='flex gap-5'>
              <Avatar className='flex rounded-2xl  justify-start items-start' size='lg' />
              <div className='flex flex-col'>
                <span className='font-medium text-green-500 text-xl'>{user?.name}</span>
                <span className='text-gray-500 text-sm'>Chức vụ: <span className='text-red-500'>{user?.role}</span></span>
                <span className='text-gray-500 text-sm'>Mã số giảng viên: <span className='text-red-500'>{user?.maso}</span></span>
              </div>
            </div>
            <div className='place-items-end grid'>
              <Button type='button'>Chỉnh sửa thông tin</Button>
            </div>
          </div>
        </div>

        {/* KHÓA HỌC */}
        <div>
          <div className='p-2 flex justify-between w-full'>
            <div className='w-full'>
              <span className='text-2xl font-semibold text-blue-500 flex gap-2 items-center'>
                <FaBook />THÔNG TIN KHÓA HỌC
              </span>
              <Separator className="my-2 w-4/12 font-semibold bg-slate-700/20 md:block hidden" />
            </div>
            <div>
              <Button type='button' onClick={() => { router.push("/taokhoahoc"); }} className='flex gap-2 bg-[#28a745] hover:bg-green-600'>
                <FaPlus className='font-semibold ' size={20} /> Thêm khóa học
              </Button>
            </div>
          </div>
          <div className='ring-1 ring-gray-400/40 shadow-xl rounded-xl p-5 flex justify-center items-center md:mx-24 mx-5'>
          {khoahoc[1] ?
          (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-center items-center">
              {khoahoc.map((book) => (
                <div onClick={()=>{
                  router.push(`${process.env.NEXT_PUBLIC_HOST}/books/${book.id_khoa}`)
                }}>
                  <BookCard
                    description={book.mota}
                    key={book.id_khoa}
                    image={book.image}
                    title={book.tenchuong}
                    createdTime={book.createdAt}
                    updatedTime={book.updatedAt}
                    author={book.tentacgia}
                  />
                </div>

              ))}
            </div>
            ): <span className='font-bold text-xl'>Hiện chưa tạo khóa học nào</span>}  
          </div>
        </div>
      </div>
    </div>

  );
}

export default Page;

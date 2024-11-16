"use client";
import React, { useEffect, useState } from 'react';
import { FaUserLarge, FaBook } from "react-icons/fa6";
import { Table } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import { Avatar } from "flowbite-react";
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import BookCard from '@/components/bookcard';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Spinner } from "flowbite-react";
import { sleep } from '@/lib/sleep';
import Link from 'next/link';

const Page = () => {

  interface User {
    name: string,
    role: string,
    maso: string,
  }
  const customtheme = {
    head: {
      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "bg-gray-400/75 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
      },
    },
  };
  interface KhoaHoc {
    id_khoa: string;
    tenchuong: string;
    mota: string;
    magv: string;
    tentacgia: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    permission: string;
    soluongsinhvien: string;
  }
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [khoahoc, setkhoahoc] = useState<KhoaHoc[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    const name = Cookies.get("name") || "";
    const role = Cookies.get("role") === "gv" ? "Giảng viên" : "Sinh viên";
    const maso = Cookies.get("mssv") || "";

    const handlefetchkhoahoc = async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        maso
      });
      setkhoahoc(response?.data);
      await sleep(2000);
      setLoading(false);
    }

    setUser({
      name: name.toUpperCase(),
      role: role,
      maso: maso
    });
    handlefetchkhoahoc()
  }, []);

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
          <div className='ring-1 ring-gray-400/40 shadow-lg rounded-xl p-5 flex gap-5 justify-between mx-3 bg-white'>
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
          <div className='mx-5'>
            {khoahoc[0] ?
              (
                <div className="overflow-x-auto">
                  <Table theme={customtheme} hoverable>
                    <Table.Head>
                      <Table.HeadCell>ID khóa học</Table.HeadCell>
                      <Table.HeadCell>Tên khóa học</Table.HeadCell>
                      <Table.HeadCell>Tác giả</Table.HeadCell>
                      <Table.HeadCell className=' w-16 text-ellipsis overflow-hidden'>Ảnh</Table.HeadCell>
                      <Table.HeadCell>Quyền</Table.HeadCell>
                      <Table.HeadCell>Sỉ số</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Chỉnh sửa</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {khoahoc.map((item) => (
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                          key={item.id_khoa}
                        >
                          <Table.Cell className="font-medium text-gray-900 dark:text-white" onClick={()=>{router.push(`/books/${item.id_khoa}`)}}>
                            {item.id_khoa}
                          </Table.Cell>
                          <Table.Cell onClick={()=>{router.push(`/books/${item.id_khoa}`)}}>{item.tenchuong}</Table.Cell>
                          <Table.Cell onClick={()=>{router.push(`/books/${item.id_khoa}`)}}>{item.tentacgia}</Table.Cell>
                          <Table.Cell onClick={()=>{router.push(`/books/${item.id_khoa}`)}}> <span className='line-clamp-2'>{item.image}</span> </Table.Cell>
                          <Table.Cell onClick={()=>{router.push(`/books/${item.id_khoa}`)}}>{item.permission}</Table.Cell>
                          <Table.Cell onClick={()=>{router.push(`/books/${item.id_khoa}`)}}>{item.soluongsinhvien}</Table.Cell>
                          <Table.Cell>
                            <Link href={`/books/${item.id_khoa}/chinhsuabooks`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                              Edit
                            </Link>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              ) : <span className='font-bold text-xl'>Hiện chưa tạo khóa học nào</span>}
          </div>
        </div>
      </div>
    </div>

  );
}

export default Page;

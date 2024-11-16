"use client";
import React, { useEffect, useState } from 'react';
import { FaUserLarge, FaBook } from "react-icons/fa6";
import { Table } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import { Avatar } from "flowbite-react";
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Spinner } from "flowbite-react";
import { sleep } from '@/lib/sleep';

const Page = () => {
  interface User {
    id: string;
    masv: string;
    name: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Enrollment {
    id: string;
    userId: string;
    khoahocId: string;
    enrolledAt: string;
    status: string;
    user: User;
    khoahoc: KhoaHoc;
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
  const params = useParams<{ khoahoc: string }>();
  const [khoahoc, setkhoahoc] = useState<KhoaHoc>();
  const [enrollmentData, setEnrollmentData] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    const handlefetchkhoahoc = async () => {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        makhoahoc: params.khoahoc
      });
      const response1 = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/giangvien/ghidanh`, {
        makhoahoc: params.khoahoc
      });
      setEnrollmentData(response1?.data);
      setkhoahoc(response?.data?.datakhoahoc[0]);
      await sleep(2000);
      setLoading(false);
    }
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
              <FaUserLarge /> THÔNG TIN KHÓA HỌC
            </span>
            <Separator className="my-2 w-[30%] font-semibold bg-slate-700/30 md:block hidden" />
          </div>
          <div className='ring-1 ring-gray-400/40 shadow-lg rounded-xl p-5 flex gap-5 justify-between mx-3 bg-white'>
            <div className='flex gap-5 cursor-pointer' onClick={()=>{router.push(`/books/${khoahoc?.id_khoa}`)}}>
              <Avatar className='flex rounded-2xl justify-start items-start' img={khoahoc?.image} size='lg' />
              <div className='flex flex-col'>
                <span className='font-medium text-green-500 text-xl'>{khoahoc?.tenchuong}</span>
                <span className='text-gray-500 text-sm'>Id khóa học: <span className='text-red-500'>{khoahoc?.id_khoa}</span></span>
                <span className='text-gray-500 text-sm'>Tác giả: <span className='text-red-500'>{khoahoc?.tentacgia}</span></span>
                <span className='text-gray-500 text-sm'>Số lượng sinh viên: <span className='text-red-500'>{khoahoc?.soluongsinhvien}</span></span>
              </div>
            </div>
            <div className='place-items-end grid'>
              <Button type='button' onClick={() => { router.push(`/books/${params?.khoahoc}/chinhsuabooks`) }}>Chỉnh sửa thông tin</Button>
            </div>
          </div>
        </div>

        {/* KHÓA HỌC */}
        <div>
          <div className='p-2 flex  w-full'>
            <div className='w-full'>
              <span className='text-2xl font-semibold text-blue-500 flex gap-2 items-center'>
                <FaBook />THÔNG TIN SINH VIÊN ĐÃ THAM GIA
              </span>
              <Separator className="my-2 w-4/12 font-semibold bg-slate-700/20 md:block hidden" />
            </div>
          </div>

          {enrollmentData[0] ? (
            <div className="overflow-x-auto">
              <Table theme={customtheme}>
                <Table.Head>
                  <Table.HeadCell>Id khóa học</Table.HeadCell>
                  <Table.HeadCell>Mã số sinh viên</Table.HeadCell>
                  <Table.HeadCell>Họ và tên</Table.HeadCell>
                  <Table.HeadCell>Ngày ghi danh</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {enrollmentData.map((item) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.khoahocId}
                      </Table.Cell>
                      <Table.Cell>{item.userId}</Table.Cell>
                      <Table.Cell>{item.user.name}</Table.Cell>
                      <Table.Cell>{format(item.enrolledAt, 'dd/MM/yyyy')}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className='flex items-center justify-center text-xl font-bold'>
              <span>Hiện tại chưa có sinh viên nào tham gia</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;

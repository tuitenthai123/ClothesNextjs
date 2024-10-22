"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import { Separator } from "@/components/ui/separator"
import Cookies from "js-cookie";
import { CiStar } from "react-icons/ci";
import { IoMdLock } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { vi } from "date-fns/locale";
import { formatDistanceToNow, parseISO } from 'date-fns';

interface DataKhoaHoc {
  id_khoa: string;
  tenchuong: string;
  mota: string;
  createdAt: string;
  updatedAt: string;
  tentacgia: string;
}
interface Datachuong {
  ten_chuong: string;
  id_chuong: string;
}

export default function Page() {
  const params = useParams<{ khoahoc: string }>();
  const routes = useRouter();
  const [teacher, setteacher] = React.useState("");
  const [datakhoahoc, setdatakhoahoc] = React.useState<DataKhoaHoc | null>(null);
  const [datachuong, setdatachuong] = React.useState<Datachuong[]>([]);

  React.useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        makhoahoc: params?.khoahoc
      });
      setdatakhoahoc(response?.data?.datakhoahoc[0]);
      setdatachuong(response?.data?.datachuong)
    };

    if (Cookies.get("role") === "gv") {
      setteacher("true");
    } else {
      setteacher("false");
    }

    fetchdata();
  }, []);

  return (
    <div className='p-5 w-full flex'>
      <div className='w-1/12'></div>
      <div className='ring-1 ring-gray-400/40 shadow-xl rounded-xl p-5 flex flex-col md:mx-24 bg-white flex-1'>
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
            <div>
            </div>
          </div>
        </div>
      </div>
      {teacher === "true" ? (
        <aside className="w-2/12 px-2 py-4 flex flex-col gap-8 ">
          <div className='opacity-55 hover:opacity-100 flex flex-col gap-2'>
            <span className="text-xl font-bold mt-2">Details</span>
            <ul>
              <div className="flex flex-col text-sm opacity-70 gap-2 justify-center">
                <div className="flex items-center gap-2">
                  <CiStar />
                  <span>
                    {datakhoahoc?.createdAt
                      ? formatDistanceToNow(parseISO(datakhoahoc.createdAt), { addSuffix: true, locale: vi })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPen size={10} />
                  <span>
                    {datakhoahoc?.updatedAt
                      ? formatDistanceToNow(parseISO(datakhoahoc.updatedAt), { addSuffix: true, locale: vi })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserClock size={13} />
                  <span className="">{datakhoahoc?.tentacgia}</span>
                </div>
              </div>
            </ul>
          </div>

          <div className='opacity-55 hover:opacity-100 flex gap-2 flex-col'>
            <span className="text-xl font-bold">Actions</span>
            <ul className=" ">
              <li><button onClick={() => { routes.push(`${params?.khoahoc}/addchuong`) }} className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><FiPlusCircle size={25} />Thêm chương</button></li>
              <li className='p-3'><Separator className="w-2/3 bg-gray-300" /></li>
              <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center" onClick={() => { routes.push(`${params?.khoahoc}/chinhsuabooks`) }}> <MdModeEditOutline size={25} />Chỉnh sửa</button></li>
              <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><IoMdLock size={25} />Quyền</button></li>
            </ul>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import { Separator } from "@/components/ui/separator"
import Cookies from "js-cookie";
import { CiStar } from "react-icons/ci";
import { IoMdLock } from "react-icons/io";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { MdModeEditOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { vi } from "date-fns/locale";
import { formatDistanceToNow, parseISO } from 'date-fns';



interface Datachuong {
  ten_chuong:string;
  id_chuong:string;
  tentacgia:string;
  version:string;
  content:string;
  createdAt:string;
  updatedAt:string;
}


const page = () => {
  const params = useParams<{ chuong:string }>();
  const routes = useRouter();
  const [teacher, setteacher] = React.useState("");
  const [datachuong, setdatachuong] = React.useState<Datachuong | null>(null);

  React.useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc/chuong`, {
        makhoahoc: params?.chuong
      });
      setdatachuong(response?.data[0])
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
              <span className='text-4xl font-semibold text-left'>{datachuong?.ten_chuong}</span>
              <Separator className="w-full" />
              <span className=''><FroalaEditorView model={datachuong?.content} /></span>
            </div>
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
                    {datachuong?.createdAt
                      ? formatDistanceToNow(parseISO(datachuong?.createdAt), { addSuffix: true, locale: vi })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPen size={10} />
                  <span>
                    {datachuong?.updatedAt
                      ? formatDistanceToNow(parseISO(datachuong?.updatedAt), { addSuffix: true, locale: vi })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserClock size={13} />
                  <span className="">{datachuong?.tentacgia}</span>
                </div>
              </div>
            </ul>
          </div>

          <div className='opacity-55 hover:opacity-100 flex gap-2 flex-col'>
            <span className="text-xl font-bold">Actions</span>
            <ul className=" ">
              <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"> <MdModeEditOutline size={25}/>Chỉnh sửa</button></li>
              <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><IoMdLock size={25}/>Quyền</button></li>
            </ul>
          </div>
        </aside>
      ) : null}
    </div>
  )
}

export default page
"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import { Separator } from "@/components/ui/separator"
import Cookies from "js-cookie";
import { CiStar } from "react-icons/ci";
import { IoMdLock } from "react-icons/io";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { MdModeEditOutline } from "react-icons/md";
import { FaPen, FaUserLock } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { FaUserClock } from "react-icons/fa6";
import { vi } from "date-fns/locale";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button"
import { FileInput, Label } from "flowbite-react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { FaFileUpload } from "react-icons/fa";
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
import storage from "@/lib/firebase_config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from 'next/link';

interface Datachuong {
  ten_chuong: string;
  id_chuong: string;
  permission: string;
  tentacgia: string;
  version: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  baitap: boolean;
}

interface Datanopbai {
  chapterId: string;
  fileName: string;
  fileUrl: string;
  khoahocId: string;
  userId: string;
}

interface DataKhoaHoc {
  id_khoa: string;
  tenchuong: string;
  mota: string;
  permission: string;
  createdAt: string;
  updatedAt: string;
  tentacgia: string;
}


const page = () => {
  const params = useParams<{ khoahoc: string, chuong: string }>();
  const routes = useRouter();
  const [teacher, setteacher] = React.useState("");
  const [datachuong, setdatachuong] = React.useState<Datachuong | null>(null);
  const [datakhoahoc, setdatakhoahoc] = React.useState<DataKhoaHoc | null>(null);
  const [datanopbai, setdatanopbai] = React.useState<Datanopbai | null>(null);
  const [selectedPermission, setSelectedPermission] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [namefile, setnamefile] = React.useState("")

  React.useEffect(() => {
    setLoading(true);
    const fetchdata = async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc/chuong`, {
        makhoahoc: params?.chuong
      });
      const responses = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
        makhoahoc: params?.khoahoc
      });

      const responsenopbai = await axios.post("/api/tracuu/sinhvien/nopbai", {
        maso: Cookies.get("mssv")
      })
      setdatanopbai(responsenopbai?.data[0])
      setnamefile(responsenopbai?.data[0]?.fileName)
      setdatakhoahoc(responses?.data?.datakhoahoc[0]);
      setdatachuong(response?.data[0])
      setSelectedPermission(response?.data[0]?.permission);
      await sleep(2000);
      setLoading(false);
    };

    if (Cookies.get("role") === "gv") {
      setteacher("true");
    } else {
      setteacher("false");
    }

    fetchdata();
  }, []);

  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip", // .zip
        "application/x-tar", // .tar
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("File không được hỗ trợ! Vui lòng chọn file .docx, .doc, .xlsx, .zip, hoặc .tar.");
        return;
      }
      const storageRef = ref(storage, `filenop/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          alert("Upload thất bại. Vui lòng thử lại!");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userId = Cookies.get("mssv")
          const filename = file.name
          const khoahocId = params.khoahoc
          const chapterId = params.chuong
          const datasend = {
            userId: userId,
            fileName: filename,
            khoahocId: khoahocId,
            chapterId: chapterId,
            fileUrl: downloadURL
          }
          await axios.post("/api/sinhvien/nopbai", datasend)
          setnamefile(filename)
        }
      );
    }
  };


  const handleUpdate = async () => {
    try {
      await axios.put("/api/giangvien/updatechuong", {
        id_chuong: datachuong?.id_chuong,
        permission: selectedPermission
      });
      alert("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      alert("Đã xảy ra lỗi khi cập nhật quyền!");
    }
  };

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
    <Sheet>
      <div>
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
          <Breadcrumb.Item href="/books" icon={HiHome}>Home</Breadcrumb.Item>
          <Breadcrumb.Item href={`/books/${params?.khoahoc}`}>{datakhoahoc?.tenchuong || ""}</Breadcrumb.Item>
          <Breadcrumb.Item >{datachuong?.ten_chuong || ""}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
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
                    <CiStar size={20} />
                    <span>
                      {datachuong?.createdAt
                        ? formatDistanceToNow(parseISO(datachuong?.createdAt), { addSuffix: true, locale: vi })
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPen size={16} />
                    <span>
                      {datachuong?.updatedAt
                        ? formatDistanceToNow(parseISO(datachuong?.updatedAt), { addSuffix: true, locale: vi })
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserClock size={20} />
                    <span className="">{datachuong?.tentacgia}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserLock size={20} />
                    <span className="">{selectedPermission}</span>
                  </div>
                </div>
              </ul>
            </div>

            <div className='opacity-55 hover:opacity-100 flex gap-2 flex-col'>
              <span className="text-xl font-bold">Actions</span>
              <ul className=" ">
                <li><button onClick={() => { routes.push(`/books/${params?.khoahoc}/${params?.chuong}/chinhsuachuong`) }} className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"> <MdModeEditOutline size={25} />Chỉnh sửa</button></li>
                <SheetTrigger asChild>
                  <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"><IoMdLock size={25} />Quyền</button></li>
                </SheetTrigger>
                <li><button onClick={() => { routes.push(`/books/${params?.khoahoc}/${params?.chuong}/quanlybaitap`) }} className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex gap-2 items-center"> <GrDocumentUser size={25} />Quản lý bài tập</button></li>
              </ul>
            </div>
          </aside>
        ) :
          (
            <div className='opacity-55 hover:opacity-100 flex gap-2 flex-col'>
              <span className="text-xl font-bold">Actions</span>
              {!datanopbai ? (
                <div>
                  <ul className=" ">
                    <FileInput
                      id='fileinput'
                      accept=".docx,.doc,.xlsx,.zip,.tar"
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <label htmlFor="fileinput" className='cursor-pointer w-3/12'>
                      <div className='flex gap-2 h-10 items-center ring rounded-lg ring-black w-full'>
                        <div className='w-[50px] bg-black rounded-l-lg h-full flex justify-center items-center'>
                          <FaFileUpload size={30} className='text-white' />
                        </div>
                        <div className='flex-1 p-5'>
                          <span className='line-clamp-1'>{namefile || "Chưa nộp bài"}</span>
                        </div>
                      </div>
                    </label>
                  </ul></div>
              ) : (
                <div className='flex flex-col gap-3'>
                  <ul className=''>
                    <FileInput
                      id='fileinput'
                      accept=".docx,.doc,.xlsx,.zip,.tar"
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <label htmlFor="fileinput" className='cursor-pointer'>
                      <div className='flex gap-2 h-10 items-center ring rounded-lg ring-black'>
                        <div className='w-[50px] bg-black rounded-l-lg h-full flex justify-center items-center'>
                          <FaFileUpload size={30} className='text-white' />
                        </div>
                        <div className='w-20'>
                          <span className='line-clamp-1 w-20'>{namefile || "Chưa nộp bài"}</span>
                        </div>
                      </div>
                    </label>
                    <div className='flex flex-col gap-2 text-xl font-bold mt-5 text-blue-600 w-60 '>
                      <span>Đã nộp bài:</span>
                      <Link className='line-clamp-1' href={datanopbai?.fileUrl || ""}>{datanopbai?.fileName}</Link>
                    </div>
                  </ul></div>
              )}

            </div>
          )}
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
  )
}

export default page
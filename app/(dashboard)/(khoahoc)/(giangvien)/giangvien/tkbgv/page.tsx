"use client";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";

const Page = () => {
  interface Student {
    id: number;
    itemCode: string;
    itemName: string;
  }

  const [tracuu, setTracuu] = useState(false);
  const [hocKy, setHocKy] = useState("42");
  const [masv, setMasv] = useState("");
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [tab11HTML, setTab11HTML] = useState<string>('');
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [loginstatus, setLoginStatus] = useState("");

  useEffect(() => {
    const fetchDataSV = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/giangvien`, {
          hocky: hocKy,
          masv: selectedItemCode,
        });
        setTab11HTML(response.data.tab11HTML);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDataSVlogin = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/giangvien`, {
          hocky: hocKy,
          masv: Cookies.get("mssv"),
        });
        setTab11HTML(response.data.tab11HTML);
      } catch (error) {
        console.error(error);
      }
    };
    const status = Cookies.get("login") || "";
    setLoginStatus(status);

    if (status === "true") {
      fetchDataSVlogin();
      setMasv(`${Cookies.get("mssv")} - ${Cookies.get("name")}`)
    }

    if (tracuu) {
      fetchDataSV();
      setTracuu(false);
    }
  }, [tracuu]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (masv.length >= 6) {
        try {
          const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/giangvien`, {
            masv: masv,
          });
          setStudentData(response.data);
        } catch (error) {
          console.error(error);
        }
      } else {
        setStudentData([]);
      }
    };

    fetchStudentData();
  }, [masv]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/giangvien`, {
        hocky: hocKy,
        masv: masv.trim(), 
      });
      setTab11HTML(response.data.tab11HTML); 
    } catch (error) {
      console.error(error);
    }
  };


  const handleSelectStudent = (student: Student) => {
    setMasv(`${student.itemCode} - ${student.itemName}`);
    setSelectedItemCode(student.itemCode);
    setStudentData([]); 
    setTracuu(true); 
  };

  return (
    <div>
      <div className='p-2 text-xl'>
        Thời khóa biểu giảng viên
      </div>
      <div className='p-2 flex gap-5'>
        <div className='flex w-8/12 relative'>
          <Input
            type="text"
            placeholder="Mã sinh viên"
            className='rounded-r-none focus-visible:ring-offset-0 focus-visible:ring-1 ring-black focus-visible:ring-green-500'
            value={masv}
            onChange={(e) => setMasv(e.target.value)}
          />
          <Button className='rounded-l-none' onClick={handleSubmit}>
            Tra cứu
          </Button>
          {studentData.length > 0 && (
            <div className="absolute z-10 rounded-b-lg top-10 bg-white border border-gray-300 w-11/12 max-h-60 overflow-y-auto">
              {studentData.map((student) => (
                <div
                  key={student.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectStudent(student)}
                >
                  {student.itemCode} - {student.itemName}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='w-6/12'>
          <Select value={hocKy} onValueChange={(value) => setHocKy(value)}>
            <SelectTrigger className="w-8/12">
              <SelectValue placeholder="Học kỳ 1, 2024-2025" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="42">Học kỳ 1, 2024-2025</SelectItem>
                <SelectItem value="41">Học kỳ hè, 2023-2024</SelectItem>
                <SelectItem value="40">Học kỳ 2, 2023-2024</SelectItem>
                <SelectItem value="39">Học kỳ phụ, 2023-2024</SelectItem>
                <SelectItem value="37">Học kỳ 1, 2023-2024</SelectItem>
                <SelectItem value="36">Học kỳ hè, 2022-2023</SelectItem>
                <SelectItem value="35">Học kỳ 2, 2022-2023</SelectItem>
                <SelectItem value="34">Học kỳ phụ, 2022-2023</SelectItem>
                <SelectItem value="33">Học kỳ 1, 2022-2023</SelectItem>
                <SelectItem value="32">Học kỳ hè, 2021-2022</SelectItem>
                <SelectItem value="31">Học kỳ 2, 2021-2022</SelectItem>
                <SelectItem value="30">Học kỳ phụ, 2021-2022</SelectItem>
                <SelectItem value="29">Học kỳ 1, 2021-2022</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="">
        <div className="p-2">
          {!tab11HTML ? (
            <div>
              <div className="p-5 border rounded-lg shadow-lg flex justify-center items-center">
                <span>Chưa có dữ liệu</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl">
              <div className="" dangerouslySetInnerHTML={{ __html: tab11HTML }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

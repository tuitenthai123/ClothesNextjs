"use client"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Page = () => {
  const [tracuu, settracuu] = useState(false)
  const [hocKy, setHocKy] = useState("42")
  const [masv, setMasv] = useState("")
  const [tab11HTML, setTab11HTML] = useState<string>('');

  useEffect(() => {
    const fetchDataSV = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/tracuu", {
          hocky: hocKy,
          masv: masv,
        })
        setTab11HTML(response.data.tab11HTML);
      } catch (error) {
        console.error(error)
      }
    }

    if (tracuu) {
      fetchDataSV()
      settracuu(false)
    }
  }, [tracuu])

  const handleSubmit = () => {
    settracuu(true)
  }

  return (
    <div>
      <div className='p-2 text-xl'>
        Thời khóa biểu sinh viên
      </div>
      <div className='p-2 flex gap-5'>
        <div className='flex w-8/12 '>
          <Input
            type="text"
            placeholder="Mã sinh viên"
            className='rounded-r-none focus-visible:ring-offset-0 focus-visible:ring-1 ring-black focus-visible:ring-green-500'
            value={masv}
            onChange={(e) => setMasv(e.target.value)} // Lưu giá trị vào state
          />
          <Button type="submit" className='rounded-l-none' onClick={handleSubmit}>
            Tra cứu
          </Button>
        </div>
        <div className='w-6/12'>
          <Select value={hocKy} onValueChange={(value) => setHocKy(value)}> {/* Lấy giá trị từ Select */}
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
          {!tab11HTML ?
            <div>
              <div className="p-5 border rounded-lg shadow-lg flex justify-center items-center">
                <span>Chưa có dữ liệu</span>
              </div>
            </div>
            :
            <div className="border p-2 rounded-lg shadow-xl">
              <div className="" dangerouslySetInnerHTML={{ __html: tab11HTML }} />
            </div>}
        </div>
      </div>
      <div className=" w-full p-2 bg-yellow-300">
        conmeo
      </div>
    </div>
  )
}

export default Page

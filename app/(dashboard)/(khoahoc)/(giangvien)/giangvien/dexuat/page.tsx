'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import axios from 'axios'

type StudyCard = {
  id: string
  course: {
    tenmon: string
    mamon: string
    sotinhchi: number
  }
}

type DayStudyCards = {
  [key: string]: StudyCard[]
}

export default function TeacherPage() {
  const [mssv, setMssv] = useState('')
  const [studentSchedule, setStudentSchedule] = useState<DayStudyCards[]>([])
  const [selectedSemester, setSelectedSemester] = React.useState<string>("42");

  const handleSearch = async () => {
    const response = await axios.post("/api/giangvien/checkdexuat", { mssv: mssv, hocki: selectedSemester })
    console.log(response)
    setStudentSchedule(response?.data?.response[0]?.schedule || [])
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Tìm kiếm đề xuất khóa học</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tìm sinh viên</CardTitle>
            <CardDescription>Chọn học kì và nhập mã số sinh viên để tìm sinh viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <div>
                <Select value={selectedSemester} onValueChange={(value) => {
                  setSelectedSemester(value);
                }}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    <SelectValue placeholder="Học kỳ 1, 2024-2025" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                    <SelectGroup>
                      <SelectItem value="42" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 1, 2024-2025</SelectItem>
                      <SelectItem value="43" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 2, 2024-2025</SelectItem>
                      <SelectItem value="44" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ hè, 2024-2025</SelectItem>
                      <SelectItem value="45" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ phụ, 2024-2025</SelectItem>
                      <SelectItem value="46" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 1, 2025-2026</SelectItem>
                      <SelectItem value="47" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 2, 2025-2026</SelectItem>
                      <SelectItem value="48" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ hè, 2025-2026</SelectItem>
                      <SelectItem value="49" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ phụ, 2025-2026</SelectItem>
                      <SelectItem value="50" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 1, 2026-2027</SelectItem>
                      <SelectItem value="51" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 2, 2026-2027</SelectItem>
                      <SelectItem value="52" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ hè, 2026-2027</SelectItem>
                      <SelectItem value="53" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ phụ, 2026-2027</SelectItem>
                      <SelectItem value="54" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 1, 2027-2028</SelectItem>
                      <SelectItem value="55" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 2, 2027-2028</SelectItem>
                      <SelectItem value="56" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ hè, 2027-2028</SelectItem>
                      <SelectItem value="57" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ phụ, 2027-2028</SelectItem>
                      <SelectItem value="58" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 1, 2028-2029</SelectItem>
                      <SelectItem value="59" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ 2, 2028-2029</SelectItem>
                      <SelectItem value="60" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ hè, 2028-2029</SelectItem>
                      <SelectItem value="61" className="text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900">Học kỳ phụ, 2028-2029</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex space-x-2'>
                <Input
                  type="text"
                  placeholder="Mã số sinh viên"
                  value={mssv}
                  onChange={(e) => {setMssv(e.target.value)}}
                  onKeyDown={(event:React.KeyboardEvent<HTMLInputElement>)=>{
                    if (event.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="flex-grow"
                />
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {
          studentSchedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Đề xuất khóa học sinh viên</CardTitle>
                <CardDescription>Thông tin của sinh viên {mssv}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-5'>
                  {
                    studentSchedule.map((item: any) => (              
                        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex-grow">
                              <CardTitle className="text-lg font-semibold text-gray-800 mb-1">{item.tenmon}</CardTitle>
                              <CardDescription className="text-sm text-gray-600 flex items-center">
                                <span className="font-medium text-indigo-600 mr-2">{item.mamon}</span>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                  {item.sotinhchi} tín chỉ
                                </span>
                              </CardDescription>
                            </div>
                          </CardHeader>
                        </Card>    
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )
        }
      </div>
    </div>
  )
}
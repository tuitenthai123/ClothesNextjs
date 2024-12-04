'use client'

import React, { useState } from 'react'
import { Search, Book, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios from 'axios'

type StudyCard = {
  id: string
  course: {
    tenmon: string
    mamon: string
    sotinhchi: number
  }
  timeSlots: {
    id: string
    start: string
    end: string
  }[]
}

type TimeSlot = {
  id: string
  start: string
  end: string
}

type DayStudyCards = {
  [key: string]: StudyCard[]
}
const TIME_SLOTS: TimeSlot[] = [
  { id: '1-2', start: '07:00', end: '08:20' },
  { id: '3', start: '08:40', end: '09:20' },
  { id: '4-5', start: '09:30', end: '10:50' },
  { id: '6-7', start: '13:00', end: '14:20' },
  { id: '8', start: '14:40', end: '15:20' },
  { id: '9-10', start: '15:30', end: '16:50' },
  { id: '11-12', start: '18:30', end: '19:50' },
  { id: '13', start: '20:00', end: '20:40' },
]
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TeacherPage() {
  const [mssv, setMssv] = useState('')
  const [studentSchedule, setStudentSchedule] = useState<DayStudyCards | null>(null)
  const [selectedSemester, setSelectedSemester] = React.useState<string>("42");

  const handleSearch = async () => {
    const mockSchedule: DayStudyCards = {
      Monday: [
        {
          id: '1',
          course: { tenmon: 'Web Development', mamon: 'WEB101', sotinhchi: 3 },
          timeSlots: [{ id: '1-2', start: '07:00', end: '08:20' }]
        }
      ],
      Wednesday: [
        {
          id: '2',
          course: { tenmon: 'Database Systems', mamon: 'DBS201', sotinhchi: 4 },
          timeSlots: [{ id: '6-7', start: '13:00', end: '14:20' }]
        }
      ],
      Friday: [
        {
          id: '3',
          course: { tenmon: 'Algorithms', mamon: 'ALG301', sotinhchi: 3 },
          timeSlots: [{ id: '4-5', start: '09:30', end: '10:50' }]
        }
      ]
    }
    const response = await axios.post("/api/giangvien/checkdexuat", { mssv: mssv, hocki: selectedSemester })
    console.log(response)
    setStudentSchedule(response?.data?.response[0]?.schedule)
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
                  onChange={(e) => setMssv(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {studentSchedule && (
          <Card>
            <CardHeader>
              <CardTitle>Student Schedule</CardTitle>
              <CardDescription>Thông tin của sinh viên {mssv}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={DAYS_OF_WEEK[0]}>
                <TabsList className="grid w-full grid-cols-7">
                  {DAYS_OF_WEEK.map((day) => (
                    <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
                      {day.slice(0, 3)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DAYS_OF_WEEK.map((day) => (
                  <TabsContent key={day} value={day}>
                    <div className="space-y-4">
                      {studentSchedule[day]?.map((card) => (
                        <Card key={card.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-800">{card.course.tenmon}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                              {card.course.mamon} - {card.course.sotinhchi} credits
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {card.timeSlots.map((slot) => `${slot.start} - ${slot.end}`).join(', ')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {!studentSchedule[day] && (
                        <p className="text-center text-gray-500">No classes scheduled for this day</p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" /> Xem lịch hàng tuần
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Thông tin chi tiết kế hoạch</DialogTitle>
                      <DialogDescription>Kế hoạch học tập của bạn tại đây</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-8 gap-2 mt-4">
                      <div className="font-bold"></div>
                      {DAYS_OF_WEEK.map(day => <div key={day} className="font-bold text-center">{day}</div>)}
                      {TIME_SLOTS.map(slot => (
                        <React.Fragment key={slot.id}>
                          <div className="text-sm font-medium text-gray-600">{slot.start}-{slot.end}</div>
                          {DAYS_OF_WEEK.map(day => {
                            const course = studentSchedule[day]?.find(card => card.timeSlots.some(ts => ts.id === slot.id))
                            return (
                              <div key={`${day}-${slot.id}`} className="border p-2 text-xs">
                                {course ? (
                                  <div className="bg-blue-100 p-1 rounded">
                                    <div className="font-semibold">{course.course.tenmon}</div>
                                    <div className="text-gray-600">{course.course.mamon}</div>
                                  </div>
                                ) : null}
                              </div>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Book className="h-4 w-4" />
                <span>Tổng số tính chỉ: {Object.values(studentSchedule).flat().reduce((acc, card) => acc + card.course.sotinhchi, 0)}</span>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
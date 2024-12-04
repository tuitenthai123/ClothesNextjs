'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash, Edit, Clock, Calendar, Save } from 'lucide-react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


type Course = {
  tenmon: string
  mamon: string
  sotinhchi: number
}

type TimeSlot = {
  id: string
  start: string
  end: string
}

type StudyCard = {
  id: string
  course: Course
  timeSlots: TimeSlot[]
}

type DayStudyCards = {
  [key: string]: StudyCard[]
}

type WeeklySchedule = {
  specialization: 'IOT' | 'Network'
  schedule: DayStudyCards
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

// Assuming the JSON data is imported or fetched
const courseData: any = [
  {
    "tenmon": "Triết học Mác - Lênin",
    "mamon": "CT2101",
    "sotinhchi": 3
  },
  {
    "tenmon": "Kinh tế CT Mác - Lênin",
    "mamon": "CT2102",
    "sotinhchi": 2
  },
  {
    "tenmon": "CNXH khoa học",
    "mamon": "CT2103",
    "sotinhchi": 2
  },
  {
    "tenmon": "Lịch sử Đảng CSVN",
    "mamon": "CT2104",
    "sotinhchi": 2
  },
  {
    "tenmon": "Tư tưởng HCM",
    "mamon": "CT1102",
    "sotinhchi": 2
  },
  {
    "tenmon": "Toán cao cấp A1",
    "mamon": "CB1106",
    "sotinhchi": 3
  },
  {
    "tenmon": "Toán cao cấp A2",
    "mamon": "CB1107",
    "sotinhchi": 3
  },
  {
    "tenmon": "Vật lý đại cương A1",
    "mamon": "CB1111",
    "sotinhchi": 3
  },
  {
    "tenmon": "Xác suất thống kê",
    "mamon": "CB1109",
    "sotinhchi": 3
  },
  {
    "tenmon": "Nguyên lý kế toán",
    "mamon": "EC1217",
    "sotinhchi": 2
  },

  {
    "tenmon": "Khởi nghiệp",
    "mamon": "EC1600",
    "sotinhchi": 1
  },

  {
    "tenmon": "Pháp luật đại cương",
    "mamon": "UL1104",
    "sotinhchi": 2
  },

  {
    "tenmon": "Kỹ thuật số",
    "mamon": "DT1282",
    "sotinhchi": 2
  },

  {
    "tenmon": "Tin học cơ sở",
    "mamon": "TH1201",
    "sotinhchi": 2
  },

  {
    "tenmon": "Tin học cơ sở",
    "mamon": "TH1201",
    "sotinhchi": 2
  },
  {
    "tenmon": "Toán rời rạc",
    "mamon": "TH1203",
    "sotinhchi": 2
  },
  {
    "tenmon": "Biên tập và soạn thảo VB",
    "mamon": "TH1227",
    "sotinhchi": 2
  },
  {
    "tenmon": "Cơ sở dữ liệu",
    "mamon": "TH1207",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình căn bản",
    "mamon": "TH1219",
    "sotinhchi": 4
  },
  {
    "tenmon": "Cấu trúc máy tính",
    "mamon": "TH1205",
    "sotinhchi": 3
  },
  {
    "tenmon": "Tin học ứng dụng",
    "mamon": "TH1522",
    "sotinhchi": 2
  },
  {
    "tenmon": "Lắp ráp cài đặt MT",
    "mamon": "TH1521",
    "sotinhchi": 2
  },
  {
    "tenmon": "Phân tích và thiết kế hệ thống thông tin",
    "mamon": "TH1305",
    "sotinhchi": 3
  },
  {
    "tenmon": "CTDL và GT",
    "mamon": "TH1206",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình hướng đối tượng",
    "mamon": "TH1209",
    "sotinhchi": 3
  },
  {
    "tenmon": "Hệ điều hành",
    "mamon": "TH1208",
    "sotinhchi": 3
  },
  {
    "tenmon": "An toàn và vệ sinh lao động trong lĩnh vực CNTT",
    "mamon": "TH1217",
    "sotinhchi": 1
  },
  {
    "tenmon": "Anh văn chuyên ngành",
    "mamon": "TH1354",
    "sotinhchi": 2
  },
  {
    "tenmon": "Phân tích và thiết kế thuật toán",
    "mamon": "TH1212",
    "sotinhchi": 2
  },
  {
    "tenmon": "Lập trình dotNET",
    "mamon": "TH1337",
    "sotinhchi": 4
  },
  {
    "tenmon": "Lập trình Java",
    "mamon": "TH1309",
    "sotinhchi": 3
  },
  {
    "tenmon": "Mạng máy tính",
    "mamon": "TH1214",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phần mềm mã nguồn mở",
    "mamon": "TH1216",
    "sotinhchi": 2
  },
  {
    "tenmon": "Xử lý ảnh",
    "mamon": "TH1335",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình Web",
    "mamon": "TH1336",
    "sotinhchi": 4
  },
  {
    "tenmon": "Lập trình ứng dụng cho thiết bị di động",
    "mamon": "TH1338",
    "sotinhchi": 4
  },
  {
    "tenmon": "Sensor và ứng dụng",
    "mamon": "TH1376",
    "sotinhchi": 3
  },
  {
    "tenmon": "Internet vạn vật",
    "mamon": "TH1359",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phân tích thiết kế hướng đối tượng",
    "mamon": "TH1324",
    "sotinhchi": 3
  },
  {
    "tenmon": "Trí tuệ nhân tạo",
    "mamon": "TH1333",
    "sotinhchi": 3
  },
  {
    "tenmon": "Bảo mật ứng dụng web",
    "mamon": "TH1358",
    "sotinhchi": 3
  },
  {
    "tenmon": "Hệ QTCSDL",
    "mamon": "TH1307",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phát triển ứng dụng IOT",
    "mamon": "TH1369",
    "sotinhchi": 3
  },
  {
    "tenmon": "Đồ án 1",
    "mamon": "TH1507",
    "sotinhchi": 1
  },
  {
    "tenmon": "Đồ án 2",
    "mamon": "TH1512",
    "sotinhchi": 2
  },
  {
    "tenmon": "Thực tập tốt nghiệp",
    "mamon": "TH1601",
    "sotinhchi": 2
  },
  {
    "tenmon": "Thương mại điện tử",
    "mamon": "TH1606",
    "sotinhchi": 3
  },
  {
    "tenmon": "Cơ sở dữ liệu phân tán",
    "mamon": "TH1607",
    "sotinhchi": 3
  },
  {
    "tenmon": "Chuyên đề về CNTT",
    "mamon": "TH1608",
    "sotinhchi": 4
  }
]

const iotCourses = [
  {
    "tenmon": "Hệ thống nhúng",
    "mamon": "TH1355",
    "sotinhchi": 3
  },
  {
    "tenmon": "Ứng dụng máy học trong IOT",
    "mamon": "TH1361",
    "sotinhchi": 2
  },
  {
    "tenmon": "Mạng trong IOT",
    "mamon": "TH1356",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phát triển ứng dụng IOT nâng cao",
    "mamon": "TH1357",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phân tích dữ liệu lớn trong IOT",
    "mamon": "TH1360",
    "sotinhchi": 3
  },
  {
    "tenmon": "Ứng dụng điện toán đám mây trong IOT",
    "mamon": "TH1362",
    "sotinhchi": 2
  },
  {
    "tenmon": "Bảo mật trong IOT",
    "mamon": "TH1377",
    "sotinhchi": 3
  }
]

const networkCourses = [
  {
    "tenmon": "Quản trị mạng máy tính",
    "mamon": "TH1339",
    "sotinhchi": 3
  },
  {
    "tenmon": "Thiết kế mạng máy tính",
    "mamon": "TH1316",
    "sotinhchi": 3
  },
  {
    "tenmon": "CN mạng không dây",
    "mamon": "TH1342",
    "sotinhchi": 2
  },
  {
    "tenmon": "Hệ thống thông tin quang",
    "mamon": "TH1526",
    "sotinhchi": 2
  },
  {
    "tenmon": "Triển khai hệ thống mạng văn phòng",
    "mamon": "TH1370",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình mạng",
    "mamon": "TH1314",
    "sotinhchi": 3
  },
  {
    "tenmon": "An toàn và an ninh thông tin",
    "mamon": "TH1341",
    "sotinhchi": 3
  }
]

export default function StudyPlan() {
  const [studyCards, setStudyCards] = useState<DayStudyCards>({})
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([])
  const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[0])
  const [specialization, setSpecialization] = useState<'IOT' | 'Network'>('Network')
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [isWeeklyScheduleOpen, setIsWeeklyScheduleOpen] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [selectedSemester, setSelectedSemester] = useState<string>("42")

  const allCourses = React.useMemo(() => {
    const specializedCourses = specialization === 'Network' ? networkCourses : iotCourses
    return [...courseData, ...specializedCourses]
  }, [specialization])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/tracuu/sinhvien/kehoach", { hocky: selectedSemester, userId: Cookies.get("mssv") })
        if (response?.data[0]?.schedule) {
          setStudyCards(response.data[0].schedule)
          updateSelectedCourses(response.data[0].schedule)
        } else {
          setStudyCards({})
          setSelectedCourses(new Set())
        }
      } catch (error) {
        console.error("Error fetching study plan:", error)

      }
    }
    fetchData()
  }, [selectedSemester])

  const updateSelectedCourses = (schedule: DayStudyCards) => {
    const courses = new Set<string>()
    Object.values(schedule).forEach(dayCards => {
      dayCards.forEach(card => courses.add(card.course.mamon))
    })
    setSelectedCourses(courses)
  }

  const addNewCard = (day: string) => {
    if (!selectedCourse || selectedTimeSlots.length === 0) return

    const newCard: StudyCard = {
      id: Date.now().toString(),
      course: selectedCourse,
      timeSlots: selectedTimeSlots,
    }

    setStudyCards(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newCard],
    }))

    setSelectedCourses(prev => new Set(prev).add(selectedCourse.mamon))
    setSelectedCourse(null)
    setSelectedTimeSlots([])
  }

  const removeCard = (day: string, cardId: string) => {
    setStudyCards(prev => {
      const updatedCards = {
        ...prev,
        [day]: prev[day].filter(card => card.id !== cardId)
      }
      const removedCard = prev[day].find(card => card.id === cardId)
      if (removedCard) {
        setSelectedCourses(prevSelected => {
          const newSelected = new Set(prevSelected)
          newSelected.delete(removedCard.course.mamon)
          return newSelected
        })
      }
      return updatedCards
    })
  }

  const editCard = (day: string, cardId: string, newCourse: Course, newTimeSlots: TimeSlot[]) => {
    setStudyCards(prev => {
      const updatedCards = {
        ...prev,
        [day]: prev[day].map(card =>
          card.id === cardId ? { ...card, course: newCourse, timeSlots: newTimeSlots } : card
        )
      }
      const oldCard = prev[day].find(card => card.id === cardId)
      if (oldCard && oldCard.course.mamon !== newCourse.mamon) {
        setSelectedCourses(prevSelected => {
          const newSelected = new Set(prevSelected)
          newSelected.delete(oldCard.course.mamon)
          newSelected.add(newCourse.mamon)
          return newSelected
        })
      }
      return updatedCards
    })
    setEditingCard(null)
  }

  const getAvailableTimeSlots = (day: string) => {
    const occupiedSlots = studyCards[day]?.flatMap(card => card.timeSlots.map(slot => slot.id)) || []
    return TIME_SLOTS.filter(slot => !occupiedSlots.includes(slot.id))
  }

  const handleTimeSlotChange = (selectedSlots: TimeSlot[]) => {
    if (!selectedCourse) return
    const requiredSlots = selectedCourse.sotinhchi <= 2 ? selectedCourse.sotinhchi : 3
    setSelectedTimeSlots(selectedSlots.slice(0, requiredSlots))
  }

  const saveWeeklySchedule = async () => {
    await axios.post("/api/sinhvien/kehoach", {
      userId: Cookies.get("mssv"),
      specialization: specialization,
      schedule: studyCards,
      hocky: selectedSemester
    })
  }

  return (
    <div className='p-4 bg-gray-100 min-h-screen'>
      <div className='text-3xl font-bold mb-6 text-center text-gray-800'>Lập kế hoạch học tập</div>
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 bg-white p-6 rounded-lg shadow-lg mb-8">
        <Select value={specialization} onValueChange={(value: 'IOT' | 'Network') => setSpecialization(value)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IOT">IOT</SelectItem>
            <SelectItem value="Network">Network</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
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
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">Kế hoạch học tập</CardTitle>
          <CardDescription className="text-gray-200">Sắp xếp lịch học hàng tuần</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              {DAYS_OF_WEEK.map(day => (
                <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
                  {day.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
            {DAYS_OF_WEEK.map(day => (
              <TabsContent key={day} value={day} className="mt-4">
                <div className="space-y-4">
                  {studyCards[day]?.map(card => (
                    <Card key={card.id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-800">{card.course.tenmon}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {card.course.mamon} - {card.course.sotinhchi} tính chỉ
                          </CardDescription>
                        </div>
                        <div className='flex space-x-2'>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCard(card.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCard(day, card.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{card.timeSlots.map(slot => `${slot.start}-${slot.end}`).join(', ')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <form onSubmit={(e) => { e.preventDefault(); addNewCard(day); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`course-${day}`}>Chọn môn học</Label>
                      <Select
                        value={selectedCourse?.mamon || ''}
                        onValueChange={(value) => {
                          const course = allCourses.find(c => c.mamon === value)
                          setSelectedCourse(course || null)
                          setSelectedTimeSlots([])
                        }}
                      >
                        <SelectTrigger id={`course-${day}`}>
                          <SelectValue placeholder="Lựa chọn môn học" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCourses
                            .filter(course => !selectedCourses.has(course.mamon))
                            .map((course) => (
                              <SelectItem key={course.mamon} value={course.mamon}>
                                {course.tenmon} ({course.mamon}) - {course.sotinhchi} tính chỉ
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedCourse && (
                      <div className="space-y-2">
                        <Label htmlFor={`timeslot-${day}`}>Chọn giờ học </Label>
                        <Select
                          value={selectedTimeSlots.map(slot => slot.id).join(',')}
                          onValueChange={(value) => {
                            const slots = value.split(',').map(id => TIME_SLOTS.find(slot => slot.id === id)!).filter(Boolean)
                            handleTimeSlotChange(slots)
                          }}
                        >
                          <SelectTrigger id={`timeslot-${day}`}>
                            <SelectValue placeholder="Chọn giờ học" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTimeSlots(day).map((slot) => (
                              <SelectItem key={slot.id} value={slot.id}>
                                {slot.start} - {slot.end}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={!selectedCourse || selectedTimeSlots.length === 0}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Thêm môn học
                    </Button>
                  </form>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between items-center p-6">
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
                      const course = studyCards[day]?.find(card => card.timeSlots.some(ts => ts.id === slot.id))
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
          <Button onClick={saveWeeklySchedule} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" /> Lưu thông tin
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
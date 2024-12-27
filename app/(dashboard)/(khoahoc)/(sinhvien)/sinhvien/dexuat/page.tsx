'use client'

import React, { useState, useEffect } from 'react'
import { Trash, Save, Calendar, X } from 'lucide-react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from "@/components/ui/scroll-area"


type Course = {
  tenmon: string
  mamon: string
  sotinhchi: number
}

type StudyPlan = {
  id: string
  userId: string
  schedule: Course[]
  specialization: string
  hocky: string
}

type SpecializationData = {
  id: string
  tenchuyennganh: string
  chuyennganh: string
}

const rawData: SpecializationData[] = [
  {
    "id": "7702c073-0ec5-493b-8311-0e27ddb068f8",
    "tenchuyennganh": "Network",
    "chuyennganh": "[]"
  }
]

const parseSpecializationData = (data: SpecializationData[]): Course[] => {
  if (data.length === 0) return []
  try {
    return JSON.parse(data[0].chuyennganh)
  } catch (error) {
    console.error("Error parsing specialization data:", error)
    return []
  }
}

const courseData: Course[] = parseSpecializationData(rawData)

export default function StudyPlan() {
  const [selectedSemester, setSelectedSemester] = useState<string>("42")
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [specialization, setSpecialization] = useState<'IOT' | 'Network'>('Network')
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [suggestedPlans, setSuggestedPlans] = useState<StudyPlan[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tinhchi, setTinhchi] = useState(0);
  const [allRegisteredCourses, setAllRegisteredCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const userPlanResponse = await axios.post("/api/tracuu/sinhvien/kehoach", { userId: Cookies.get("mssv") })

        const studyPlanData = userPlanResponse.data
        const filteredPlans = studyPlanData.filter((plan: any) => plan.hocky === selectedSemester);
        console.log(filteredPlans)
        setSelectedCourses(filteredPlans && filteredPlans.length > 0 ? filteredPlans[0].schedule || [] : [])
        const totalTinhchi = filteredPlans.reduce((acc: any, item: any) => {
          return acc + (item.schedule ? item.schedule.reduce((sum: number, course: any) => sum + course.sotinhchi, 0) : 0);
        }, 0);
        setTinhchi(totalTinhchi);
        const allCourses = studyPlanData.flatMap((plan: StudyPlan) => plan.schedule)
        setAllRegisteredCourses(allCourses)

        const coursesResponse = await axios.post("/api/tracuu/chuyennganh", { tenchuyennganh: specialization })
        if (coursesResponse.data && coursesResponse.data[0] && coursesResponse.data[0].chuyennganh) {
          const parsedCourses: Course[] = JSON.parse(coursesResponse.data[0].chuyennganh)
          const filteredCourses = parsedCourses.filter(course =>
            !allCourses.some((registeredCourse: any) => registeredCourse.mamon === course.mamon)
          )
          setAvailableCourses(filteredCourses)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [specialization, selectedSemester])

  useEffect(() => {
    console.log("Available courses updated:", availableCourses)
  }, [availableCourses])

  const addCourse = (course: Course) => {
    if (!allRegisteredCourses.some(registeredCourse => registeredCourse.mamon === course.mamon)) {
      setSelectedCourses(prev => [...prev, course]);
      setAllRegisteredCourses(prev => [...prev, course]);
      setTinhchi(prevTinhchi => prevTinhchi + course.sotinhchi);
    } else {
      alert("This course is already registered in another semester.");
    }
  };

  const removeCourse = (mamon: string) => {
    setSelectedCourses(prevCourses => {
      const updatedCourses = prevCourses.filter(course => course.mamon !== mamon);
      const removedCourse = prevCourses.find(course => course.mamon === mamon);
      if (removedCourse) {
        setTinhchi(prevTinhchi => prevTinhchi - removedCourse.sotinhchi);
      }
      return updatedCourses;
    });
  }

  const handlexemkehoach = async () => {
    try {
      const response = await axios.post("/api/tracuu/sinhvien/kehoach", { userId: Cookies.get("mssv") })
      console.log(response.data)
      setSuggestedPlans(response.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error fetching suggested plans:", error)
      alert("Có lỗi xảy ra khi tải kế hoạch đề xuất. Vui lòng thử lại sau.")
    }
  }

  const saveStudyPlan = async () => {
    try {
      await axios.post("/api/sinhvien/kehoach", {
        userId: Cookies.get("mssv"),
        schedule: selectedCourses,
        hocky: selectedSemester,
        specialization: specialization
      })
      alert("Kế hoạch học tập đã được lưu thành công!")
    } catch (error) {
      console.error("Error saving study plan:", error)
      alert("Có lỗi xảy ra khi lưu kế hoạch học tập. Vui lòng thử lại sau.")
    }
  }

  return (
    <div className='p-4 bg-gray-100 min-h-screen'>
      <div className='text-3xl font-bold mb-6 text-center text-gray-800'>Lập kế hoạch học tập</div>
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 bg-white p-6 rounded-lg shadow-lg mb-8">
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select semester" />
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
        <Select value={specialization} onValueChange={(value: 'IOT' | 'Network') => setSpecialization(value)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IOT">IOT</SelectItem>
            <SelectItem value="Network">Network</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">Kế hoạch học tập</CardTitle>
          <CardDescription className="text-gray-200">Chọn môn học cho kế hoạch của bạn</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-select">Chọn môn học</Label>
              {isLoading ? (
                <div>Loading courses...</div>
              ) : availableCourses.length > 0 ? (
                <Select
                  onValueChange={(value) => {
                    const course = availableCourses.find(c => c.mamon === value)
                    if (course) addCourse(course)
                  }}
                >
                  <SelectTrigger id="course-select">
                    <SelectValue placeholder="Lựa chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses
                      .filter(course => !allRegisteredCourses.some(rc => rc.mamon === course.mamon))
                      .map((course) => (
                        <SelectItem key={course.mamon} value={course.mamon}>
                          {course.tenmon} ({course.mamon}) - {course.sotinhchi} tín chỉ
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div>No courses available for the selected specialization.</div>
              )}
            </div>
            <AnimatePresence>
              {selectedCourses.map(course => (
                <motion.div
                  key={course.mamon}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex-grow">
                        <CardTitle className="text-lg font-semibold text-gray-800 mb-1">{course.tenmon}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 flex items-center">
                          <span className="font-medium text-indigo-600 mr-2">{course.mamon}</span>
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {course.sotinhchi} tín chỉ
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCourse(course.mamon)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-2 transition-colors duration-200"
                      >
                        <Trash className="h-5 w-5" />
                        <span className="sr-only">Remove course</span>
                      </Button>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className='flex justify-end items-center mt-5'>
            <div className='font-semibold text-slate-500'>Tổng tín chỉ: {tinhchi}</div>
          </div>

        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between items-center p-6">
          <Button onClick={handlexemkehoach} className="bg-blue-600 hover:bg-blue-700">
            <Calendar className='h-4 w-4 mr-2' /> Xem các đề xuất
          </Button>
          <Button onClick={saveStudyPlan} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" /> Lưu kế hoạch học tập
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Kế hoạch học tập đề xuất</DialogTitle>
      <DialogDescription>
        Dưới đây là các kế hoạch học tập được đề xuất dựa trên lịch sử học tập của bạn.
      </DialogDescription>
    </DialogHeader>
    <ScrollArea className="mt-4 max-h-[300px]">
      <div className="space-y-4">
        {suggestedPlans.map((plan, index) => (
          <Card key={plan.id} className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Đề xuất học kỳ {plan.hocky}</CardTitle>
              <CardDescription>
                Chuyên ngành: {plan.specialization}, Học kỳ: {plan.hocky}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {plan.schedule.map((course) => (
                  <li key={course.mamon} className="text-sm">
                    {course.tenmon} ({course.mamon}) - {course.sotinhchi} tín chỉ
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  </DialogContent>
</Dialog>

    </div>
  )
}


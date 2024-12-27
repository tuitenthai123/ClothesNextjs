"use client"
import React, { useState, useEffect } from "react"
import TimePicker from "rc-time-picker"
import moment from "moment"
import "rc-time-picker/assets/index.css"
import { Calendar } from "@/components/ui/calendar"
import { da, vi } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { FileInput } from "flowbite-react"
import axios from "axios"
import * as XLSX from "xlsx"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface Question {
    stt: number
    question: string
    A: string
    B: string
    C: string
    D: string
    correctAnswer: string
}

interface QuizData {
    id_kiemtra: string
    id_khoahoc: string
    ten_kiemtra: string
    passkiemtra: string
    questions: Question[]
    ngaybatdau: string
    endtime: string
}

export default function TestScheduleSetup() {
    const routes = useRouter()
    const params = useParams<{ khoahoc: string, kiemtra: string }>()
    const [testName, setTestName] = useState<string>("Tên bài kiểm tra mặc định")
    const [startTime, setStartTime] = useState<moment.Moment | null>(moment("08:00", "HH:mm"))
    const [endTime, setEndTime] = useState<moment.Moment | null>(moment("10:00", "HH:mm"))
    const [questions, setQuestions] = useState<Question[]>([])
    const [error, setError] = useState<string | null>(null)
    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.put<QuizData[]>(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/quiz`, {
                    makiemtra: params?.kiemtra
                })
                const endTime = moment(response?.data[0]?.endtime.split(" ")[1], "HH:mm")
                const startTime = moment(response?.data[0]?.ngaybatdau.split(" ")[1], "HH:mm")
                const startday = new Date(response?.data[0]?.ngaybatdau.split(" ")[0])
                const endday = new Date(response?.data[0]?.endtime.split(" ")[0])
                setDate({ from: startday, to: endday });
                setQuizData(response?.data[0])
                setEndTime(endTime)
                setStartTime(startTime)
                setTestName(response?.data[0]?.ten_kiemtra)
                setQuestions(response?.data[0]?.questions)
                setDate

                console.log("End Time:", endTime.format("HH:mm"))
                console.log("Start Time:", startTime.format("HH:mm"))
            } catch (err) {
                setError("Error fetching quiz data")
                console.error(err)
            }
        }
        fetchData()
    }, [params])

    const handleDateChange = (newDate: DateRange | undefined) => setDate(newDate)

    const handleTimeChange = (type: "start" | "end", value: moment.Moment | null) => {
        if (type === "start") setStartTime(value)
        else setEndTime(value)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target?.result
            const workbook = XLSX.read(data, { type: "binary" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            const [header, ...dataRows] = rows
            const expectedHeaders = ["stt", "question", "A", "B", "C", "D", "CorrectAnswer"]
            if (!header || !expectedHeaders.every((h, i) => header[i] === h)) {
                setError("Invalid Excel file format")
                return
            }

            const parsedQuestions: Question[] = []
            const errors: string[] = []
            dataRows.forEach((row, index) => {
                if (row && row.length > 0) {
                    const questionObj: Question = {
                        stt: row[0],
                        question: row[1],
                        A: row[2],
                        B: row[3],
                        C: row[4],
                        D: row[5],
                        correctAnswer: row[6],
                    }

                    const validAnswers = ["A", "B", "C", "D"]
                    if (!validAnswers.includes(questionObj.correctAnswer)) {
                        errors.push(`Row ${index + 2}: Invalid CorrectAnswer "${questionObj.correctAnswer}"`)
                    } else {
                        parsedQuestions.push(questionObj)
                    }
                }
            })

            if (errors.length > 0) {
                console.error("Errors found:", errors)
                setError(errors.join(", "))
            } else {
                setQuestions(parsedQuestions)
                setError(null)
            }
        }

        reader.onerror = () => {
            setError("Error reading file")
        }

        reader.readAsBinaryString(file)
    }

    const handleCombineData = async () => {
        if (!date?.from || !startTime || !endTime) {
            setError("Please select both date and time for start and end")
            return
        }

        const startDateTime = moment(date.from)
            .hour(startTime.hour())
            .minute(startTime.minute())
            .format("YYYY-MM-DD HH:mm")

        const endDateTime = moment(date.to || date.from)
            .hour(endTime.hour())
            .minute(endTime.minute())
            .format("YYYY-MM-DD HH:mm")
        const combinedData = {
            id_kiemtra:params?.kiemtra,
            testName,
            startDateTime,
            endDateTime,
            questions,
            id_khoahoc: params?.khoahoc,
        }

        try {
            await axios.post("/api/giangvien/updatekiemtra", { combinedData:combinedData })
            routes.back()
        } catch (error) {
            console.error("Error creating test:", error)
            setError("Failed to create test. Please try again.")
        }
    }

    const disablePastDates = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    }

    return (
        <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-lg max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-6">Thiết lập lịch kiểm tra</h1>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="testName">Tên bài kiểm tra</Label>
                    <Input
                        id="testName"
                        type="text"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        placeholder="Nhập tên bài kiểm tra"
                        className="w-full"
                    />
                </div>

                <div>
                    <Label>Chọn ngày kiểm tra</Label>
                    <Calendar
                        locale={vi}
                        mode="range"
                        selected={date} 
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                        className="w-full border rounded-lg p-4"
                        disabled={disablePastDates}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                        <TimePicker
                            value={startTime || undefined}
                            onChange={(value) => handleTimeChange("start", value)}
                            showSecond={false}
                            use12Hours
                            inputReadOnly
                            className="w-full"
                        />
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="endTime">Thời gian kết thúc</Label>
                        <TimePicker
                            value={endTime || undefined}
                            onChange={(value) => handleTimeChange("end", value)}
                            showSecond={false}
                            use12Hours
                            inputReadOnly
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="fileUpload">Tải lên file câu hỏi</Label>
                    <div className="flex flex-col gap-2">
                        <Button asChild className="w-full">
                            <a href="https://firebasestorage.googleapis.com/v0/b/doan2-e8d30.appspot.com/o/template%2Fdulieumau.xls?alt=media&token=296e3aab-eeda-4111-abf5-b0aaf34d0b86">
                                Tải mẫu bài kiểm tra
                            </a>
                        </Button>
                        <FileInput
                            id="fileUpload"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>

                {error && (
                    <Alert className="mt-4" variant="destructive">
                        <AlertCircle />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    className="w-full"
                    onClick={handleCombineData}
                >
                    Cập nhật
                </Button>
            </div>
        </div>
    )
}

"use client"

import React, { useState, useEffect } from "react"
import moment from "moment"
import axios from "axios"
import { useParams } from "next/navigation"
import QuestionChecker from "../_components/kiemtra"
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

const QuizPage = () => {
  const params = useParams<{ khoahoc: string; kiemtra: string }>()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.put<QuizData[]>(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/quiz`, {
          makiemtra: params?.kiemtra
        })
        console.log(response)
        if (response.data && response.data.length > 0) {
          setQuizData(response.data[0])
        } else {
          setError("No quiz data found")
        }
      } catch (err) {
        setError("Error fetching quiz data")
        console.error(err)
      }
    }
    fetchData()
    setIsLoading(false)
  }, [params?.kiemtra])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error || !quizData) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Quiz data not available"}</AlertDescription>
      </Alert>
    )
  }

  const now = moment()
  const startTime = moment(quizData.ngaybatdau)
  const endTime = moment(quizData.endtime)

  if (now.isBefore(startTime)) {
    return (
      <Alert  className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Bài kiểm tra chưa được mở</AlertTitle>
        <AlertDescription>
          Kiểm tra sẽ được thực hiện vào: {startTime.format("MMMM Do YYYY, h:mm a")}
        </AlertDescription>
      </Alert>
    )
  }

  if (now.isAfter(endTime)) {
    return (
      <Alert  className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hết thời hạn</AlertTitle>
        <AlertDescription>
          Xin lỗi, bạn đã lỡ bài kiểm tra vào lúc: {endTime.format("MMMM Do YYYY, h:mm a")}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{quizData.ten_kiemtra}</h1>
      <p className="mb-4">
        Quiz available until: {moment(quizData.endtime).format("MMMM Do YYYY, h:mm a")}
      </p>
      <QuestionChecker questions={quizData.questions} />
    </div>
  )
}

export default QuizPage
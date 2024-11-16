"use client"
import React from "react";
import QuestionChecker from "../_components/kiemtra";
import axios from "axios";
import { useParams } from "next/navigation";


interface Datakiemtra {
  ten_kiemtra: string;
  id_khoahoc: string;
  id_kiemtra:string;
}

const QuizPage = () => {
  const params = useParams<{ khoahoc:string,kiemtra: string }>();
  const [datakiemtra, setdatakiemtra] = React.useState<Datakiemtra[]>([]);
  const [questions, setquestions] = React.useState([  {
    stt: 1,
    question: "JavaScript có thể được chạy ở đâu?",
    A: "Trình duyệt",
    B: "Máy chủ",
    C: "Cả hai",
    D: "Chỉ trên máy chủ",
    correctAnswer: "C",
  },])

  React.useEffect(() => {
    const fetchdata = async ()  => {
      const responsequiz = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/quiz`, {
        makiemtra: params?.kiemtra
      });
      setquestions(responsequiz?.data[0]?.questions)
    }
  fetchdata()
  }, [])
  

  return <QuestionChecker questions={questions} />;
}

export default QuizPage
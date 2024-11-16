"use client";
import React, { useEffect, useState } from "react";
import chamDiem, { socaudung } from "@/lib/chamdiem";
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useParams } from "next/navigation";
import { generateRandomId } from "@/lib/randomID";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Spinner } from "flowbite-react";

interface Question {
  stt: number;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correctAnswer: string;
}

interface Datakiemtra {
  diemso: number;
  id_diem: string;
  id_khoahoc: string;
  kiemtraId: string;
  userId: string;
  username: string;
}

const QuestionChecker: React.FC<{ questions: Question[] }> = ({ questions }) => {
  const param = useParams<{ khoahoc: string; kiemtra: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(questions.length).fill(""));
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [caudung1, setsocaudung] = useState<number | null>(null);
  const [dakiemtra, setdakiemtra] = useState(false);
  const [dakiemtradata, setdakiemtradata] = useState<Datakiemtra[]>([]);
  const [loading, setLoading] = useState(true); // State loading
  const router = useRouter();

  const startQuiz = () => {
    setHasStarted(true);
  };

  const handleSubmit = async () => {
    if (!isSubmitted) {
      const result = questions.map((question, index) => ({
        stt: question.stt,
        selectedAnswer: selectedAnswers[index],
        correctAnswer: question.correctAnswer,
      }));
      const diemso = chamDiem(result);
      const caudung = socaudung(result);
      setsocaudung(caudung);
      const iddiem = await generateRandomId(6);
      await axios.post("/api/giangvien/chamdiem", {
        id_diem: iddiem,
        userId: Cookies.get("mssv"),
        username: Cookies.get("name"),
        kiemtraId: param.kiemtra,
        id_khoahoc: param.khoahoc,
        diemso: diemso,
      });
      setScore(diemso);
      setIsSubmitted(true);
      setShowScore(true);
    }
  };

  useEffect(() => {
    if(Cookies.get("role") === "gv"){
      router.push(`/books/${param.khoahoc}/kiemtra/${param.kiemtra}/xemdiem`)
    }
    setLoading(true);
    const checkkiemtra = async () => {
      try {
        const checkquiz = await axios.post("/api/tracuu/quiz/checkkiemtra", {
          kiemtraId: param.kiemtra,
          userId: Cookies.get("mssv"),
          id_khoahoc: param.khoahoc,
        });
        
        if (checkquiz.data[0]) {
          setdakiemtra(true);
          setdakiemtradata(checkquiz.data);
        } else {
          setdakiemtra(false);
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);
        setdakiemtra(false);
      } finally {
        setLoading(false);
      }
    };
    checkkiemtra();
  }, [param.kiemtra, param.khoahoc]);
  

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasStarted && !isSubmitted) {
        handleSubmit();
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const handlePopState = () => {
      handleSubmit();
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasStarted, isSubmitted]);

  const currentQuestion = questions[currentIndex];

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  if(loading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
      <div className="flex gap-3 justify-center items-center">
        <Spinner aria-label="Default status example" size="xl" />
        <span className="text-gray-500 text-2xl font-bold">Đang tải...</span>
      </div>
    </div>
    )
  }

    if (dakiemtra) {
      return (
        <div>
          <div>
            <div className="flex items-center">
              <button className="flex items-center text-blue-500 hover:text-blue-700 hover:bg-gray-200 p-2 rounded-lg" onClick={() => {
                router.back();
              }}>
                <IoArrowBack fontWeight={500} size={30} />
                <span className="text-xl font-bold">Trở lại khóa học</span>
              </button>
            </div>
          </div>
          {dakiemtradata.map((items) => (
            <div key={items.id_diem} className="flex items-center justify-center">
              <div className="p-8 bg-white rounded-lg shadow-lg text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Kết quả kiểm tra</h1>
                <p className="text-xl text-gray-700 text-center font-bold">Bạn đã hoàn thành bài kiểm tra!</p>
                <p className="text-xl text-gray-700 mt-4"><span className=" font-bold">Thông tin sinh viên:</span> <span className="text-red-500">{items?.userId} - {items?.username}</span></p>
                <p className="text-xl text-gray-700 mt-4  font-bold">Thông tin đề kiểm tra:</p>
                <p className="ml-5">+ Mã khóa học: <span className="text-red-500">{items?.id_khoahoc}</span></p>
                <p className="ml-5">+ Mã đề kiểm tra: <span className="text-red-500">{items?.kiemtraId}</span></p>
                <p className="text-2xl font-bold text-blue-600 mt-4 text-center">Điểm của bạn: {items?.diemso}/10</p>
              </div>
            </div>
          ))}
        </div>
      );
    }else{
      if (!hasStarted) {
        return (
          <AlertDialog>
            <div className="flex items-center justify-center">
              <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận làm bài kiểm tra</h1>
                <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn bắt đầu làm bài kiểm tra này không?</p>
                <AlertDialogTrigger>
                  <div
                    className="px-5 py-2 bg-blue-600 text-white rounded-md transition-all duration-200 hover:bg-blue-700 cursor-pointer"
                  >
                    <span>Bắt đầu kiểm tra</span>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận bài kiểm tra</AlertDialogTitle>
                    <AlertDialogDescription>
                      Khi thực hiện bài kiểm tra sẽ không thể dừng lại cho đến khi hoàn thành
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={startQuiz}>Thực hiện Kiểm tra</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </div>
            </div>
          </AlertDialog>
        );
      }
    }
  

 


  if (showScore) {
    return (
      <div>
        <div>
          <div className="flex items-center">
            <button className="flex items-center text-blue-500 hover:text-blue-700 hover:bg-gray-200 p-2 rounded-lg" onClick={() => {
              router.back();
            }}>
              <IoArrowBack fontWeight={500} size={30} />
              <span className="text-xl font-bold">Trở lại khóa học</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="p-8 bg-white rounded-lg shadow-lg text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Kết quả kiểm tra</h1>
            <p className="text-xl text-gray-700 text-center font-bold">Bạn đã hoàn thành bài kiểm tra!</p>
            <p className="text-2xl font-bold text-blue-600 mt-4 text-center">Điểm của bạn: {score}/10</p>
            <p className="text-xl font-bold text-blue-600 mt-4 text-center">Số câu trả lời đúng: {caudung1}/{questions.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center">
        <button className="flex items-center text-blue-500 hover:text-blue-700 hover:bg-gray-200 p-2 rounded-lg" onClick={() => {
          router.back();
        }}>
          <IoArrowBack fontWeight={500} size={30} />
          <span className="text-xl font-bold">Trở lại khóa học</span>
        </button>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-lg text-left mt-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Câu hỏi {currentQuestion.stt}</h1>
        <p className="text-lg text-gray-700 mb-6">{currentQuestion.question}</p>
        {["A", "B", "C", "D"].map((option) => (
          <button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full p-4 mb-3 text-left border rounded-lg transition-all duration-200 hover:bg-blue-100 ${
              selectedAnswers[currentIndex] === option ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {option}: {currentQuestion[option as keyof Question]}
          </button>
        ))}
        <div className="flex justify-between mt-6">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="px-5 py-2 bg-gray-600 text-white rounded-md disabled:bg-gray-300 transition-all duration-200"
          >
            Câu trước
          </button>
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-green-600 text-white rounded-md transition-all duration-200 hover:bg-green-700"
            >
              Nộp bài
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="px-5 py-2 bg-blue-600 text-white rounded-md transition-all duration-200 hover:bg-blue-700"
            >
              Câu tiếp theo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionChecker;

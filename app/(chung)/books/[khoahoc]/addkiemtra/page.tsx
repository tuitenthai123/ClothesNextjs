"use client";
import React, { useState } from "react";
import TimePicker from "rc-time-picker";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import { isBefore, isToday } from "date-fns";
import { DateRange } from "react-day-picker";
import { FileInput } from "flowbite-react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX for Excel file reading
import { useParams } from "next/navigation";

interface Question {
  stt: number;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correctAnswer: string;
}

const Page = () => {
  const params = useParams<{ khoahoc: string }>();
  const [testName, setTestName] = useState<string>(""); // State for test name
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (newDate: DateRange | undefined) => setDate(newDate);

  const handleTimeChange = (type: "start" | "end", value: moment.Moment | null) => {
    const formattedTime = value ? value.format("HH:mm") : null;
    if (type === "start") setStartTime(formattedTime);
    else setEndTime(formattedTime);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const [header, ...dataRows] = rows;
      const expectedHeaders = ["stt", "question", "A", "B", "C", "D", "CorrectAnswer"];
      if (!header || !expectedHeaders.every((h, i) => header[i] === h)) {
        setError("Invalid Excel file format");
        return;
      }

      const parsedQuestions: Question[] = [];
      const errors: string[] = [];
      dataRows.forEach((row, index) => {
        if (row && row.length > 0) { // Ignore empty rows
          const questionObj: Question = {
            stt: row[0],
            question: row[1],
            A: row[2],
            B: row[3],
            C: row[4],
            D: row[5],
            correctAnswer: row[6],
          };

          const validAnswers = ["A", "B", "C", "D"];
          if (!validAnswers.includes(questionObj.correctAnswer)) {
            errors.push(`Row ${index + 2}: Invalid CorrectAnswer "${questionObj.correctAnswer}"`);
          } else {
            parsedQuestions.push(questionObj);
          }
        }
      });

      if (errors.length > 0) {
        console.error("Errors found:", errors);
        setError(errors.join(", "));
      } else {
        setQuestions(parsedQuestions);
        setError(null);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
    };

    reader.readAsBinaryString(file);
  };

  const handleCombineData = async () => {
    const combinedData = {
      testName,
      dateRange: date,
      startTime,
      endTime,
      questions,
      id_khoahoc:params?.khoahoc,
    };
    const response = await axios.post("/api/giangvien/taokiemtra", { combinedData });
  };

  // Function to disable past dates
  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day for comparison
    return date < today;
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-4">Thiết lập lịch kiểm tra</h1>

      {/* Test Name Input */}
      <input
        type="text"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        placeholder="Tên bài kiểm tra"
        className="w-full p-2 mb-4 border rounded-lg"
      />

      {/* Date Range Picker */}
      <Calendar
        locale={vi}
        mode="range"
        selected={date}
        onSelect={handleDateChange}
        numberOfMonths={2}
        className="h-auto w-full border rounded-lg p-4 mb-4"
        disabled={(date) => isBefore(date, new Date()) && !isToday(date)}
      />

      {/* Time Pickers */}
      <div className="flex gap-4 mb-4">
        <TimePicker
          value={startTime ? moment(startTime, "HH:mm") : undefined}
          onChange={(value) => handleTimeChange("start", value)}
          showSecond={false}
          placeholder="Bắt đầu"
          className="w-full border p-2 rounded-lg"
        />
        <TimePicker
          value={endTime ? moment(endTime, "HH:mm") : undefined}
          onChange={(value) => handleTimeChange("end", value)}
          showSecond={false}
          placeholder="Kết thúc"
          className="w-full border p-2 rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid justify-items-stretch">
          <div className="w-full bg-black text-white font-medium py-1 rounded-lg hover:bg-gray-700 justify-self-end">
            <a href="https://firebasestorage.googleapis.com/v0/b/doan2-e8d30.appspot.com/o/template%2Fdulieumau.xls?alt=media&amp;token=296e3aab-eeda-4111-abf5-b0aaf34d0b86" className="flex justify-center items-center p-1">Mẫu bài kiểm tra</a>
          </div>
        </div>

      <FileInput
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 w-full border p-2 rounded-lg"
      />
      </div>


      {/* Display Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Combine Data Button */}
      <button
        onClick={handleCombineData}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
      >
        Xác nhận
      </button>
    </div>
  );
};

export default Page;

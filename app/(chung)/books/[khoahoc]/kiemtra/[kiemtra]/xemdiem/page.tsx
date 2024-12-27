"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { IoArrowBack } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { HiOutlineSave } from "react-icons/hi";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Spinner } from "flowbite-react";
import { sleep } from "@/lib/sleep";

const page = () => {
    const router = useRouter();

    interface Score {
        id_diem: number;
        userId: string;
        username: string;
        kiemtraId: string;
        id_khoahoc: string;
        diemso: string;
    }

    interface infokiemtra {
        ten_kiemtra: string;
    }

    interface datascourse {
        id_diemso: number;
        tenchuong: string;
        username: string;
        kiemtraId: string;
        id_khoahoc: string;
        diemso: string;
        soluongsinhvien: string;
    }

    const customtheme = {
        head: {
            base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
            cell: {
                base: "bg-gray-400/75 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
            },
        },
    };

    const param = useParams<{ khoahoc: string; kiemtra: string }>();
    const [datakiemtra, setdatakiemtra] = useState<Score[]>([]);
    const [datakhoahoc, setdatakhoahoc] = useState<datascourse[]>([]);
    const [infoKiemtra, setinfoKiemtra] = useState<infokiemtra>()
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchdata = async () => {
            const response = await axios.post("/api/tracuu/diemso", {
                id_khoahoc: param.khoahoc,
                kiemtraId: param.kiemtra,
            });
            console.log(response)
            const response1 = await axios.put("/api/tracuu/khoahoc", {
                makhoahoc: param.khoahoc
            })
            console.log(response1)
            const response2 = await axios.put("/api/tracuu/quiz", {
                makiemtra: param?.kiemtra
            })
            console.log(response2)
            setinfoKiemtra(response2?.data[0])
            setdatakiemtra(response?.data);
            setdatakhoahoc(response1?.data?.datakhoahoc)

            await sleep(3000);
            setLoading(false);
        };
        fetchdata();

    }, []);

    function removeWhiteSpaceAndAccents(str: string) {
        const strWithoutAccents = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const result = strWithoutAccents.replace(/\s+/g, "");
        return result;
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(datakiemtra.map(item => ({
            "ID điểm": item.id_diem,
            "Mã số sinh viên": item.userId,
            "Tên sinh viên": item.username,
            "Điểm số": item.diemso,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Điểm số");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${removeWhiteSpaceAndAccents(datakhoahoc[0]?.tenchuong)}-${param?.kiemtra}.xlsx`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-1 h-full">
                <div className="flex gap-3 justify-center items-center">
                    <Spinner aria-label="Default status example" size="xl" />
                    <span className="text-gray-500 text-2xl font-bold">Đang tải...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-8">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            onClick={() => router.push(`/books/${param.khoahoc}`)}
          >
            <IoArrowBack size={24} className="mr-2" />
            <span className="text-xl font-bold">Trở lại</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <HiOutlineSave size={20} className="mr-2" />
            <span>Lưu điểm</span>
          </button>
        </div>
  
        <div className="space-y-8">
          <section>
            <div className='text-2xl font-semibold text-blue-500 mb-4'>1. Thông tin kiểm tra</div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">Thông tin bài kiểm tra</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-600">Tên bài kiểm tra:</p>
                      <p className="text-gray-800">{infoKiemtra?.ten_kiemtra || 'Không có thông tin'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Mã kiểm tra:</p>
                      <p className="text-gray-800">{param?.kiemtra}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Mã khóa học:</p>
                      <p className="text-gray-800">{param?.khoahoc}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Số lượng sinh viên:</p>
                      <p className="text-gray-800">{datakhoahoc[0]?.soluongsinhvien}</p>
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-4" onClick={()=>{router.push(`/books/${param?.khoahoc}/kiemtra/${param?.kiemtra}/chinhsuakiemtra`)}}>
                  <FaPen size={18} />
                </button>
              </div>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
              <span className="mr-2">2. Thông tin sinh viên</span>
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {datakiemtra.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table theme={customtheme} hoverable>
                    <Table.Head>
                      <Table.HeadCell>ID điểm</Table.HeadCell>
                      <Table.HeadCell>Mã số sinh viên</Table.HeadCell>
                      <Table.HeadCell>Tên sinh viên</Table.HeadCell>
                      <Table.HeadCell>Điểm số</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {datakiemtra.map((item) => (
                        <Table.Row key={item.id_diem} className="bg-white hover:bg-gray-50 transition-colors duration-200">
                          <Table.Cell className="font-medium text-gray-900">{item.id_diem}</Table.Cell>
                          <Table.Cell>{item.userId}</Table.Cell>
                          <Table.Cell>{item.username}</Table.Cell>
                          <Table.Cell>{item.diemso}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <span className="text-xl font-semibold text-gray-500">Chưa có sinh viên nào thực hiện kiểm tra</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
};

export default page;

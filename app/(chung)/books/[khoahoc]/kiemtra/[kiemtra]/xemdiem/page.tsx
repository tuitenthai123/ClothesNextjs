"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineSave } from "react-icons/hi";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Spinner } from "flowbite-react";

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
    interface datascourse {
        id_diemso: number;
        tenchuong: string;
        username: string;
        kiemtraId: string;
        id_khoahoc: string;
        diemso: string;
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //setLoading(true);
        const fetchdata = async () => {
            const response = await axios.post("/api/tracuu/diemso", {
                id_khoahoc: param.khoahoc,
                kiemtraId: param.kiemtra,
            });
            const response1 = await axios.put("/api/tracuu/khoahoc", {
                makhoahoc: param.khoahoc
            })
            setdatakiemtra(response?.data);
            setdatakhoahoc(response1?.data?.datakhoahoc)

            //await sleep(2000);
            //setLoading(false);
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
        <div>
            <div className="flex justify-between mb-3">
                <button
                    className="flex items-center text-blue-500 hover:text-blue-700 hover:bg-gray-200 p-2 rounded-lg"
                    onClick={() => {
                        router.push(`/books/${param.khoahoc}`);
                    }}
                >
                    <IoArrowBack fontWeight={500} size={30} />
                    <span className="text-xl font-bold">Trở lại</span>
                </button>
                <div onClick={exportToExcel} className="cursor-pointer hover:bg-gray-700 p-2 rounded-lg bg-black text-white flex justify-center items-center">
                    <pre className="flex"><HiOutlineSave size={25} /> <span> Lưu điểm</span></pre>
                </div>
            </div>
            <div className="p-5 bg-white rounded-xl shadow-lg">
                {datakiemtra[0] ? (
                    <div>
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
                                        <Table.Row
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                            key={item.id_diem}
                                        >
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item.id_diem}
                                            </Table.Cell>
                                            <Table.Cell>{item.userId}</Table.Cell>
                                            <Table.Cell>{item.username}</Table.Cell>
                                            <Table.Cell>{item.diemso}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <span className="font-bold text-xl">Chưa sinh viên nào thực hiện kiểm tra</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default page;

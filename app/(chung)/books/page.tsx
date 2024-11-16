"use client"
import BookCard from '@/components/bookcard';
import React from 'react'
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const page = () => {
    const route = useRouter();
    interface KhoaHoc {
        id_khoa: string;
        tenchuong: string;
        mota: string;
        magv: string;
        tentacgia: string;
        createdAt: string;
        updatedAt: string;
        image: string;
    }
    const [khoahoc, setkhoahoc] = React.useState<KhoaHoc[]>([])
    React.useEffect(() => {
        const handlefetchkhoahoc = async () => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
            })
            setkhoahoc(response?.data)
        }

        handlefetchkhoahoc()
    }, []);
    return (
        <div className='p-5'>
            <div className='ring-1 ring-gray-400/40 shadow-xl rounded-xl bg-white p-5 flex flex-col md:mx-24 mx-5'>
                <div className="w-full flex justify-between items-center">
                    <span className='text-4xl font-semibold text-left'>Khóa học</span>
                    <span>sort</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {khoahoc.map((book) => (
                        <div
                            key={book.id_khoa}
                            onClick={() => {
                                route.push(`${process.env.NEXT_PUBLIC_HOST}/books/${book.id_khoa}`)
                            }}
                        >
                            <BookCard
                                key={book.id_khoa}
                                description={book.mota}
                                image={book.image}
                                title={book.tenchuong}
                                createdTime={book.createdAt}
                                updatedTime={book.updatedAt}
                                author={book.tentacgia}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default page
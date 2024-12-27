"use client"
import BookCard from '@/components/bookcard';
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { GoSortDesc } from "react-icons/go";

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
    const [sortOption, setSortOption] = React.useState<string>('update');
    React.useEffect(() => {
        const handlefetchkhoahoc = async () => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc`, {
            })
            const sortedData = response?.data.sort((a: KhoaHoc, b: KhoaHoc) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setkhoahoc(sortedData)
        }

        handlefetchkhoahoc()
    }, []);
    React.useEffect(() => {
        if (sortOption === 'create') {
          sortByCreatedAt();
        } else {
          sortByUpdatedAt();
        }
      }, [sortOption]);
    
      const sortByCreatedAt = () => {
        const sorted = [...khoahoc].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setkhoahoc(sorted);
      };
    
      const sortByUpdatedAt = () => {
        const sorted = [...khoahoc].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setkhoahoc(sorted);
      };
    return (
        <div className='p-5'>
            <div className='ring-1 ring-gray-400/40 shadow-xl rounded-xl bg-white p-5 flex flex-col md:mx-24 mx-5'>
                <div className="w-full flex justify-between items-center">
                    <span className='text-4xl font-semibold text-left'>Khóa học</span>
                    <div>
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                                <SelectGroup>
                                    <SelectItem value="create">Theo ngày tạo</SelectItem>
                                    <SelectItem value="update">Theo ngày cập nhật</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
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
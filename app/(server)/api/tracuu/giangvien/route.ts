import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { hocky, masv } = res;
        const response = await axios.post(`https://ems.vlute.edu.vn/vTKBGiangVien/ViewTKBGV?hocky=${hocky}&magv=${masv}`);
        const html = response.data;
        const $ = cheerio.load(html);
        $('#tab_11 table tbody tr.text-bold.info').each((index, element) => {
            const row = $(element);
            row.removeClass();
            row.addClass('bg-[#d9edf6] font-bold');
        });
        $('#tab_11 table tbody tr td').each((index, element) => {
            const row = $(element);
            row.addClass("border border-gray-300 px-4 py-2")
            if (row.hasClass("warning")) row.addClass('bg-yellow-100/65 p-2');
            if (row.hasClass("bg-gray")) row.addClass('bg-gray-400  p-2');
        });
        $('#tab_11 table tbody tr td span.label').addClass("p-2 rounded-lg bg-yellow-400 text-white ")
        let tab11HTML = $("#tab_11").html();
        return new Response(JSON.stringify({ tab11HTML }), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const res = await request.json();
        const { masv } = res;

        // Gửi yêu cầu GET đến API
        const response = await axios.get(`https://ems.vlute.edu.vn/api/danhmuc/getgiangvienbykeyword/${masv}`);

        // Chỉ lấy dữ liệu cần thiết từ response    
        const data = response.data;

        // Trả về dữ liệu dưới dạng JSON
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

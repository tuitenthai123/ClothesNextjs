import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { hocky, masv } = res;

        // Lấy dữ liệu từ API
        const response = await axios.post(`https://ems.vlute.edu.vn/vTKBSinhVien/ViewTKBSV?hocky=${hocky}&masv=${masv}`);
        const html = response.data;

        // Sử dụng cheerio để phân tích HTML
        const $ = cheerio.load(html);

        // Lấy nội dung HTML của phần tử có id="tab_11"
        const tab11HTML = $('#tab_11').html() || '';  // Lấy nội dung HTML của id="tab_11"

        // Trả về HTML đã được lọc
        return new Response(JSON.stringify({ tab11HTML }), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

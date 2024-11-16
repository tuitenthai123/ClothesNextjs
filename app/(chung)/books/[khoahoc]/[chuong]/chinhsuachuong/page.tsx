"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { IoArrowBack, IoSave } from "react-icons/io5";
import { Spinner } from "flowbite-react";
import { sleep } from '@/lib/sleep';
import { Switch } from "@/components/ui/switch"
import 'react-toastify/dist/ReactToastify.css';
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
const Froala = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

const froalaEditorConfig = {
    attribution: false,
    quickInsertEnabled: false,
    imageDefaultWidth: 0,
    imageUploadRemoteUrls: true,
    imageResizeWithPercent: true,
    imageMultipleStyles: false,
    imageOutputSize: true,
    imageRoundPercent: true,
    imageEditButtons: [
        "imageReplace",
        "imageAlign",
        "imageRemove",
        "imageSize",
        "-",
        "imageLink",
        "linkOpen",
        "linkEdit",
        "linkRemove"
    ],
    fontFamilySelection: true,
    fontFamily: { 'Arial,Helvetica,sans-serif': 'Arial', 'Georgia,serif': 'Georgia', 'Impact,Charcoal,sans-serif': 'Impact', 'Tahoma,Geneva,sans-serif': 'Tahoma', "'Times New Roman',Times,serif": 'Times New Roman', 'Verdana,Geneva,sans-serif': 'Verdana' },
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    imageInsertButtons: ["imageBack", "|", "imageUpload", "|", "imageByURL"],
    placeholderText: "@Nhập nội dung chương tại đây",
    colorsStep: 5,
    colorsText: ["#000000", "#2C2E2F", "#6C7378", "#FFFFFF", "#009CDE", "#003087", "#FF9600", "#00CF92", "#DE0063", "#640487", "REMOVE"],
    colorsBackground: ["#000000", "#2C2E2F", "#6C7378", "#FFFFFF", "#009CDE", "#003087", "#FF9600", "#00CF92", "#DE0063", "#640487", "REMOVE"],
    toolbarButtons: {
        moreRich: {
            buttons: ["bold", "italic", "underline", "insertHR", "insertLink", "insertTable", "|",],
            name: "additionals",
            buttonsVisible: 3
        },
        moreText: {
            buttons: [
                "fontFamily",
                "|",
                "paragraphFormat",
                "|",
                "fontSize",
                "textColor",
                "backgroundColor",
                "insertImage",
                "alignLeft",
                "alignRight",
                "alignJustify",
                "formatOL",
                "formatUL",
                "indent",
                "outdent"
            ],
            buttonsVisible: 6
        },
        moreMisc: {
            buttons: ["undo", "redo", "help", "|"],
            align: "right",
            buttonsVisible: 2
        }
    },
    events: {
        "image.beforeUpload": function (this: any, files: FileList) {
            const editor = this;
            if (files.length) {
                const reader = new FileReader();
                reader.onload = function (e: ProgressEvent<FileReader>) {
                    const result = e.target?.result;
                    editor.image.insert(result as string, null, null, editor.image.get());
                };
                reader.readAsDataURL(files[0]);
            }
            editor.popups.hideAll();
            return false;
        }
    }
};

export default function page(): React.ReactElement {
    const params = useParams<{ khoahoc: string, chuong: string }>();
    const router = useRouter();
    const [model, setModel] = React.useState<string>("");
    const [Baitap, setBaitap] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>("New Page");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        const fetchdata = async () => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/tracuu/khoahoc/chuong`, {
                makhoahoc: params?.chuong
            });
            setTitle(response?.data[0].ten_chuong || "")
            setModel(response?.data[0].content || "")
            setBaitap(response?.data[0].baitap || false)
            await sleep(1000);
            setLoading(false);

        };
        fetchdata();
    }, []);

    const onModelChange = (newModel: string) => {
        setModel(newModel);
    };

    const handleSavemodel = async () => {
        try {
            const dataToSend = {
                title: title,
                content: model,
                id_chuong: params?.chuong,
                baitap: Baitap
            };
            await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/giangvien/updatechuong`, dataToSend);
            router.push(`/books/${params?.khoahoc}/${params?.chuong}`)
        } catch (error) {
            console.error("Error saving model:", error);
        }
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
        <div className="bg-white border rounded-lg shadow-md p-5 h-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 hover:bg-gray-200 p-2 rounded-lg" onClick={() => {
                        router.back();
                    }}>
                        <IoArrowBack fontWeight={500} size={30} />
                        <span className="text-xl font-bold">Trở lại</span>
                    </button>
                </div>

                <div className="flex space-x-3">
                    <button className="text-green-600 hover:text-green-800 flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg" onClick={handleSavemodel}>
                        <IoSave fontWeight={500} size={26} />
                        <span className="text-xl font-bold">Lưu</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-5 justify-center">
                <input
                    type="text"
                    value={title}
                    className="w-full p-3 mb-4 text-2xl font-semibold border-b-2 border-gray-300 rounded-xl focus:outline-none"
                    onChange={(e) => setTitle(e.target.value)}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Froala
                    tag="textarea"
                    model={model}
                    onModelChange={onModelChange}
                    config={froalaEditorConfig}
                />
                <div className="flex items-center gap-3">
                    <span className="font-bold text-xl">Yêu cầu nộp bài: </span>
                    <Switch defaultChecked={Baitap} onCheckedChange={() => { setBaitap(!Baitap) }} />
                </div>
            </div>

        </div>
    );
}
import { axiosInstance } from "@/utils";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_API_SERVER;

export async function uploadFile(
	file: File, // 업로드할 파일
	setItemCallback: (arg0: (prevItem: any) => any) => void, // state
	itemType: string, // 파일 타입 - mainImages or soundFile
) {
	const formData = new FormData();
	formData.append("attach", file);

	try {
		const response = await axiosInstance.post(`/files`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const filePath = `${API_KEY}${response.data.file.path}`;
		const name = response.data.file.name;
		const originalname = response.data.file.originalname;
		const duration =
			itemType === "soundFile" ? await loadAudio(filePath) : null;

		// 상태 업데이트
		setItemCallback((prevItem) => {
			if (itemType === "image") {
				return {
					...prevItem,
					mainImages: [
						{
							path: filePath,
							name: name,
							originalname: originalname,
						},
					],
				};
			} else if (itemType === "soundFile") {
				return {
					...prevItem,
					extra: {
						...prevItem.extra,
						soundFile: {
							path: filePath,
							name: name,
							originalname: originalname,
							duration: duration,
						},
					},
				};
			} else {
				return prevItem;
			}
		});

		toast.success("파일 업로드 성공!", {
			ariaProps: {
				role: "status",
				"aria-live": "polite",
			},
		});
		return filePath;
	} catch (error) {
		console.error("에러 발생:", error);
		return null;
	}
}

async function loadAudio(filePath: string) {
	try {
		// Load an audio file
		const response = await fetch(filePath);
		// Decode it
		const buffer = await response.arrayBuffer();
		return new Promise((resolve, reject) => {
			const audioContext = new (window.AudioContext || window.AudioContext)();
			audioContext.decodeAudioData(
				buffer,
				(decodedData) => {
					resolve(decodedData.duration);
				},
				(err) => {
					console.error("Error decoding audio data:", err);
					reject(err);
				},
			);
		});
	} catch (error) {
		console.error(error);
	}
}

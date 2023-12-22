import { axiosInstance } from "@/utils";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_API_SERVER;

export async function uploadFile(
	file: File,
	setItemCallback: (arg0: (prevItem: any) => any) => void,
	itemType: string,
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
		const response = await fetch(filePath);

		const buffer = await response.arrayBuffer();
		return new Promise((resolve, reject) => {
			const audioContext = new (window.AudioContext || window.AudioContext)();
			audioContext.decodeAudioData(
				buffer,
				(decodedData) => {
					resolve(decodedData.duration);
				},
				(error) => {
					console.error("Error decoding audio data:", error);
					reject(error);
				},
			);
		});
	} catch (error) {
		console.error(error);
	}
}

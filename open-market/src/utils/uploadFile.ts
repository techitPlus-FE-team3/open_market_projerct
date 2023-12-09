// import axiosInstance from "@/api/instance";
import axiosInstance from "@/utils/refreshToken";
import toast from "react-hot-toast";

export async function uploadFile(
	file: string, // 업로드할 파일
	setItemCallback: (arg0: (prevItem: any) => any) => void, // state
	itemType: string, // 파일 타입 - mainImages or soundFile
) {
	const formData = new FormData();
	formData.append("attach", file);

	try {
		const accessToken = localStorage.getItem("accessToken");

		const response = await axiosInstance.post(`/files`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const filePath = `https://localhost${response.data.file.path}`;
		// 상태 업데이트
		setItemCallback((prevItem) => {
			if (itemType === "image") {
				return { ...prevItem, mainImages: [filePath] };
			} else if (itemType === "soundFile") {
				return {
					...prevItem,
					extra: { ...prevItem.extra, soundFile: filePath },
				};
			} else {
				return prevItem;
			}
		});

		toast.success("파일이 성공적으로 올라갔습니다", {
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

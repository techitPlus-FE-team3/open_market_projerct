import { axiosInstance } from "@/utils";
import toast from "react-hot-toast";

export async function uploadFile(
	file: File, // 업로드할 파일
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
				return {
					...prevItem,
					mainImages: [
						{
							url: filePath,
							fileName: filePath.substring(26),
							orgName: filePath.slice(filePath.lastIndexOf("/") + 1, -4),
						},
					],
				};
			} else if (itemType === "soundFile") {
				return {
					...prevItem,
					extra: {
						...prevItem.extra,
						soundFile: {
							url: filePath,
							fileName: filePath.substring(26),
							orgName: filePath.substring(26),
						},
					},
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

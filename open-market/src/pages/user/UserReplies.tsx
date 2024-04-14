import { useRequireAuth } from "@/hooks/useRequireAuth";
import { axiosInstance } from "@/utils";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserReplies() {
	useRequireAuth();
	const navigate = useNavigate();

	const [replies, setReplies] = useState<Reply[]>([]);

	async function fetchUserReplies() {
		try {
			const response = await axiosInstance.get<ReplyListResponse>(`/replies`);
			setReplies(response.data.item);
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return navigate("/err404", { replace: true });
			}
			console.error(error);
		}
	}

	useEffect(() => {
		fetchUserReplies();
	}, []);

	return (
		<div>
			<h1>내가 쓴 댓글</h1>
			<ul>
				{replies.map((reply) => {
					return <li key={reply._id}>{reply.content}</li>;
				})}
			</ul>
		</div>
	);
}

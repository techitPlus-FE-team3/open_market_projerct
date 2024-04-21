import HelmetSetup from "@/components/HelmetSetup";
import { UserRepliesListItem } from "@/components/ProductListComponent";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	Heading,
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { axiosInstance } from "@/utils";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserReplies() {
	useRequireAuth();
	const navigate = useNavigate();

	const [allReplies, setAllReplies] = useState<Reply[]>([]);
	const [displayReplies, setDisplayReplies] = useState<Reply[]>([]);
	const [currentPage, setCurrentPage] = useState(2);
	const REPLIES_PER_PAGE = 4;

	async function fetchUserReplies() {
		try {
			const response = await axiosInstance.get<ReplyListResponse>(`/replies`);
			setAllReplies(response.data.item);
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return navigate("/err404", { replace: true });
			}
			console.error(error);
		}
	}

	function handleMoreReplies() {
		const newPage = currentPage + 1;
		const newReplies = allReplies!.slice(
			currentPage * REPLIES_PER_PAGE,
			newPage * REPLIES_PER_PAGE,
		);
		setDisplayReplies((prev) => [...prev, ...newReplies]);
		setCurrentPage(newPage);
	}

	useEffect(() => {
		fetchUserReplies();
	}, []);

	useEffect(() => {
		if (allReplies) {
			setDisplayReplies(allReplies.slice(0, currentPage * REPLIES_PER_PAGE));
		}
	}, [allReplies]);

	return (
		<ProductSection>
			<HelmetSetup
				title="My Replies"
				description="작성한 댓글 목록"
				url="replies"
			/>
			<Heading>내가 쓴 댓글</Heading>
			<ProductContainer height="633px">
				<ProductList>
					{allReplies !== undefined && allReplies?.length === 0 ? (
						<p>댓글이 없습니다.</p>
					) : (
						displayReplies?.map((reply) => {
							return <UserRepliesListItem reply={reply} />;
						})
					)}
				</ProductList>
				{allReplies !== undefined &&
				currentPage * REPLIES_PER_PAGE < allReplies?.length ? (
					<MoreButton
						onClick={handleMoreReplies}
						aria-label="댓글을 추가로 더 표시합니다."
					>
						더보기
					</MoreButton>
				) : (
					<MoreButton
						disabled
						isDisable
						aria-label="더이상 표시할 댓글이 없습니다."
					>
						더보기
					</MoreButton>
				)}
			</ProductContainer>
		</ProductSection>
	);
}

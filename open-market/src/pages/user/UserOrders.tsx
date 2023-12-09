import styled from "@emotion/styled";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import axiosInstance from "@/utils/refreshToken";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const ProductImage = styled("img")`
	width: 42px;
	height: 42px;
	border-radius: 50%;
`;

function UserOrders() {
	const [orderList, setOrderList] = useState<Order[]>([]);

	//비로그인 상태 체크
	useRequireAuth();

	async function getOrderList() {
		const accessToken = localStorage.getItem("accessToken");
		try {
			const response = await axiosInstance.get<OrderListResponse>("/orders", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setOrderList(response.data.item);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getOrderList();
	}, []);

	return (
		<section>
			<Helmet>
				<title>My Orders - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>구매내역</h2>
			<div>
				<form>
					<input type="text" placeholder="검색어를 입력하세요" />
					<button type="submit">검색</button>
				</form>
			</div>
			<ul>
				{orderList.length !== 0 ? (
					orderList.map((order) => {
						return (
							<li key={order._id}>
								<ProductImage
									src={order.products[0].image}
									alt={`${order.products[0].name} 사진`}
								/>
								<Link to={`/products?_id=${order.products[0]._id}`}>
									{order.products[0].name}
								</Link>
								<button type="button">
									<PlayArrowIcon />
								</button>
								<audio src={order.products[0].extra?.soundFile} controls />
								<button type="button">
									<DownloadIcon />
									다운로드
								</button>
								<button type="button">
									<TurnedInNotIcon />
									북마크
								</button>
							</li>
						);
					})
				) : (
					<span>구매 내역이 없습니다.</span>
				)}
			</ul>
			<button type="button">더보기</button>
		</section>
	);
}

export default UserOrders;

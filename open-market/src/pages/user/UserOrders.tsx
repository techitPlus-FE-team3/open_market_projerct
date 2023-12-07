import styled from "@emotion/styled";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import axiosInstance from "@/api/instance";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductImage = styled("img")`
	width: 42px;
	height: 42px;
	border-radius: 50%;
`;

function UserOrders() {
	const navigate = useNavigate();

	const [orderList, setOrderList] = useState<Order[]>([]);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) {
			toast.error("로그인이 필요한 서비스입니다.");
			navigate("/signin");
		}
	}, [navigate]);

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
								{order.products[0].image ? (
									<ProductImage
										src={order.products[0].image}
										alt={`${order.products[0].name} 사진`}
									/>
								) : (
									<ProductImage
										src="/noImage.svg"
										alt={`${order.products[0].name} 사진 없음`}
									/>
								)}
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

import ProductListItem from "@/components/ProductListItem";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const ProductList = styled("ul")`
	width: 1160px;
	padding: 30px 0px;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	gap: ${Common.space.spacingLg};
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
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
			<ProductList>
				{orderList.length !== 0 ? (
					orderList.map((order) => {
						return (
							<ProductListItem
								key={order._id}
								product={order.products[0]}
								bookmark={false}
							/>
						);
					})
				) : (
					<span>구매 내역이 없습니다.</span>
				)}
			</ProductList>
			<button type="button">더보기</button>
		</section>
	);
}

export default UserOrders;

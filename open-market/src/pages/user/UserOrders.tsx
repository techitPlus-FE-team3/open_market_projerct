import ProductListItem from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance, searchOrderList } from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
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
	const searchRef = useRef<HTMLInputElement>(null);

	const [orderList, setOrderList] = useState<Order[]>([]);
	const [searchKeyword, setSearchKeyword] = useState<string>();
	const [searchedOrderList, setSearchedOrderList] = useState<Order[]>();

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

	function handleSearchKeyword() {
		setSearchKeyword(
			searchRef.current!.value.split(" ").join("").toLowerCase(),
		);
	}

	useEffect(() => {
		getOrderList();
	}, []);

	useEffect(() => {
		setSearchedOrderList(
			searchOrderList({
				searchKeyword: searchKeyword!,
				orderList: orderList!,
			}),
		);
		searchRef.current!.value = searchKeyword ? searchKeyword : "";
	}, [searchKeyword]);

	return (
		<section>
			<Helmet>
				<title>My Orders - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>구매내역</h2>
			<SearchBar onClick={handleSearchKeyword} searchRef={searchRef} />
			<ProductList>
				{searchKeyword ? (
					searchedOrderList !== undefined && searchedOrderList.length !== 0 ? (
						searchedOrderList.map((order) => {
							return (
								<ProductListItem
									key={order._id}
									product={order.products[0]}
									bookmark={false}
								/>
							);
						})
					) : (
						<span>해당하는 구매내역이 없습니다.</span>
					)
				) : orderList !== undefined && orderList.length !== 0 ? (
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
					<span>구매내역이 없습니다.</span>
				)}
			</ProductList>
			<button type="button">더보기</button>
		</section>
	);
}

export default UserOrders;

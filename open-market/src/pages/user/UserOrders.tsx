import { FilterButton } from "@/components/FilterComponent";
import ProductListItem from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import {
	axiosInstance,
	getItemWithExpireTime,
	searchOrderList,
	setItemWithExpireTime,
} from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

const Heading = styled.h2`
	display: ${Common.a11yHidden};
`;

const ProductSection = styled.section`
	width: 1160px;
	margin: 0 auto;
	padding: ${Common.space.spacingLg};
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: flex-end;
	gap: ${Common.space.spacingMd};
`;

const ProductContainer = styled.div`
	width: 1160px;
	min-height: 633px;
	padding: ${Common.space.spacingLg} 0 5px 0;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-between;
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);

	span.emptyList {
		padding-top: 40px;
		font-weight: ${Common.font.weight.regular};
	}

	.moreButton {
		width: 100px;
		height: 40px;
		position: relative;
		background-color: transparent;
		border: none;
		font-weight: ${Common.font.weight.regular};

		&::after {
			content: "";
			position: absolute;
			top: 50%;
			transform: translateY(-30%);
			right: 12px;
			border-bottom: solid 8px transparent;
			border-top: solid 8px black;
			border-left: solid 8px transparent;
			border-right: solid 8px transparent;
		}
	}
`;

const ProductList = styled.ul`
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	gap: ${Common.space.spacingLg};
`;

const FilterContainer = styled.div`
	margin: ${Common.space.spacingLg} 0 5px ${Common.space.spacingMd};
	display: flex;
	flex-flow: row nowrap;
	gap: ${Common.space.spacingMd};
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
		setSearchKeyword(getItemWithExpireTime("searchOrderKeyword"));
		setSearchedOrderList(
			searchOrderList({
				searchKeyword: searchKeyword!,
				orderList: orderList!,
			}),
		);
	}, [orderList]);

	useEffect(() => {
		setSearchedOrderList(
			searchOrderList({
				searchKeyword: searchKeyword!,
				orderList: orderList!,
			}),
		);
		if (searchKeyword !== undefined && searchKeyword !== null) {
			setItemWithExpireTime("searchOrderKeyword", searchKeyword, 5000 * 100);
		}
		searchRef.current!.value = searchKeyword ? searchKeyword : "";
	}, [searchKeyword]);

	return (
		<ProductSection>
			<Helmet>
				<title>My Orders - 모두의 오디오 MODI</title>
			</Helmet>
			<Heading>구매내역</Heading>
			<SearchBar onClick={handleSearchKeyword} searchRef={searchRef} />
			<FilterContainer>
				<FilterButton type="submit">인기순</FilterButton>
				<FilterButton type="submit">최신순</FilterButton>
			</FilterContainer>
			<ProductContainer>
				<ProductList>
					{searchKeyword ? (
						searchedOrderList !== undefined &&
						searchedOrderList.length !== 0 ? (
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
							<span className="emptyList">해당하는 구매내역이 없습니다.</span>
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
						<span className="emptyList">구매내역이 없습니다.</span>
					)}
				</ProductList>
				<button type="button" className="moreButton">
					더보기
				</button>
			</ProductContainer>
		</ProductSection>
	);
}

export default UserOrders;

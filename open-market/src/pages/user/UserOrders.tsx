import { FilterButton, FilterContainer } from "@/components/FilterComponent";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/components/ProductListComponent";
import { ProductListItem } from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	axiosInstance,
	getItemWithExpireTime,
	searchProductList,
} from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

function UserOrders() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);

	const [searchKeyword, setSearchKeyword] = useState<string>("");
	const [searchedOrderList, setSearchedOrderList] = useState<Order[]>();

	//비로그인 상태 체크
	useRequireAuth();

	async function fetchOrderProductsInfo({ pageParam = 1 }) {
		const accessToken = localStorage.getItem("accessToken");
		try {
			const { data } = await axiosInstance.get(
				`/orders?page=${pageParam}&limit=8`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return data;
		} catch (err) {
			console.error(err);
		}
	}

	const {
		data,
		error,
		isLoading,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["orders"],
		queryFn: fetchOrderProductsInfo,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});
	const fetchedOrderProductList =
		data?.pages.flatMap((page) => page.item) || [];

	function handleSearchKeyword(e: { preventDefault: () => void }) {
		e.preventDefault();

		const keyword =
			searchRef.current?.value.split(" ").join("").toLowerCase() || "";
		setSearchKeyword(keyword);
	}

	useEffect(() => {
		setSearchKeyword(getItemWithExpireTime("searchOrderKeyword"));
		// 별도의 비동기 함수를 선언합니다.
		const fetchSearchResult = async () => {
			const searchResult = await searchProductList({
				resource: "orders",
				searchKeyword,
			});
			setSearchedOrderList(searchResult);
		};

		// 선언한 비동기 함수를 호출합니다.
		fetchSearchResult();
	}, [searchKeyword]);

	// 로딩 중일 때
	if (isLoading) {
		return <div>상품들을 불러오는 중...</div>;
	}

	// 에러가 발생했을 때
	if (isError) {
		const err = error as Error; // Error 타입으로 변환
		return <div>에러가 발생했습니다: {err.message}</div>;
	}
	return (
		<ProductSection>
			<Helmet>
				<title>My Orders - 모두의 오디오 MODI</title>
			</Helmet>
			<Heading>구매내역</Heading>
			<SearchBar onClick={handleSearchKeyword} searchRef={searchRef} showable />
			<FilterContainer>
				<FilterButton type="submit">인기순</FilterButton>
				<FilterButton type="submit">최신순</FilterButton>
			</FilterContainer>
			<ProductContainer height={"633px"}>
				<ProductList>
					{searchKeyword && searchedOrderList?.length === 0 ? (
						<span className="emptyList">해당하는 구매내역이 없습니다.</span>
					) : searchedOrderList && searchedOrderList.length !== 0 ? (
						searchedOrderList.map((order) => (
							<ProductListItem
								key={order._id}
								product={order.products[0]}
								bookmark={false}
							/>
						))
					) : (
						fetchedOrderProductList.map((order) => {
							return (
								<ProductListItem
									key={order._id}
									product={order.products[0]}
									bookmark={false}
								/>
							);
						})
					)}
				</ProductList>
				<button
					type="submit"
					className="moreButton"
					ref={paginationButtonRef}
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetchingNextPage}
				>
					더보기
				</button>
			</ProductContainer>
		</ProductSection>
	);
}

export default UserOrders;

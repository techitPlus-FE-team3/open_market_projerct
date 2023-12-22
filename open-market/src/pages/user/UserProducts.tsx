import { FilterButton, FilterContainer } from "@/components/FilterComponent";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/components/ProductListComponent";
import { UserProductListItem } from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	axiosInstance,
	searchProductList,
	setItemWithExpireTime,
} from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

function sortByProfitProductList(list: Product[]) {
	return list.sort((a, b) => b.buyQuantity * b.price - a.buyQuantity * a.price);
}

function sortByNewestProductList(list: Product[]) {
	return list.sort((a, b) => {
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
	});
}

function UserProducts() {
	const searchRef = useRef<HTMLInputElement>(null);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const [searchedProductList, setSearchedProductList] = useState<Product[]>();
	const paginationButtonRef = useRef(null);
	//비로그인 상태 체크
	useRequireAuth();

	async function fetchUserProductsInfo({ pageParam = 1 }) {
		try {
			const { data } = await axiosInstance.get(
				`/seller/products?page=${pageParam}&limit=8`,
			);
			return data;

			// 데이터를 로컬 스토리지에 저장
		} catch (error) {
			// 에러 처리
			console.error("상품 리스트 조회 실패:", error);
			return [];
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
		queryKey: ["seller/products"],
		queryFn: fetchUserProductsInfo,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});
	const fetchedProductList = data?.pages.flatMap((page) => page.item) || [];

	function handleSearchKeyword(e: { preventDefault: () => void }) {
		e.preventDefault();

		const keyword =
			searchRef.current?.value.split(" ").join("").toLowerCase() || "";
		setSearchKeyword(keyword);
	}

	const handleSortByProfit = useCallback(() => {
		if (fetchedProductList.length === 0) return;

		let sortedProductList;
		// searchedProductList가 존재하면 해당 리스트를 정렬하고, 그렇지 않으면 전체 리스트를 정렬합니다.
		sortedProductList =
			searchedProductList && searchedProductList.length > 0
				? sortByProfitProductList([...searchedProductList])
				: sortByProfitProductList([...fetchedProductList]);

		// 정렬된 리스트를 상태에 반영합니다.
		if (searchedProductList && searchedProductList.length > 0) {
			setSearchedProductList(sortedProductList);
		} else {
			setUserProductsInfo(sortedProductList);
		}

		setItemWithExpireTime("userProductsInfo", sortedProductList, 5000 * 100);
	}, [fetchedProductList, searchedProductList]);

	const handleSortByNewest = useCallback(() => {
		if (fetchedProductList.length === 0) return;

		// 최신순으로 정렬된 상품 리스트를 가져옵니다.
		let sortedProductList =
			searchedProductList && searchedProductList.length > 0
				? sortByNewestProductList([...searchedProductList])
				: sortByNewestProductList([...fetchedProductList]);

		// 정렬된 리스트를 상태에 반영합니다.
		if (searchedProductList && searchedProductList.length > 0) {
			setSearchedProductList(sortedProductList);
		} else {
			setUserProductsInfo(sortedProductList);
		}

		setItemWithExpireTime("userProductsInfo", sortedProductList, 5000 * 100);
	}, [fetchedProductList, searchedProductList]);

	useEffect(() => {
		// 별도의 비동기 함수를 선언합니다.
		const fetchSearchResult = async () => {
			const searchResult = await searchProductList({
				resource: "seller/products",
				searchKeyword,
			});

			setSearchedProductList(searchResult);
		};

		// 선언한 비동기 함수를 호출합니다.
		fetchSearchResult();
	}, [searchKeyword]);

	// 로딩 중일 때
	if (isLoading) {
		return <LoadingSpinner width="100vw" height="100vh" />;
	}

	// 에러가 발생했을 때
	if (isError) {
		const err = error as Error; // Error 타입으로 변환
		return <div>에러가 발생했습니다: {err.message}</div>;
	}

	return (
		<ProductSection>
			<Helmet>
				<title>My Products - 모두의 오디오 MODI</title>
			</Helmet>
			<Heading>상품관리</Heading>
			{userProductsInfo ? (
				<>
					<SearchBar
						onClick={handleSearchKeyword}
						searchRef={searchRef}
						showable
					/>
					<FilterContainer>
						<FilterButton type="button" onClick={handleSortByProfit}>
							수익순
						</FilterButton>
						<FilterButton type="button" onClick={handleSortByNewest}>
							최신순
						</FilterButton>
					</FilterContainer>
					<ProductContainer
						height="633px"
						isDisable={!hasNextPage || isFetchingNextPage}
					>
						<ProductList>
							{searchKeyword && searchedProductList?.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : searchKeyword && searchedProductList?.length !== 0 ? (
								searchedProductList?.map((item) => (
									<UserProductListItem key={item._id} product={item} />
								))
							) : Array.isArray(userProductsInfo) &&
							  userProductsInfo.length > 0 ? (
								userProductsInfo.map((item) => (
									<UserProductListItem key={item._id} product={item} />
								))
							) : fetchedProductList.length !== 0 ? (
								fetchedProductList?.map((item) => (
									<UserProductListItem key={item.id} product={item} />
								))
							) : (
								<span className="emptyList">판매 내역이 없습니다.</span>
							)}
						</ProductList>
						<button
							type="submit"
							className="moreButton"
							ref={paginationButtonRef}
							onClick={() => {
								setSearchedProductList([]);
								setUserProductsInfo([]);
								fetchNextPage();
							}}
							disabled={!hasNextPage || isFetchingNextPage}
						>
							더보기
						</button>
					</ProductContainer>
				</>
			) : (
				<span className="emptyList">
					현재 회원님이 판매하고 있는 상품이 없습니다
				</span>
			)}
		</ProductSection>
	);
}

export default UserProducts;

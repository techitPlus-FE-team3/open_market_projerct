import {
	FilterButton,
	FilterContainer,
	FilterSelect,
} from "@/components/FilterComponent";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/components/ProductListComponent";
import { ProductListItem } from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";
// import useCategoryQuery from "@/hooks/useCategoryQuery";
import { useSearchProductList } from "@/hooks/useSearchProductList";
import {
	categoryValueState,
	searchKeywordState,
} from "@/states/productListState";
import { axiosInstance, categoryFilterProductList } from "@/utils";
import styled from "@emotion/styled";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Key, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";

interface bannerProps {
	showable?: boolean;
}

const BannerSection = styled.section<bannerProps>`
	display: ${(props) => (props.showable ? "block" : "none")};
	width: 100%;
	height: 400px;

	img {
		object-fit: cover;
	}
`;

function Index() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);
	const [searchedProductList, setSearchedProductList] = useState<Product[]>();
	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [categoryValue, setCategoryValue] =
		useRecoilState<string>(categoryValueState);
	const [selectedCode, setSelectedCode] = useState("");

	const [filteredProductList, setFilteredProductList] = useState<Product[]>();

	const fetchProducts = async ({ pageParam = 1 }) => {
		try {
			const { data } = await axiosInstance.get(
				`/products?page=${pageParam}&limit=4`,
			);

			return data;
		} catch (error) {
			console.error("Error fetching products:", error);
			throw error;
		}
	};

	const {
		data,
		error,
		isLoading,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["products"],
		queryFn: fetchProducts,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});

	const { data: searchResult } = useSearchProductList({
		resource: "products",
		searchKeyword,
	});
	const fetchedProductList = data?.pages.map((page) => page.item).flat();

	const {
		data: fetchedCategory,
		error: categoryError,
		isLoading: categoryIsLoading,
		isError: categoryIsError,
	} = useCategoryQuery();

	function handleSearchKeyword() {
		setSearchKeyword(
			searchRef.current!.value.split(" ").join("").toLowerCase(),
		);
	}

	useEffect(() => {
		// categoryFilter 또는 category가 변화할 때마다 selectedCode를 업데이트 합니다.
		if (fetchedCategory) {
			const selectedCategory = fetchedCategory.find(
				(item: { value: string }) => item.value === categoryValue,
			);
			if (selectedCategory) {
				setSelectedCode(selectedCategory.code);
			}
		}
	}, [categoryValue]);

	useEffect(() => {
		// selectedCode가 변화할 때마다 categoryFilterProductList 함수를 호출합니다.
		const fetchFilteredProductsData = async () => {
			if (selectedCode) {
				// selectedCode 존재 여부를 체크합니다.
				const result = await categoryFilterProductList({
					resource: "products",
					category: selectedCode,
				});

				setFilteredProductList([...result]);
			}
		};
		fetchFilteredProductsData();
	}, [selectedCode]);

	useEffect(() => {
		setSearchedProductList(searchResult);
	}, [searchKeyword, searchResult]);

	// 로딩 중일 때
	if (isLoading || categoryIsLoading) {
		return <div>상품들을 불러오는 중...</div>;
	}

	// 에러가 발생했을 때
	if (isError || categoryIsError) {
		const err = error as Error; // Error 타입으로 변환
		return <div>에러가 발생했습니다: {err.message}</div>;
	}

	return (
		<>
			<Helmet>
				<title>Home - 모두의 오디오 MODI</title>
			</Helmet>
			<BannerSection showable={searchKeyword ? false : true}>
				<img src="/banner.svg" alt="배너 이미지" />
			</BannerSection>
			<ProductSection>
				<Heading>메인페이지</Heading>
				<SearchBar
					onClick={handleSearchKeyword}
					searchRef={searchRef}
					showable={searchKeyword ? true : false}
				/>
				<FilterContainer>
					<FilterButton type="submit">인기순</FilterButton>
					<FilterButton type="submit">최신순</FilterButton>
					<FilterSelect showable={!searchKeyword ? true : false}>
						<select
							value={categoryValue}
							onChange={(e) => setCategoryValue(e.target.value)}
						>
							<option value="none" disabled hidden>
								장르 선택
							</option>
							<option value="all">전체 보기</option>
							{fetchedCategory && fetchedCategory.length !== 0
								? fetchedCategory.map(
										(item: { code: Key | null | undefined; value: string }) => (
											<option key={item.code} value={item.value}>
												{item.value}
											</option>
										),
								  )
								: undefined}
						</select>
					</FilterSelect>
				</FilterContainer>
				<ProductContainer height={searchKeyword ? "633px" : "400px"}>
					<ProductList>
						{searchKeyword && searchedProductList !== undefined ? (
							searchedProductList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : (
								searchedProductList.map((product) => {
									return (
										<ProductListItem
											key={product._id}
											product={product}
											bookmark
										/>
									);
								})
							)
						) : !searchKeyword &&
						  categoryValue !== "all" &&
						  filteredProductList !== undefined ? (
							filteredProductList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : (
								filteredProductList.map((product) => {
									return (
										<ProductListItem
											key={product._id}
											product={product}
											bookmark
										/>
									);
								})
							)
						) : (
							fetchedProductList?.map((product: Product) => {
								return (
									<ProductListItem
										key={product._id}
										product={product}
										bookmark
									/>
								);
							})
						)}
					</ProductList>
					<button
						type="submit"
						className="moreButton"
						ref={paginationButtonRef}
						onClick={() => {
							fetchNextPage();
						}}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						더보기
					</button>
				</ProductContainer>
			</ProductSection>
		</>
	);
}

export default Index;

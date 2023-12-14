import { FilterButton, FilterSelect } from "@/components/FilterComponent";
import ProductListItem from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import {
	categoryKeywordState,
	fetchproductListState,
	productListState,
	searchKeywordState,
	searchedProductListState,
} from "@/states/productListState";
import { Common } from "@/styles/common";
import {
	axiosInstance,
	categoryFilterProductList,
	searchProductList,
} from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRecoilState, useRecoilValue } from "recoil";

const ProductList = styled("ol")`
	width: 1160px;
	padding: 30px 0px;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	gap: ${Common.space.spacingLg};
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
`;

const FilterContainer = styled("div")`
	margin: 10px;
	display: flex;
	flex-flow: row nowrap;
	gap: 10px;
`;

function Index() {
	const searchRef = useRef<HTMLInputElement>(null);

	const fetchedProductList = useRecoilValue(fetchproductListState);
	const [productList, setProductList] = useRecoilState(productListState);
	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [searchedProductList, setSearchedProductList] = useRecoilState<
		Product[]
	>(searchedProductListState);

	const [category, setCategory] = useState<CategoryCode[]>();
	const [categoryFilter, setCategoryFilter] =
		useRecoilState<string>(categoryKeywordState);
	const [filteredProductList, setFilteredProductList] = useState<Product[]>();

	function handleSearchKeyword() {
		setSearchKeyword(
			searchRef.current!.value.split(" ").join("").toLowerCase(),
		);
	}

	useEffect(() => {
		setProductList(fetchedProductList!);

		async function fetchCategory() {
			try {
				const response = await axiosInstance.get(`/codes/productCategory`);
				const responseData = response.data.item;
				const categoryCodeList = responseData.productCategory.codes;
				setCategory(categoryCodeList);
			} catch (error) {
				console.error("상품 리스트 조회 실패:", error);
			}
		}

		fetchCategory();
	}, []);

	useEffect(() => {
		function translateValueToCode(value: string) {
			if (value === "all") {
				return value;
			}
			if (value !== undefined && category !== undefined) {
				return category.find((item) => item.value === value)?.code;
			}
		}

		const selectedCode = translateValueToCode(categoryFilter)!;

		setFilteredProductList(
			categoryFilterProductList({
				code: selectedCode,
				productList: productList,
			}),
		);
	}, [categoryFilter, category]);

	useEffect(() => {
		const list =
			categoryFilter !== "all" && filteredProductList !== undefined
				? filteredProductList
				: productList;
		setSearchedProductList(
			searchProductList({
				searchKeyword: searchKeyword,
				productList: list!,
			}),
		);
		searchRef.current!.value = searchKeyword;
	}, [searchKeyword, filteredProductList]);

	return (
		<>
			<Helmet>
				<title>Home - 모두의 오디오 MODI</title>
			</Helmet>
			<section>
				<h2>메인페이지</h2>
				<img src="/vite.svg" alt="hero" />
				<SearchBar onClick={handleSearchKeyword} searchRef={searchRef} />
				<FilterContainer>
					<FilterButton type="submit">인기순</FilterButton>
					<FilterButton type="submit">최신순</FilterButton>
					<FilterSelect>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
						>
							<option value="none" disabled hidden>
								장르 선택
							</option>
							<option value="all">전체 보기</option>
							{category && category.length !== 0
								? category.map((item) => (
										<option key={item.code} value={item.value}>
											{item.value}
										</option>
								  ))
								: undefined}
						</select>
					</FilterSelect>
				</FilterContainer>
				<ProductList>
					{searchKeyword && searchedProductList !== undefined ? (
						searchedProductList.length === 0 ? (
							<span>해당하는 상품이 없습니다.</span>
						) : (
							searchedProductList.slice(0, 4).map((product) => {
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
					  categoryFilter !== "all" &&
					  filteredProductList !== undefined ? (
						filteredProductList.length === 0 ? (
							<span>해당하는 상품이 없습니다.</span>
						) : (
							filteredProductList.slice(0, 4).map((product) => {
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
						productList?.slice(0, 4).map((product) => {
							return (
								<ProductListItem key={product._id} product={product} bookmark />
							);
						})
					)}
				</ProductList>
				<button type="submit">더보기</button>
			</section>
		</>
	);
}

export default Index;

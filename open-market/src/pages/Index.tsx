import {
    categoryKeywordState,
    fetchproductListState,
    productListState,
    searchKeywordState,
    searchedProductListState,
} from "@/states/productListState";
import {
    axiosInstance,
    categoryFilterProductList,
    searchProductList,
} from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

const ProductImage = styled("img")`
	width: 42px;
	height: 42px;
	border-radius: 50%;
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
				<div className="searchInputWrapper">
					<label htmlFor="searchBar" className="">
						검색
					</label>
					<input type="text" id="searchBar" name="searchBar" ref={searchRef} />
					<button type="button" onClick={handleSearchKeyword}>
						검색
					</button>
				</div>
				<div className="sortButtonWrapper">
					<button type="submit">인기순</button>
					<button type="submit">최신순</button>
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
				</div>
				<ol className="musicList">
					{searchKeyword && searchedProductList !== undefined ? (
						searchedProductList.length === 0 ? (
							<span>해당하는 상품이 없습니다.</span>
						) : (
							searchedProductList.slice(0, 4).map((product) => {
								return (
									<li key={String(product._id)} className="musicItem">
										<Link to={`/productdetail/${product._id}`}>
											<ProductImage
												src={product.mainImages[0]}
												alt={`${product.name} 사진`}
											/>
											<span>{product.name}</span>
										</Link>
										<audio src={product?.extra?.soundFile} controls />
										<button type="submit">북마크</button>
									</li>
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
									<li key={String(product._id)} className="musicItem">
										<Link to={`/productdetail/${product._id}`}>
											<ProductImage
												src={product.mainImages[0]}
												alt={`${product.name} 사진`}
											/>
											<span>{product.name}</span>
										</Link>
										<audio src={product?.extra?.soundFile} controls />
										<button type="submit">북마크</button>
									</li>
								);
							})
						)
					) : (
						productList?.slice(0, 4).map((product) => {
							return (
								<li key={String(product._id)} className="musicItem">
									<Link to={`/productdetail/${product._id}`}>
										<ProductImage
											src={product.mainImages[0]}
											alt={`${product.name} 사진`}
										/>
										<span>{product.name}</span>
									</Link>
									<audio src={product?.extra?.soundFile} controls />
									<button type="submit">북마크</button>
								</li>
							);
						})
					)}
				</ol>
				<button type="submit">더보기</button>
			</section>
		</>
	);
}

export default Index;

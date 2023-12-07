import {
	fetchproductListState,
	productListState,
	searchKeywordState,
	searchedProductListState,
} from "@/states/productListState";
import { searchProductList } from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
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

	const [productList, setProductList] = useRecoilState(productListState);
	const fetchedProductList = useRecoilValue(fetchproductListState);

	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [searchedProductList, setSearchedProductList] = useRecoilState<
		Product[]
	>(searchedProductListState);

	function handleSearchKeyword() {
		setSearchKeyword(
			searchRef.current!.value.split(" ").join("").toLowerCase(),
		);
	}

	useEffect(() => {
		setProductList(fetchedProductList!);
	}, []);

	useEffect(() => {
		setSearchedProductList(
			searchProductList({
				searchKeyword: searchKeyword,
				productList: productList!,
			}),
		);
		searchRef.current!.value = searchKeyword;
	}, [searchKeyword]);

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
				</div>
				<ol className="musicList">
					{searchKeyword && searchedProductList.length === 0 ? (
						<span>해당하는 상품이 없습니다.</span>
					) : searchKeyword && searchedProductList.length !== 0 ? (
						searchedProductList.slice(0, 4).map((product) => {
							return (
								<li key={String(product._id)} className="musicItem">
									<Link to={`/productdetail/${product._id}`}>
										{product.mainImages[0] ? (
											<ProductImage
												src={product.mainImages[0]}
												alt={`${product.name} 사진`}
											/>
										) : (
											<ProductImage
												src="/noImage.svg"
												alt={`${product.name} 사진 없음`}
											/>
										)}
										<span>{product.name}</span>
									</Link>
									<audio src={product?.extra?.soundFile} controls />
									<button type="submit">북마크</button>
								</li>
							);
						})
					) : (
						productList?.slice(0, 4).map((product) => {
							return (
								<li key={String(product._id)} className="musicItem">
									<Link to={`/productdetail/${product._id}`}>
										{product.mainImages[0] ? (
											<ProductImage
												src={product.mainImages[0]}
												alt={`${product.name} 사진`}
											/>
										) : (
											<ProductImage
												src="/noImage.svg"
												alt={`${product.name} 사진 없음`}
											/>
										)}
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

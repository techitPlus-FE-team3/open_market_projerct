import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const ProductImage = styled("img")`
	width: 42px;
	height: 42px;
	border-radius: 50%;
`;

function Index() {
	const [productList, setProductList] = useState<Product[]>([]);

	async function getProductList() {
		try {
			const response = await axios.get<ProductListResponse>(
				"https://localhost/api/products",
			);
			setProductList(response.data.item);
			console.log(productList);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getProductList();
	}, []);

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
					<input type="text" id="searchBar" name="searchBar" />
					<button>검색</button>
				</div>
				<div className="sortButtonWrapper">
					<button type="submit">인기순</button>
					<button type="submit">최신순</button>
				</div>
				<ol className="musicList">
					{productList?.slice(0, 4).map((product) => {
						return (
							<li key={String(product._id)} className="musicItem">
								<Link to={`/products?_id=${product._id}`}>
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
					})}
				</ol>
				<button type="submit">더보기</button>
			</section>
		</>
	);
}

export default Index;

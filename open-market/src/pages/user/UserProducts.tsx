import axiosInstance from "@/api/instance";
import {
	getItemWithExpireTime,
	numberWithComma,
	setItemWithExpireTime,
} from "@/utils";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function UserProducts() {
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const accessToken = localStorage.getItem("accessToken");

	async function fetchUserProductsInfo() {
		try {
			const response = await axiosInstance.get<ProductListResponse>(
				`/seller/products/`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const responseData = response.data.item;
			setUserProductsInfo(responseData);
			// 데이터를 로컬 스토리지에 저장
			setItemWithExpireTime("userProductsInfo", responseData, 5000 * 100);
		} catch (error) {
			// 에러 처리
			console.error("상품 리스트 조회 실패:", error);
		}
	}

	useEffect(() => {
		// 로컬 스토리지에서 데이터를 가져와 시도
		const storedUserProductsInfo = getItemWithExpireTime("userProductsInfo");

		if (storedUserProductsInfo) {
			setUserProductsInfo(storedUserProductsInfo);
		} else {
			fetchUserProductsInfo();
		}
	}, []);

	const handleSortProductList = useCallback(async () => {
		// 정렬 로직
		const sortedProductsList = [...userProductsInfo].sort(
			(a, b) => b.buyQuantity * b.price - a.buyQuantity * a.price,
		);
		setUserProductsInfo(sortedProductsList);
		setItemWithExpireTime("userProductsInfo", sortedProductsList, 5000 * 100);
	}, [userProductsInfo]);

	return (
		<section>
			<Helmet>
				<title>My Products - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상품관리</h2>
			{userProductsInfo ? (
				<>
					<div>
						<form>
							<input type="text" placeholder="판매내역 검색" />
							<button type="submit">검색</button>
						</form>
					</div>
					<ul>
						<li>
							<button type="button" onClick={handleSortProductList}>
								수익순
							</button>
						</li>
						<li>
							<button type="button" onClick={fetchUserProductsInfo}>
								최신순
							</button>
						</li>
					</ul>
					<ul>
						{Array.isArray(userProductsInfo) ? (
							userProductsInfo.map((item) => (
								<li key={item._id}>
									<img src={item.mainImages[0]} alt="앨범 이름 이미지" />
									<p>{item.name}</p>
									<button type="button">
										<PlayArrowIcon />
									</button>
									<p>
										판매 개수: <span>{item.buyQuantity}</span>
									</p>
									<p>
										총 수익:{" "}
										<span>
											{typeof item.buyQuantity !== "undefined"
												? numberWithComma(item.buyQuantity * item.price)
												: "0"}
										</span>
									</p>
									<p>
										북마크 수:{" "}
										<span>{item?.bookmarks ? item?.bookmarks.length : 0}</span>
									</p>
									<Link to={`/productmanage/${item._id}`}>상세보기</Link>
								</li>
							))
						) : (
							<span>데이터가 없습니다.</span>
						)}
					</ul>
					<button type="submit">더보기</button>
				</>
			) : (
				<span>현재 회원님이 판매하고 있는 상품이 없습니다</span>
			)}
		</section>
	);
}

export default UserProducts;

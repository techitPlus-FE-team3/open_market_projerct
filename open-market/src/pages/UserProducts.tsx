import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

function UserProducts() {
	const { userId } = useParams();
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		const fetchUserProductsInfo = async () => {
			try {
				const response = await axios.get<ProductListResponse>(
					`https://localhost/api/seller/products/`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setUserProductsInfo(response.data.item);
			} catch (error) {
				// 에러 처리
				console.error("회원 정보 조회 실패:", error);
			}
		};

		fetchUserProductsInfo();
	}, []);

	userProductsInfo.map((item) => console.log(item));

	if (userProductsInfo) {
		return (
			<section>
				<Helmet>
					<title>My Products - 모두의 오디오 MODI</title>
				</Helmet>
				<h2>상품관리</h2>
				<div>
					<form>
						<input type="text" placeholder="판매내역 검색" />
						<button type="submit">검색</button>
					</form>
				</div>
				<ul>
					<li>
						<button type="button">인기순</button>
					</li>
					<li>
						<button type="button">최신순</button>
					</li>
				</ul>
				<ul>
					{Array.isArray(userProductsInfo) ? (
						userProductsInfo.map((item) => (
							<li key={item._id}>
								<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
								<p>앨범이름</p>
								<button type="button">
									<PlayArrowIcon />
								</button>
								<p>
									판매 개수: <span>{item.extra?.order}</span>
								</p>
								<p>
									총 수익:{" "}
									<span>
										{typeof item.extra?.order !== "undefined"
											? item.extra?.order * item.price
											: "0"}
									</span>
								</p>
								<p>
									북마크 수: <span>{item.extra?.bookmark}</span>
								</p>
								<Link to="detail">상세보기</Link>
							</li>
						))
					) : (
						<span>데이터가 없습니다.</span>
					)}
				</ul>
				<button type="submit">더보기</button>
			</section>
		);
	}
}

export default UserProducts;

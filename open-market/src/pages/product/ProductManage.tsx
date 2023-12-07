import axiosInstance from "@/api/instance";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

function ProductManage() {
	const navigate = useNavigate();
	const { productId } = useParams();
	const [userProductInfo, setUserProductInfo] = useState<Product>();

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) {
			toast.error("로그인이 필요한 서비스입니다.");
			navigate("/signin");
		}
	}, [navigate]);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		const fetchUserProductInfo = async () => {
			try {
				const response = await axiosInstance.get<ProductResponse>(
					`/seller/products/${productId}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setUserProductInfo(response.data.item);
			} catch (error) {
				console.error("상품 정보 조회 실패:", error);
			}
		};

		fetchUserProductInfo();
	}, []);

	function handleProductDelete(e: { preventDefault: () => void }) {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");
		const result = confirm("상품을 정말로 삭제하시겠습니까?");
		if (!result) return;
		try {
			axiosInstance
				.delete(`/seller/products/${productId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then(() => {
					toast.success("상품이 성공적으로 삭제되었습니다", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					navigate(-1);
				})
				.catch((error) => {
					console.error("에러 발생:", error);
				});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<section>
			<Helmet>
				<title>Management Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상품 관리</h2>
			<div>
				<img src={userProductInfo?.mainImages[0]} alt="앨범아트" />
				<div>
					<span>제목: {userProductInfo?.name}</span>
					<div>
						<span>장르: {userProductInfo?.extra?.category}</span>
						<span>
							해시태그: {userProductInfo?.extra?.tags?.map((i) => `#${i} `)}
						</span>
					</div>
					<span>
						판매수익:{" "}
						{typeof userProductInfo?.buyQuantity !== "undefined"
							? userProductInfo?.buyQuantity * userProductInfo?.price
							: "0"}
						원
					</span>
				</div>
			</div>
			<div>
				<span>설명: {userProductInfo?.content}</span>
				<span>공개여부: {userProductInfo?.show.toString()}</span>
			</div>
			<div>
				<button type="submit" onClick={handleProductDelete}>
					삭제
				</button>
				<Link to={`/productedit/${userProductInfo?._id}`}>수정</Link>
			</div>
		</section>
	);
}

export default ProductManage;

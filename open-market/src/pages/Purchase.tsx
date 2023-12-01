import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

function Purchase() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const _id = searchParams.get("_id");
	const [product, setProduct] = useState<Product>();

	const data = localStorage.getItem("_id")
		? Number(localStorage.getItem("_id"))
		: undefined;

	async function getProduct(_id: string) {
		try {
			const response = await axios.get<ProductResponse>(
				`https://localhost/api/products/${_id}`,
			);
			setProduct(response.data.item);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleProductOrder() {
		if (confirm("구매하시겠습니까?")) {
			const accessToken = localStorage.getItem("accessToken");
			try {
				const response = await axios.post<OrderResponse>(
					"https://localhost/api/orders",
					{
						products: [
							{
								_id: product?._id,
								quantity: 1,
							},
						],
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				if (response.data.ok) {
					toast.success("성공적으로 구매했습니다!");
					navigate("/");
				}
			} catch (err) {
				console.error(err);
			}
		}
	}

	useEffect(() => {
		if (_id === null || _id === "") {
			return navigate("/err", { replace: true });
		}
		getProduct(_id);
	}, []);

	return (
		<section>
			<Helmet>
				<title>Order Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상품 구매</h2>
			<div>
				<div>
					<img
						src={`${product?.mainImages[0]}`}
						alt={`${product?.name} 앨범 아트`}
					/>
					<div>
						<span>타이틀 {product?.name}</span>
						<div>
							<span>아티스트 {product?.seller_id}</span>
							<span>장르 {product?.extra?.category}</span>
						</div>
						<div>
							<span>설명</span>
							<span>{product?.content}</span>
							<span>{product?.extra?.tags?.map((tag) => `#${tag} `)}</span>
						</div>
					</div>
				</div>
				<div>
					<span>결제 정보</span>
					<span>{product?.price}₩</span>
				</div>
				<div>
					<button type="button" onClick={() => navigate(-1)}>
						취소
					</button>
					<button type="button" onClick={handleProductOrder}>
						구매
					</button>
				</div>
			</div>
		</section>
	);
}

export default Purchase;

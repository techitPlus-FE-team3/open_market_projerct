import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Rating } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Detail() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const _id = searchParams.get("_id");

	const [product, setProduct] = useState<Product>();
	const [rating, setRating] = useState(0);
	const [currentUser, setCurrentUser] = useState<User | undefined>();
	const [logState, setLogState] = useState<number | undefined>();
	const [order, setOrder] = useState<Order[]>();

	const data = localStorage.getItem("_id")
		? Number(localStorage.getItem("_id"))
		: undefined;

	async function getProduct(_id: string) {
		try {
			const response = await axios.get<ProductResponse>(
				`https://localhost/api/products/${_id}`,
			);
			setProduct(response.data.item);
			setRating(getRating(response.data.item));
			setLogState(data);
			if (data) {
				getUser(data);
				getOrder({ userId: data, productId: Number(_id)! });
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function getOrder({
		userId,
		productId,
	}: {
		userId: number;
		productId: number;
	}) {
		const accessToken = localStorage.getItem("accessToken");
		try {
			const response = await axios.get<UserResponse>(
				`https://localhost/api/users/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const userOrder = response.data.item.extra?.orders?.filter(
				(order) => order.products[0]._id === productId,
			);
			setOrder(userOrder);
		} catch (err) {
			console.error(err);
		}
	}

	async function getUser(id: number) {
		const accessToken = localStorage.getItem("accessToken");
		try {
			const response = await axios.get<UserResponse>(
				`https://localhost/api/users/${id}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			setCurrentUser(response.data.item);
		} catch (err) {
			console.error(err);
		}
	}

	function getRating(product: Product) {
		if (product.replies?.length === 0) {
			return 0;
		} else {
			const ratingSum = product.replies?.reduce(
				(acc, cur) => acc + Number(cur.rating),
				0,
			)!;
			const ratingAvg = Number(
				(ratingSum / product.replies?.length!).toFixed(2),
			);
			return ratingAvg;
		}
	}

	function handelSignIn() {
		toast.error("로그인 후 이용 가능합니다");
	}

	function ShowStarRating({ rating }: { rating: number }) {
		return (
			<Rating
				name="showRating"
				value={Number(rating)}
				precision={0.5}
				readOnly
			/>
		);
	}

	useEffect(() => {
		if (_id === null || _id === "") {
			return navigate("/err", { replace: true });
		}
		getProduct(_id);
	}, []);

	useEffect(() => {
		setLogState(data);
	}, []);

	return (
		<section>
			<Helmet>
				<title>Product Detail - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상세 페이지</h2>
			<article>
				<div>
					<img
						src={
							product?.mainImages[0] ? product?.mainImages[0] : "/noImage.svg"
						}
						alt={`${product?.name} 앨범 아트`}
					/>
					<button>
						<PlayArrowIcon />
					</button>
				</div>
				<div>
					<span>{product?.name}</span>
					<span>{product?.seller_id}</span>
					<span>{product?.createdAt}</span>
					<span>{product?.content}</span>
					<span>{product?.price}</span>
				</div>
				<div>
					{product?.extra?.isNew ? (
						<div>
							<StarIcon />
							New!
						</div>
					) : (
						<></>
					)}
					{product?.extra?.isBest ? (
						<div>
							<ThumbUpIcon />
							Best!
						</div>
					) : (
						<></>
					)}
				</div>
				<div>
					<div>
						<ShowStarRating rating={rating} />
					</div>
					<span>{rating}</span>
				</div>
				<div>
					<img src="https://svgsilh.com/svg/2028515.svg" alt="음파" />
				</div>
			</article>
			<article>
				<div>
					<button>
						<BookmarkOutlinedIcon />
						{product?.extra?.bookmark ? product?.extra?.bookmark : 0}
					</button>
					{logState && logState === product?.seller_id ? (
						<Link to={`/productmanage?_id=${product?._id}`}>
							<CheckIcon />
							상품 관리
						</Link>
					) : logState && order?.length !== 0 ? (
						<button type="button">
							<DownloadIcon />
							다운로드
						</button>
					) : logState ? (
						<Link to={`/productpurchase?_id=${product?._id}`}>
							<CheckIcon />
							구매하기
							{product?.extra?.order ? product?.extra?.order : 0}
						</Link>
					) : (
						<Link to={"/signin"} onClick={handelSignIn}>
							<CheckIcon />
							구매하기
							{product?.extra?.order ? product?.extra?.order : 0}
						</Link>
					)}
				</div>
			</article>
			<article>
				<h3>
					<ModeCommentIcon />
					댓글
				</h3>
				{!logState ? (
					<p>로그인 후 댓글을 작성할 수 있습니다.</p>
				) : logState && logState === product?.seller_id ? (
					<p>내 상품에는 댓글을 작성할 수 없습니다.</p>
				) : (logState && order?.length === 0) || order === undefined ? (
					<p>음원 구매 후 댓글을 작성할 수 있습니다.</p>
				) : (
					<form action="submit">
						<div>
							<span>
								{currentUser?.extra?.profileImage ? (
									currentUser?.extra?.profileImage
								) : (
									<AccountCircleIcon />
								)}
							</span>
							<span>{currentUser?.email}</span>
						</div>
						<div>
							<StarIcon />
							<StarIcon />
							<StarIcon />
							<StarBorderIcon />
							<StarBorderIcon />
						</div>
						<div>
							<label htmlFor="content">댓글 내용</label>
							<input id="content" name="content" type="text" required />
							<button type="submit">작성하기</button>
						</div>
					</form>
				)}

				<ul>
					{product?.replies?.length === 0 ? (
						<p>댓글이 없습니다.</p>
					) : (
						product?.replies?.map((reply) => {
							return (
								<li key={reply._id}>
									<div>
										<AccountCircleIcon />
										<span>{reply.userName}</span>
									</div>
									<div>
										<p>{reply.content}</p>
										<div>
											<ShowStarRating rating={reply.rating} />
											{reply.rating}
										</div>
									</div>
								</li>
							);
						})
					)}
				</ul>
				<button>
					더보기
					<ArrowDropDownIcon />
				</button>
			</article>
		</section>
	);
}

export default Detail;

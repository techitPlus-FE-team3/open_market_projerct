import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import CheckIcon from "@mui/icons-material/Check";
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
	const [logState, setLogState] = useState<number | undefined>();

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
		} catch (err) {
			console.error(err);
		}
	}

	function getRating(product: Product) {
		if (product.replies?.length === 0) {
			return 0;
		} else {
			const ratingSum = product.replies?.reduce(
				(acc, cur) => acc + cur.rating,
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

	const StarRating = ({ rating }: { rating: number }) => {
		return <Rating value={rating} precision={0.5} />;
	};

	useEffect(() => {
		if (_id === null || _id === "") {
			return navigate("/err", { replace: true });
		}
		getProduct(_id);
	}, []);

	useEffect(() => {
		setLogState(data);
		console.log(logState);
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
						<StarRating rating={rating} />
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
					{
						logState && logState === product?.seller_id ? (
							<Link to={`/productmanage?_id=${product?._id}`}>상품 관리</Link>
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
						)
						// 유저가 구매한 경우 > 다운로드 버튼
					}
				</div>
			</article>
			<article>
				<h3>
					<ModeCommentIcon />
					댓글
				</h3>
				<form action="submit">
					<div>
						<AccountCircleIcon />
						<span>유저정보</span>
					</div>
					<div>
						<StarIcon />
						<StarIcon />
						<StarIcon />
						<StarBorderIcon />
						<StarBorderIcon />
					</div>
					<div>
						<input type="text" />
						<button type="submit">제출하기</button>
					</div>
				</form>
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
											<StarRating rating={reply.rating} />
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

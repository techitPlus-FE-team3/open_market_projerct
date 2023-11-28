import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";

function Detail() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const _id = searchParams.get("_id");
	const [product, setProduct] = useState<Product>();
	const [rating, setRating] = useState(0);

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
			const sum = product.replies?.reduce((acc, cur) => acc + cur.rating, 0)!;
			return sum / product.replies?.length!;
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
					<span>{product?.sellerId}</span>
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
						<StarIcon />
						<StarIcon />
						<StarIcon />
						<StarBorderIcon />
						<StarBorderIcon />
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
					<button>
						<CheckIcon />
						{product?.extra?.order ? product?.extra?.order : 0}
					</button>
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
											{reply.rating}
											{/* <StarIcon />
											<StarIcon />
											<StarIcon />
											<StarBorderIcon />
											<StarBorderIcon /> */}
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

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Helmet } from "react-helmet-async";

function Detail() {
	return (
		<section>
			<Helmet>
				<title>DETAIL - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상세 페이지</h2>
			<article>
				<div>
					<img src="" alt="앨범아트" />
					<button>
						<PlayArrowIcon />
					</button>
				</div>
				<div>
					<span>타이틀</span>
					<span>아티스트</span>
					<span>업로드 날짜</span>
					<span>상품 설명</span>
				</div>
				<div>
					<div>
						<StarIcon />
						isNew
					</div>
					<div>
						<ThumbUpIcon />
						isBest
					</div>
				</div>
				<div>
					<div>
						<StarIcon />
						<StarIcon />
						<StarIcon />
						<StarBorderIcon />
						<StarBorderIcon />
					</div>
					<span>3.5</span>
				</div>
				<div>
					<img src="https://svgsilh.com/svg/2028515.svg" alt="음파" />
				</div>
			</article>
			<article>
				<div>
					<button>
						<BookmarkOutlinedIcon />
						북마크
					</button>
					<button>
						<CheckIcon />
						구매하기
					</button>
				</div>
			</article>
			<article>
				<form action="submit">
					<span>유저정보</span>
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
					<li>
						<span>유저 정보</span>
						<div>
							<p>댓글 내용</p>
							<div>
								<StarIcon />
								<StarIcon />
								<StarIcon />
								<StarBorderIcon />
								<StarBorderIcon />
							</div>
						</div>
					</li>
					<li>
						<span>유저 정보</span>
						<div>
							<p>댓글 내용</p>
							<div>
								<StarIcon />
								<StarIcon />
								<StarIcon />
								<StarBorderIcon />
								<StarBorderIcon />
							</div>
						</div>
					</li>
					<li>
						<span>유저 정보</span>
						<div>
							<p>댓글 내용</p>
							<div>
								<StarIcon />
								<StarIcon />
								<StarIcon />
								<StarBorderIcon />
								<StarBorderIcon />
							</div>
						</div>
					</li>
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

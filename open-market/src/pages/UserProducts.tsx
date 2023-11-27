import { Helmet } from "react-helmet-async";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Link } from "react-router-dom";

function UserProducts() {
	return (
		<section>
			<Helmet>
				<title>MY PRODUCTS - 모두의 오디오 MODI</title>
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
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<p>앨범이름</p>
					<button type="button">
						<PlayArrowIcon />
					</button>
					<p>
						판매 개수: <span>30</span>
					</p>
					<p>
						총 수익: <span>15,000원</span>
					</p>
					<p>
						북마크 수: <span>45</span>
					</p>
					<Link to="detail">상세보기</Link>
				</li>
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<p>앨범이름</p>
					<button type="button">
						<PlayArrowIcon />
					</button>
					<p>
						판매 개수: <span>30</span>
					</p>
					<p>
						총 수익: <span>15,000원</span>
					</p>
					<p>
						북마크 수: <span>45</span>
					</p>
					<Link to="detail">상세보기</Link>
				</li>
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<p>앨범이름</p>
					<button type="button">
						<PlayArrowIcon />
					</button>
					<p>
						판매개수<span>30</span>
					</p>
					<p>
						총 수익<span>15,000원</span>
					</p>
					<p>
						북마크 수<span>45</span>
					</p>
					<Link to="detail">상세보기</Link>
				</li>
			</ul>
			<button type="button">더보기</button>
		</section>
	);
}

export default UserProducts;

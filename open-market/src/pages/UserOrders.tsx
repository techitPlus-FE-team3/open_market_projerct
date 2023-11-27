import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
function UserOrders() {
	return (
		<section>
			<Helmet>
				<title>MY ORDERS - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>구매내역</h2>
			<div>
				<form>
					<input type="text" placeholder="검색어를 입력하세요" />
					<button type="submit">검색</button>
				</form>
			</div>
			<ul>
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<Link to="/">앨범이름</Link>
					<button type="button">
						<PlayArrowIcon />
					</button>
					<audio src="/" controls />
					<button type="button">
						<DownloadIcon />
						다운로드
					</button>
					<button type="button">
						<TurnedInNotIcon />
						북마크
					</button>
				</li>
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<Link to="/">앨범이름</Link>
					<button type="button">
						<PlayArrowIcon />
					</button>
					<audio src="/" controls />
					<button type="button">
						<DownloadIcon />
						다운로드
					</button>
					<button type="button">
						<TurnedInNotIcon />
						북마크
					</button>
				</li>
			</ul>
			<button type="button">더보기</button>
		</section>
	);
}

export default UserOrders;

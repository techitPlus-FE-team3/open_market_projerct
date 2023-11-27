import DownloadIcon from "@mui/icons-material/Download";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
function UserOrders() {
	return (
		<section>
			<Helmet>
				<title>구매내역 - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>구매내역</h2>
			<div>
				<form>
					<input type="text" placeholder="구매내역 검색" />
					<button type="submit">검색</button>
				</form>
			</div>
			<ul>
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<p>앨범이름</p>
					<button type="button">
						<PlayCircleIcon />
					</button>
					<audio src="/" controls />
					<button type="button">
						<DownloadIcon />
					</button>
					<button type="button">
						<TurnedInNotIcon />
						북마크
					</button>
					<Link to="detail">상세보기</Link>
				</li>
				<li>
					<img src="../../public/vite.svg" alt="앨범 이름 이미지" />
					<p>앨범이름</p>
					<button type="button">
						<PlayCircleIcon />
					</button>
					<audio src="/" controls />
					<button type="button">
						<DownloadIcon />
					</button>
					<button type="button">
						<TurnedInNotIcon />
						북마크
					</button>
					<Link to="detail">상세보기</Link>
				</li>
			</ul>
			<button type="button">더보기</button>
		</section>
	);
}

export default UserOrders;

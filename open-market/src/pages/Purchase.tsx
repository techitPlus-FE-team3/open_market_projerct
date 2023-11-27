import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function Purchase() {
	return (
		<section>
			<Helmet>
				<title>Purchase Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상품 구매</h2>
			<div>
				<div>
					<img src="/vite.svg" alt="앨범아트" />
					<div>
						<span>타이틀 | {`스타보이`}</span>
						<div>
							<span>아티스트 | {`pearl kinn`}</span>
							<span>장르 | {`힙합`}</span>
						</div>
						<div>
							<span>설명</span>
							<span>{`스타 보이가 된 pearlkinn의 노래입니다`}</span>
						</div>
					</div>
				</div>
				<div>
					<span>결제 정보</span>
					<span>{`10,000`}₩</span>
				</div>
				<div>
					<Link to="/">취소</Link>
					<button type="submit">구매</button>
				</div>
			</div>
		</section>
	);
}

export default Purchase;

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

function Login() {
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
						<FontAwesomeIcon icon={faPlay} />
					</button>
				</div>
				<div>
					<span>타이틀</span>
					<span>아티스트</span>
					<span>업로드 날짜</span>
					<span>상품 설명</span>
				</div>
				<div>
					<div>isNew</div>
					<div>isBest</div>
				</div>
				<div>
					<img src="https://svgsilh.com/svg/2028515.svg" alt="음파" />
				</div>
			</article>
			<article>
				<div>
					<button>
						<FontAwesomeIcon icon={faBookmark} />
                        북마크
					</button>
                    <button>
                        
                    </button>
				</div>
			</article>
		</section>
	);
}

export default Login;

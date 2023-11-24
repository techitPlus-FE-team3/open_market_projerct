import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const MyPage = () => {
	return (
		<section>
			<Helmet>
				<title>마이페이지 - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>마이페이지</h2>
			<article>
				<h3>내 정보</h3>
				<img src="" alt="회원 썸네일" />
				<div>
					<div>
						<h4>회원정보</h4>
						<div>
							<h5>이메일</h5>
							<p>dkstmdwl0615@naver.com</p>
						</div>
						<div>
							<h5>비밀번호</h5>
							<p>*******</p>
						</div>
						<div>
							<h5>이름</h5>
							<p>안승지</p>
						</div>
						<div>
							<h5>휴대폰 번호</h5>
							<p>010-8642-****</p>
						</div>
					</div>
					<div>
						<h4>내가 쓴 댓글</h4>
						<div>
							<h5>게시글 제목</h5>
							<p>내용</p>
						</div>
						<div>
							<h5>게시글 제목</h5>
							<p>내용</p>
						</div>
						<div>
							<h5>게시글 제목</h5>
							<p>내용</p>
						</div>
						<button>회원정보 수정</button>
					</div>
				</div>
			</article>
			<article>
				<h3>북마크</h3>
				<ul>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
				</ul>
				<button>전체보기</button>
			</article>
			<article>
				<h3>히스토리</h3>
				<ul>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
				</ul>
				<button>전체보기</button>
			</article>
			<article>
				<h3>구매내역</h3>
				<ul>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
				</ul>
				<button>전체보기</button>
			</article>
			<article>
				<h3>판매내역</h3>
				<ul>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
				</ul>
				<button>전체보기</button>
			</article>
		</section>
	);
};

export default MyPage;

import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function MyPage() {
	const [userInfo, setUserInfo] = useState<User | null>(null);

	useEffect(() => {
		const userId = localStorage.getItem("_id");
		const accessToken = localStorage.getItem("accessToken");

		const fetchUserInfo = async () => {
			try {
				const response = await axios.get<UserResponse>(
					`https://localhost/api/users/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				// console.log(response.data);
				setUserInfo(response.data.item);
			} catch (error) {
				// 에러 처리
				console.error("회원 정보 조회 실패:", error);
			}
		};

		fetchUserInfo();
	}, []);

	if (!userInfo) {
		return <div>Loading...</div>; // 로딩 처리
	}

	return (
		<section>
			<Helmet>
				<title>My Page - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>마이페이지</h2>
			<article>
				<h3>내 정보</h3>
				<img src="public/user.svg" alt="회원 썸네일" />
				<div>
					<div>
						<h4>회원정보</h4>
						<div>
							<h5>이메일</h5>
							<p>{userInfo.email}</p>
						</div>
						<div>
							<h5>이름</h5>
							<p>{userInfo.name}</p>
						</div>
						<div>
							<h5>휴대폰 번호</h5>
							<p>{userInfo.phone}</p>
						</div>
						<Link to="/update/userId">회원정보 수정</Link>
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
						<Link to="/">전체보기</Link>
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
				<Link to="/">전체보기</Link>
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
				<Link to="/">전체보기</Link>
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
				<Link to="/">전체보기</Link>
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
				<Link to="/">전체보기</Link>
			</article>
		</section>
	);
}

export default MyPage;

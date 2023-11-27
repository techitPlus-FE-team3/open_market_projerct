import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function UserUpdate() {
	return (
		<section>
			<Helmet>
				<title>EDIT USER - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>회원정보 수정</h2>
			<form>
				<ul>
					<li>
						<img src="../../public/vite.svg" alt="김모디 프로필 이미지" />
						<label htmlFor="userProfileImage">프로필 이미지</label>
						<input type="file" accept="image/*" id="userProfileImage" />
					</li>
					<li>
						<p>이름</p>
						<p id="name">김모디</p>
					</li>
					<li>
						<p>이메일</p>
						<p id="email">modi@modi.com</p>
					</li>
					<li>
						<label htmlFor="password">비밀번호</label>
						<input type="password" id="password" value="12345678" />
					</li>
					<li>
						<label htmlFor="confirmPassword">비밀번호 확인</label>
						<input type="password" id="confirmPassword" value="12345678" />
					</li>
					<li>
						<label htmlFor="phone">휴대폰 번호</label>
						<input type="number" id="phone" value="01012345678" />
					</li>
				</ul>
				<ul>
					<li>
						<input type="checkbox" id="recievingMarketingInformation" />
						<label htmlFor="recievingMarketingInformation">
							마케팅 정보 수신 동의
						</label>
						<button type="button">약관보기</button>
					</li>
				</ul>
				<Link to="/">수정취소</Link>
				<button type="submit">수정하기</button>
			</form>
		</section>
	);
}

export default UserUpdate;

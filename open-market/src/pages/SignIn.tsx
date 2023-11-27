import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function SignIn() {
	return (
		<section>
			<Helmet>
				<title>SIGNIN - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>로그인</h2>
			<form>
				<fieldset>
					<legend>로그인 폼</legend>
					<label htmlFor="email">이메일</label>
					<input type="text" id="email" placeholder="이메일" />
					<label htmlFor="password">비밀번호</label>
					<input type="password" id="password" placeholder="비밀번호" />
				</fieldset>

				<button type="submit">로그인</button>
			</form>
			<ul>
				<li>
					<Link to="/signup">회원가입</Link>
				</li>
				<li>
					<Link to="/">아이디/비밀번호 찾기</Link>
				</li>
			</ul>
		</section>
	);
}

export default SignIn;

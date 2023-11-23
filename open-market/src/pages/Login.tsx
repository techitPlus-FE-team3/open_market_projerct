import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function Login() {
	return (
		<section>
			<Helmet>
				<title>LOGIN - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>로그인</h2>
			<form>
				<fieldset>
					<legend>로그인 폼</legend>
					<label htmlFor="email">이메일</label>
					<input type="text" id="email" placeholder="modi@modi.com" />
					<label htmlFor="password">비밀번호</label>
					<input type="password" id="password" />
				</fieldset>
				<ul>
					<li>
						<Link to="/">아이디 찾기</Link>
					</li>
					<li>
						<Link to="/">비밀번호 찾기</Link>
					</li>
				</ul>
				<button type="submit">로그인</button>
			</form>
			<span>
				아직 가입하지 않으셨나요? <Link to="/">회원가입</Link>
			</span>
		</section>
	);
}

export default Login;

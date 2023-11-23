import { Helmet } from "react-helmet-async";

function SignUp() {
	return (
		<section>
			<Helmet>
				<title>SIGNUP - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>회원가입</h2>
			<form>
				<ul>
					<li>
						<label htmlFor="email">이메일</label>
						<input
							type="text"
							id="email"
							placeholder="modi@modi.com"
							required
						/>
						<button type="button">중복확인</button>
					</li>
					<li>
						<label htmlFor="password">비밀번호</label>
						<input
							type="password"
							id="password"
							placeholder="8글자 이상 입력해주세요"
							required
						/>
					</li>
					<li>
						<label htmlFor="confirmPassword">비밀번호 확인</label>
						<input
							type="password"
							id="confirmPassword"
							placeholder="비밀번호를 한번 더 입력해주세요"
							required
						/>
					</li>
					<li>
						<label htmlFor="name">이름</label>
						<input
							type="text"
							id="name"
							placeholder="이름을 입력해주세요"
							required
						/>
					</li>
					<li>
						<label htmlFor="phone">휴대폰 번호</label>
						<input
							type="number"
							id="phone"
							placeholder="숫자만 입력해주세요"
							required
						/>
					</li>
				</ul>
				<ul>
					<li>
						<input type="checkbox" id="agreeAll" />
						<label htmlFor="agreeAll">전체 동의합니다</label>
					</li>
					<li>
						<input type="checkbox" id="termsOfUse" required />
						<label htmlFor="termsOfUse">이용약관 동의 (필수)</label>
						<button type="button">약관보기</button>
					</li>
					<li>
						<input
							type="checkbox"
							name=""
							id="providingPersonalInformation"
							required
						/>
						<label htmlFor="providingPersonalInformation">
							개인정보 수집 및 이용 동의 (필수)
						</label>
						<button type="button">약관보기</button>
					</li>
					<li>
						<input type="checkbox" id="recievingMarketingInformation" />
						<label htmlFor="recievingMarketingInformation">
							마케팅 정보 수신 동의 (선택)
						</label>
						<button type="button">약관보기</button>
					</li>
					<li>
						<input type="checkbox" id="cofirmAge" required />
						<label htmlFor="cofirmAge">본인은 만 14세 이상입니다. (필수)</label>
					</li>
				</ul>
				<button type="submit">가입하기</button>
			</form>
		</section>
	);
}

export default SignUp;

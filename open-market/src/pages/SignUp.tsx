import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";

interface SignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	phone: string;
	extra: {
		termsOfUse: boolean;
		providingPersonalInformation: boolean;
		recievingMarketingInformation: boolean;
		confirmAge: boolean;
	};
}

// 회원가입 요청에 필요한 타입
interface SignUpRequest {
	email: string;
	password: string;
	name: string;
	phone: string;
	type: string;
}

function SignUp() {
	const [form, setForm] = useState<SignUpForm>({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		extra: {
			termsOfUse: false,
			providingPersonalInformation: false,
			recievingMarketingInformation: false,
			confirmAge: false,
		},
	});

	const [agreeAll, setAgreeAll] = useState(false);
	const [termsOfUse, setTermsOfUse] = useState(false);
	const [providingPersonalInformation, setProvidingPersonalInformation] =
		useState(false);
	const [recievingMarketingInformation, setRecievingMarketingInformation] =
		useState(false);
	const [confirmAge, setConfirmAge] = useState(false);

	const handleAgreeAllChange = (e) => {
		const isChecked = e.target.checked;
		setAgreeAll(isChecked);
		setTermsOfUse(isChecked);
		setProvidingPersonalInformation(isChecked);
		setRecievingMarketingInformation(isChecked);
		setConfirmAge(isChecked);
	};

	const handleCheckboxChange = (setter) => (e) => {
		const checked = e.target.checked;
		setter(checked);

		// 상태 업데이트 후 다음 렌더링 사이클에서 모든 체크박스의 상태를 확인
		setTimeout(() => {
			const allChecked =
				termsOfUse &&
				providingPersonalInformation &&
				confirmAge &&
				recievingMarketingInformation &&
				checked;

			setAgreeAll(allChecked);
		}, 0);
	};

	// 회원 정보 객체 생성
	const createUserObject = () => {
		const [form, setForm] = useState<SignUpForm>({
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
			phone: "",
			extra: {
				termsOfUse: false,
				providingPersonalInformation: false,
				recievingMarketingInformation: false,
				confirmAge: false,
			},
		});

		const { email, password, name, phone, extra } = form;
		const {
			termsOfUse,
			providingPersonalInformation,
			recievingMarketingInformation,
			confirmAge,
		} = extra;
		return {
			email: email,
			password: password,
			name: name,
			phone: phone,
			extra: {
				termsOfUse: termsOfUse,
				providingPersonalInformation: providingPersonalInformation,
				recievingMarketingInformation: recievingMarketingInformation,
				confirmAge: confirmAge,
			},
		};
	};

	const signUpMutation = useMutation(
		async (newUser: SignUpRequest) => {
			const response = await axios.post(
				"https://localhost/api/users/",
				newUser,
			);
			return response.data;
		},
		{
			onSuccess: (data) => {
				// 회원가입 성공 후 처리
				console.log(data);
			},
			onError: (error) => {
				// 에러 처리
				console.error(error);
			},
		},
	);

	// 폼 제출 핸들러
	const handleSubmit = async (e) => {
		e.preventDefault();
		const userObject = createUserObject();

		try {
			const response = await axios.post(
				"https://localhost/api/users/",
				userObject,
			);
			console.log(response.data);
			// 성공적인 응답 처리 (예: 리디렉션, 알림 등)
		} catch (error) {
			console.error("회원 가입 실패:", error);
			// 오류 처리 (예: 오류 메시지 표시)
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setForm({ ...form, [name]: value });
	};

	return (
		<section>
			<Helmet>
				<title>Sign Up - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>회원가입</h2>
			<form onSubmit={handleSubmit}>
				<ul>
					<li>
						<label htmlFor="email">이메일</label>
						<input
							type="text"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="이메일"
							required
						/>
					</li>
					<li>
						<label htmlFor="password">비밀번호</label>
						<input
							type="password"
							id="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							placeholder="비밀번호"
							required
						/>
					</li>
					<li>
						<label htmlFor="confirmPassword">비밀번호 확인</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={form.confirmPassword}
							onChange={handleChange}
							placeholder="비밀번호 확인"
							required
						/>
					</li>
					<li>
						<label htmlFor="name">이름</label>
						<input
							type="text"
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="이름"
							required
						/>
					</li>
					<li>
						<label htmlFor="phone">휴대폰 번호</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							placeholder="휴대폰 번호"
							required
						/>
					</li>
				</ul>
				<ul>
					<input
						type="checkbox"
						id="agreeAll"
						checked={agreeAll}
						onChange={handleAgreeAllChange}
					/>
					<label htmlFor="agreeAll">전체 동의합니다</label>
					<li>
						<button type="button">약관보기</button>
						<input
							type="checkbox"
							id="termsOfUse"
							checked={termsOfUse}
							onChange={handleCheckboxChange}
							required
						/>
						<label htmlFor="termsOfUse">이용약관 동의 (필수)</label>
					</li>
					<li>
						<button type="button">약관보기</button>
						<input
							type="checkbox"
							id="providingPersonalInformation"
							checked={providingPersonalInformation}
							onChange={handleCheckboxChange}
							required
						/>
						<label htmlFor="providingPersonalInformation">
							개인정보 수집 및 이용 동의 (필수)
						</label>
					</li>
					<li>
						<button type="button">약관보기</button>
						<input
							type="checkbox"
							id="recievingMarketingInformation"
							checked={recievingMarketingInformation}
							onChange={handleCheckboxChange}
						/>
						<label htmlFor="providingPersonalInformation">
							마케팅 정보 수신 동의 (선택)
						</label>
					</li>
					<li>
						<input
							type="checkbox"
							id="confirmAge"
							checked={confirmAge}
							onChange={handleCheckboxChange}
						/>
						<label htmlFor="confirmAge">본인은 만 14세 이상입니다.</label>
					</li>
				</ul>
				<button type="submit">회원가입</button>
			</form>
		</section>
	);
}

export default SignUp;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
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

	const handleAgreeAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setAgreeAll(isChecked);
		setTermsOfUse(isChecked);
		setProvidingPersonalInformation(isChecked);
		setRecievingMarketingInformation(isChecked);
		setConfirmAge(isChecked);

		// form 상태의 extra 부분도 업데이트
		setForm((prevForm) => ({
			...prevForm,
			extra: {
				termsOfUse: isChecked,
				providingPersonalInformation: isChecked,
				recievingMarketingInformation: isChecked,
				confirmAge: isChecked,
			},
		}));
	};

	useEffect(() => {
		// 모든 체크박스의 현재 상태를 확인
		const allChecked =
			termsOfUse &&
			providingPersonalInformation &&
			recievingMarketingInformation &&
			confirmAge;
		setAgreeAll(allChecked);
	}, [
		termsOfUse,
		providingPersonalInformation,
		recievingMarketingInformation,
		confirmAge,
	]);

	// 개별 체크박스 변경 처리
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, checked } = event.target;

		switch (id) {
			case "termsOfUse":
				setTermsOfUse(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, termsOfUse: checked },
				}));
				break;
			case "providingPersonalInformation":
				setProvidingPersonalInformation(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, providingPersonalInformation: checked },
				}));
				break;
			case "recievingMarketingInformation":
				setRecievingMarketingInformation(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, recievingMarketingInformation: checked },
				}));
				break;
			case "confirmAge":
				setConfirmAge(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, confirmAge: checked },
				}));
				break;
			default:
				break;
		}
	};

	// 회원 정보 객체 생성
	const createUserObject = () => {
		const { email, password, name, phone, extra } = form;
		return {
			email,
			password,
			name,
			phone,
			type: "seller", // 회원 유형은 "seller"로 고정
			extra,
		};
	};

	// 회원가입 요청 처리
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
				console.log(data);
				alert("회원가입이 완료되었습니다.");
				window.location.href = "/signin";
			},
			onError: (error: any) => {
				console.error(error);

				// 에러 메시지들을 모아서 표시
				if (
					error.response &&
					error.response.data &&
					error.response.data.errors
				) {
					const errorMessages = error.response.data.errors
						.map((err: { msg: string }) => `${err.msg}`)
						.join("\n");
					alert(`회원가입 실패:\n${errorMessages}`);
				} else {
					alert("회원가입 중 알 수 없는 오류가 발생했습니다.");
				}
			},
		},
	);
	// 폼 제출 처리
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			alert("비밀번호가 일치하지 않습니다.");
			return;
		}
		const userObject = createUserObject();
		signUpMutation.mutate(userObject);
	};

	// 입력 필드 변경 처리
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
						<label htmlFor="recievingMarketingInformation">
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

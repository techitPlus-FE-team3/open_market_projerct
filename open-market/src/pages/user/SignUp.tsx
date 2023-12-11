import { debounce } from "@/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/utils";

interface SignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	phone: string;
	extra: {
		terms: {
			termsOfUse: boolean;
			providingPersonalInformation: boolean;
			recievingMarketingInformation: boolean;
			confirmAge: boolean;
		};
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
	const navigate = useNavigate();

	const [form, setForm] = useState<SignUpForm>({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		extra: {
			terms: {
				termsOfUse: false,
				providingPersonalInformation: false,
				recievingMarketingInformation: false,
				confirmAge: false,
			},
		},
	});

	const [agreeAll, setAgreeAll] = useState(false);
	const [termsOfUse, setTermsOfUse] = useState(false);
	const [providingPersonalInformation, setProvidingPersonalInformation] =
		useState(false);
	const [recievingMarketingInformation, setRecievingMarketingInformation] =
		useState(false);
	const [confirmAge, setConfirmAge] = useState(false);

	// 이메일 중복 확인 상태
	const [emailCheck, setEmailCheck] = useState({
		checked: false,
		valid: false,
		message: "",
	});

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
				terms: {
					termsOfUse: isChecked,
					providingPersonalInformation: isChecked,
					recievingMarketingInformation: isChecked,
					confirmAge: isChecked,
				},
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

	// 중복 확인 함수
	const checkEmailDuplication = async () => {
		try {
			const response = await axiosInstance.get(
				`/users/email?email=${form.email}`,
			);
			if (response.data.ok) {
				setEmailCheck({
					checked: true,
					valid: true,
					message: "사용 가능한 이메일입니다.",
				});
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setEmailCheck({
					checked: true,
					valid: false,
					message: error.response.data.message,
				});
			} else {
				console.error("이메일 중복 확인 중 오류가 발생했습니다.", error);
				setEmailCheck({
					checked: true,
					valid: false,
					message: "중복 확인 중 오류가 발생했습니다.",
				});
			}
		}
	};

	// 회원가입 요청 처리
	const signUpMutation = useMutation(
		async (newUser: SignUpRequest) => {
			const response = await axiosInstance.post("/users/", newUser);
			return response.data;
		},
		{
			onSuccess: () => {
				// 토스트 표시
				toast.success("회원가입이 완료되었습니다.");

				navigate("/signin");
			},
			onError: (error: any) => {
				console.error(error);

				if (error.response) {
					switch (error.response.status) {
						case 409:
							toast.error(
								error.response.data.message || "이미 등록된 이메일입니다.",
							);
							break;
						case 422:
							const errorMessages = error.response.data.errors
								.map((err: { msg: string }) => `${err.msg}`)
								.join("\n");
							toast.error(`회원가입 실패: ${errorMessages}`);
							break;
						case 500:
							toast.error(
								"서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
							);
							break;
						default:
							toast.error("회원가입 중 알 수 없는 오류가 발생했습니다.");
					}
				} else {
					toast.error("회원가입 중 알 수 없는 오류가 발생했습니다.");
				}
			},
		},
	);
	// 폼 제출 처리
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			toast.error("비밀번호가 일치하지 않습니다.");
			return;
		}
		const userObject = createUserObject();
		signUpMutation.mutate(userObject);
	};

	// 입력 필드 변경 처리
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		// 전화번호 필드의 경우 숫자만 허용
		if (name === "phone") {
			const numbersOnly = value.replace(/[^0-9]/g, "");
			setForm({ ...form, [name]: numbersOnly });
		} else {
			setForm({ ...form, [name]: value });
		}
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
							defaultValue={form.email}
							onChange={debounce(handleChange)}
							placeholder="이메일"
							required
						/>
						<button type="button" onClick={checkEmailDuplication}>
							중복 확인
						</button>
						{emailCheck.checked && <p>{emailCheck.message}</p>}
					</li>
					<li>
						<label htmlFor="password">비밀번호</label>
						<input
							type="password"
							id="password"
							name="password"
							defaultValue={form.password}
							onChange={debounce(handleChange)}
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
							defaultValue={form.confirmPassword}
							onChange={debounce(handleChange)}
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
							defaultValue={form.name}
							onChange={debounce(handleChange)}
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
							defaultValue={form.phone}
							onChange={debounce(handleChange)}
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

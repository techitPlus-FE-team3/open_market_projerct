import { useState, useEffect } from "react";
import axiosInstance from "@/api/instance";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserEdit() {
	const [userData, setUserData] = useState({
		email: "",
		name: "",
		password: "",
		confirmPassword: "",
		phone: "",
		extra: {
			profileImage: "",
			terms: {
				recievingMarketingInformation: false,
				confirmAge: false,
			},
		},
	});
	const navigate = useNavigate();
	const userId = localStorage.getItem("_id"); // 혹은 다른 인증 방식을 사용할 수 있습니다.
	const accessToken = localStorage.getItem("accessToken");

	useEffect(() => {
		// 사용자 정보 불러오기
		async function fetchUserInfo() {
			try {
				const response = await axiosInstance.get(`/users/${userId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (response.data.ok) {
					// API로부터 불러온 데이터를 기본값과 병합.
					const fetchedData = {
						...userData, // 기존 상태의 기본값
						...response.data.item, // API 응답
						extra: {
							...userData.extra, // 기존 상태의 extra 기본값
							...response.data.item.extra, // API 응답의 extra
							terms: {
								...userData.extra.terms, // 기존 상태의 terms 기본값
								...response.data.item.extra?.terms, // API 응답의 terms
							},
						},
						password: "", // 비밀번호 필드 초기화
						confirmPassword: "", // 비밀번호 확인 필드 초기화
					};
					setUserData(fetchedData);
				}
			} catch (error) {
				console.error("Error fetching user info:", error);
				toast.error("회원 정보를 불러오는데 실패했습니다.");
			}
		}

		fetchUserInfo();
	}, [userId, accessToken]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// 비밀번호 확인 로직
		if (userData.password !== userData.confirmPassword) {
			toast.error("비밀번호가 일치하지 않습니다.");
			return;
		}

		// 정보 수정 요청
		try {
			const response = await axiosInstance.patch(`/users/${userId}`, userData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (response.data.ok) {
				toast.success("회원 정보가 수정되었습니다.");
				navigate("/mypage");
			}
		} catch (error) {
			console.error("Error updating user info:", error);
			toast.error("회원 정보 수정에 실패했습니다.");
		}
	}

	async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { id, value, type, checked } = event.target;
		if (type === "checkbox") {
			setUserData({
				...userData,
				extra: {
					...userData.extra,
					terms: {
						...userData.extra.terms,
						[id]: checked,
					},
				},
			});
		} else {
			setUserData({
				...userData,
				[id]: value,
			});
		}
	}

	// 파일 업로드 핸들러
	async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append("attach", file); // 'attach' 필드에 파일 추가

			try {
				const response = await axiosInstance.post("/files", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data.ok) {
					const filePath = `https://localhost${response.data.file.path}`;
					// 상태 업데이트로 이미지 경로 저장
					setUserData((prevUserData) => ({
						...prevUserData,
						extra: {
							...prevUserData.extra,
							profileImage: filePath,
						},
					}));
				}
			} catch (error) {
				console.error("Image upload failed:", error);
				toast.error("이미지 업로드에 실패했습니다.");
			}
		}
	}

	return (
		<section>
			<Helmet>
				<title>Edit User - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>회원정보 수정</h2>
			<form onSubmit={handleSubmit}>
				<ul>
					{/* 프로필 이미지 수정 */}
					<li>
						<img
							src={userData.extra.profileImage || "../../public/user.svg"}
							alt="프로필 이미지"
						/>
						<label htmlFor="userProfileImage">프로필 이미지</label>
						<input
							type="file"
							accept="image/*"
							id="userProfileImage"
							onChange={handleImageUpload}
						/>
					</li>
					<li>
						<label htmlFor="name">이름</label>
						<input
							type="text"
							id="name"
							value={userData.name}
							onChange={handleInputChange}
						/>
					</li>
					<li>
						<label htmlFor="email">이메일</label>
						<input
							type="email"
							id="email"
							value={userData.email}
							onChange={handleInputChange}
						/>
					</li>
					<li>
						<label htmlFor="password">비밀번호</label>
						<input
							type="password"
							id="password"
							value={userData.password}
							onChange={handleInputChange}
						/>
					</li>
					<li>
						<label htmlFor="confirmPassword">비밀번호 확인</label>
						<input
							type="password"
							id="confirmPassword"
							value={userData.confirmPassword}
							onChange={handleInputChange}
						/>
					</li>
					<li>
						<label htmlFor="phone">휴대폰 번호</label>
						<input
							type="text"
							id="phone"
							value={userData.phone}
							onChange={handleInputChange}
						/>
					</li>
				</ul>
				<ul>
					<li>
						<input
							type="checkbox"
							id="recievingMarketingInformation"
							checked={!!userData.extra.terms.recievingMarketingInformation}
							onChange={handleInputChange}
						/>
						<label htmlFor="recievingMarketingInformation">
							마케팅 정보 수신 동의
						</label>
						<button type="button">약관보기</button>
					</li>
					<li>
						<input
							type="checkbox"
							id="confirmAge"
							checked={!!userData.extra.terms.confirmAge}
							onChange={handleInputChange}
						/>
						<label htmlFor="confirmAge">본인은 만 14세 이상입니다.</label>
					</li>
				</ul>
				<Link to="/mypage">수정취소</Link>
				<button type="submit">수정하기</button>
			</form>
		</section>
	);
}

export default UserEdit;

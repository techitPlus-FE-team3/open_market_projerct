// import axiosInstance from "@/api/instance";
import axiosInstance from "@/utils/refreshToken";
import { debounce } from "@/utils";
import { uploadFile } from "@/utils/uploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface ProductRegistForm {
	show: boolean;
	active: boolean;
	name: string;
	mainImages: string[];
	content: string;
	price: number;
	shippingFees: number;
	quantity: number;
	buyQuantity: number;
	extra: {
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		soundFile: string;
	};
}

function ProductRegistration() {
	const navigate = useNavigate();
	const albumRef = useRef(null);
	const titleRef = useRef(null);
	const formRef = useRef(null);
	const genreRef = useRef(null);
	const soundFileRef = useRef(null);

	const [postItem, setPostItem] = useState<ProductRegistForm>({
		show: true,
		active: true,
		name: "",
		mainImages: [],
		content: "",
		price: 0,
		shippingFees: 0,
		quantity: Number.MAX_SAFE_INTEGER,
		buyQuantity: 0,
		extra: {
			isNew: true,
			isBest: false,
			category: "",
			tags: [],
			soundFile: "",
		},
	});
	const [category, setCategory] = useState<CategoryCode[]>();

	function handlePostProductRegist(e: { preventDefault: () => void }) {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");

		if (postItem.mainImages.length === 0) {
			toast.error("앨범아트를 업로드해야 합니다", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		if (postItem.extra.soundFile === "") {
			toast.error("음원을 업로드해야 합니다", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}
		try {
			axiosInstance
				.post(`/seller/products`, postItem, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					toast.success("상품이 성공적으로 올라갔습니다", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});

					if (response.status === 200) {
						const productId = response.data.item._id;
						navigate(`/productdetail/${productId}`);
					}

					localStorage.removeItem("userProductsInfo");
				})
				.catch((error) => {
					error.response.data.errors.forEach(
						(err: { msg: Renderable | ValueFunction<Renderable, Toast> }) =>
							toast.error(err.msg),
					);
				});
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		// 비로그인 상태 체크
		if (!accessToken) {
			toast.error("로그인이 필요한 서비스입니다.");
			navigate("/signin");
			return;
		}

		async function fetchCategory() {
			try {
				const response = await axiosInstance.get(`/codes/productCategory`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const responseData = response.data.item;
				const categoryCodeList = responseData.productCategory.codes;
				setCategory(categoryCodeList);

				// 데이터를 로컬 스토리지에 저장
			} catch (error) {
				// 에러 처리
				console.error("상품 리스트 조회 실패:", error);
			}
		}

		fetchCategory();
	}, []);

	return (
		<section>
			<Helmet>
				<title>Register Product - 모두의 오디오 MODI</title>
			</Helmet>
			<div>
				<h2>상품 등록</h2>
				<form encType="multipart/form-data" ref={formRef}>
					<div>
						<div>
							<div>
								<FileUploadIcon fontSize="large" />
								<label htmlFor="photo">앨범아트 업로드</label>
							</div>
							<input
								type="file"
								accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
								ref={albumRef}
								onChange={(e: { target: { files: any } }) =>
									uploadFile(e.target.files[0], setPostItem, "image")
								}
								name="photo"
								id="photo"
							/>
							{postItem.mainImages.length !== 0 ? (
								<img
									src={postItem?.mainImages[0]}
									alt={`${postItem?.name}앨범아트`}
								/>
							) : (
								""
							)}
						</div>
						<div>
							<div>
								<label htmlFor="title">타이틀</label>
								<input
									type="text"
									name="title"
									ref={titleRef}
									onChange={debounce((e: { target: { value: any } }) =>
										setPostItem({ ...postItem, name: e.target.value }),
									)}
									id="title"
									placeholder="제목을 입력해주세요"
								/>
							</div>
							<div>
								<div>
									<label htmlFor="genre">장르</label>
									<select
										name="genre"
										id="genre"
										ref={genreRef}
										onChange={(e) => {
											setPostItem({
												...postItem,
												extra: { ...postItem.extra, category: e.target.value },
											});
										}}
										defaultValue="none"
									>
										<option value="none" disabled hidden>
											장르를 선택해주세요
										</option>
										{category && category.length !== 0
											? category.map((item) => (
													<option key={item.code} value={item.value}>
														{item.value}
													</option>
											  ))
											: undefined}
									</select>
								</div>
								<div>
									<label htmlFor="hashTag">해시태그 | </label>
									<input
										type="text"
										name="hashTag"
										onChange={debounce(
											(e: React.ChangeEvent<HTMLInputElement>) => {
												const tagsArray = e.target.value.split(",");
												setPostItem({
													...postItem,
													extra: { ...postItem.extra, tags: tagsArray },
												});
											},
										)}
										id="hashTag"
										placeholder="해시태그를 ','(콤마)로 구분해주세요"
									/>
								</div>
							</div>
							<div>
								<div>
									<label htmlFor="description">설명</label>
									<textarea
										name="description"
										id="description"
										onChange={debounce((e: { target: { value: any } }) =>
											setPostItem({ ...postItem, content: e.target.value }),
										)}
										cols={30}
										rows={3}
									/>
								</div>
								<div>
									<div>
										<FileUploadIcon fontSize="small" />
										<label htmlFor="mp3">음원 업로드</label>
									</div>
									<input
										type="file"
										accept="audio/*"
										name="mp3"
										id="mp3"
										ref={soundFileRef}
										onChange={(e: { target: { files: any } }) =>
											uploadFile(e.target.files[0], setPostItem, "soundFile")
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div>
							<label htmlFor="price">가격</label>
							<input
								type="number"
								name="price"
								id="price"
								onChange={debounce(
									(e: { target: { value: string | number } }) =>
										setPostItem({ ...postItem, price: +e.target.value }),
								)}
							/>
						</div>
						<div>
							<span>공개여부</span>
							<div>
								<div>
									<span>공개</span>
									<input
										type="radio"
										value="true"
										name="public"
										onChange={() => setPostItem({ ...postItem, show: true })}
									/>
								</div>
								<div>
									<span>비공개</span>
									<input
										type="radio"
										value="false"
										name="public"
										onChange={() => setPostItem({ ...postItem, show: false })}
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<Link to={"/"}>취소</Link>
						<button type="submit" onClick={handlePostProductRegist}>
							등록
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}

export default ProductRegistration;

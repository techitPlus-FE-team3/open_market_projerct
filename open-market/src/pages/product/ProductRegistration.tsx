import FormInput from "@/components/FormInput";
import FunctionalButton from "@/components/FunctionalButton";
import SelectGenre from "@/components/SelectGenre";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance, debounce } from "@/utils";
import { uploadFile } from "@/utils/uploadFile";
import styled from "@emotion/styled";
import CircleIcon from "@mui/icons-material/Circle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Radio, RadioProps } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ProductRegistForm {
	show: boolean;
	active: boolean;
	name: string;
	mainImages: ProductFiles[];
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
		soundFile: ProductFiles;
	};
}

const ProductRadioButtonWrapper = styled.div`
	width: 590px;
	height: 290px;
	color: ${Common.colors.gray};
	border-radius: 10px;
	border: 1px solid;
	padding: ${Common.space.spacingMd};
`;

const RadioButtonGroup = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 50%;
	transform: translateY(-60%);
`;

const CustomRadio = muiStyled((props: RadioProps) => (
	<Radio
		{...props}
		icon={<RadioButtonUncheckedIcon style={{ color: "#D9D9D9" }} />}
		checkedIcon={<CircleIcon style={{ color: "#FFB258" }} />}
	/>
))``;

function ProductRegistration() {
	const navigate = useNavigate();

	const [postItem, setPostItem] = useState<ProductRegistForm>({
		show: true,
		active: true,
		name: "",
		mainImages: [{ url: "", fileName: "", orgName: "" }],
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
			soundFile: { url: "", fileName: "", orgName: "" },
		},
	});
	const [category, setCategory] = useState<CategoryCode[]>();

	//비로그인 상태 체크
	useRequireAuth();

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

		if (postItem.extra.soundFile.url === "") {
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

	function handleRegistCancel() {
		const result = confirm("정말로 등록을 취소하시겠습니까?");
		if (result) {
			navigate(-1);
		}
	}

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

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
				<form encType="multipart/form-data">
					<div>
						<div>
							<div>
								<FileUploadIcon fontSize="large" />
								<label htmlFor="photo">앨범아트 업로드</label>
							</div>
							<input
								type="file"
								accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
								onChange={(e: { target: { files: any } }) => {
									uploadFile(e.target.files[0], setPostItem, "image");
								}}
								name="photo"
								id="photo"
							/>
							{postItem?.mainImages[0].url !== "" ? (
								<img
									src={postItem?.mainImages[0].url}
									alt={`${postItem?.name}앨범아트`}
								/>
							) : (
								""
							)}
						</div>
						<div>
							<div>
								<FormInput
									name="title"
									label="타이틀"
									handleFn={debounce((e: { target: { value: any } }) =>
										setPostItem({ ...postItem, name: e.target.value }),
									)}
								/>
							</div>
							<div>
								<div>
									<SelectGenre
										id="genre"
										value="none"
										handleFn={(e) => {
											setPostItem({
												...postItem,
												extra: { ...postItem.extra, category: e.target.value },
											});
										}}
										category={category}
									/>
								</div>
								<div>
									<FormInput
										name="hashTag"
										label="해시태그"
										placeholder="해시태그를 ','(콤마)로 구분해주세요"
										handleFn={debounce(
											(e: React.ChangeEvent<HTMLInputElement>) => {
												const tagsArray = e.target.value.split(",");
												setPostItem({
													...postItem,
													extra: { ...postItem.extra, tags: tagsArray },
												});
											},
										)}
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
							<FormInput
								name="price"
								label="가격"
								type="number"
								handleFn={debounce(
									(e: { target: { value: string | number } }) =>
										setPostItem({ ...postItem, price: +e.target.value }),
								)}
							/>
						</div>
						<ProductRadioButtonWrapper>
							<span>공개여부</span>
							<RadioButtonGroup>
								<span>공개</span>
								<CustomRadio
									checked={postItem.show === true}
									onChange={() =>
										setPostItem((prevPostItem) => ({
											...prevPostItem,
											show: true,
										}))
									}
									value="true"
								/>
								<div>
									<span>비공개</span>
									{/* <input
										type="radio"
										value="false"
										name="public"
										onChange={() =>
											setPostItem((prevPostItem) => ({
												...prevPostItem,
												show: false,
											}))
										}
									/> */}
									<CustomRadio
										checked={postItem.show === false}
										onChange={() =>
											setPostItem((prevPostItem) => ({
												...prevPostItem,
												show: false,
											}))
										}
										value="false"
									/>
								</div>
							</RadioButtonGroup>
						</ProductRadioButtonWrapper>
					</div>
					<div>
						<FunctionalButton
							secondary={true}
							handleFn={handleRegistCancel}
							text="취소"
						/>
						<FunctionalButton
							type="submit"
							handleFn={handlePostProductRegist}
							text="등록"
						/>
					</div>
				</form>
			</div>
		</section>
	);
}

export default ProductRegistration;

import FormInput from "@/components/FormInput";
import FunctionalButton from "@/components/FunctionalButton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { axiosInstance, debounce } from "@/utils";
import { uploadFile } from "@/utils/uploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface ProductEditForm {
	show: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	buyQuantity: number;
	extra: {
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
}

function ProductEdit() {
	const navigate = useNavigate();

	const { productId } = useParams();
	const [userProductInfo, setUserProductInfo] = useState<Product>();
	const [category, setCategory] = useState<CategoryCode[]>();
	const [postItem, setPostItem] = useState<ProductEditForm>({
		show: false,
		name: "",
		mainImages: [{ url: "", fileName: "", orgName: "" }],
		content: "",
		price: 0,
		shippingFees: 0,
		buyQuantity: 0,
		extra: {
			category: "",
			tags: [],
			soundFile: { url: "", fileName: "", orgName: "" },
		},
	});

	useRequireAuth();

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		const fetchUserProductInfo = async () => {
			try {
				const response = await axiosInstance.get<ProductResponse>(
					`/seller/products/${productId}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				const fetchedProductInfo = response.data.item;
				setUserProductInfo(fetchedProductInfo);
				setPostItem({
					show: fetchedProductInfo?.show || false,
					name: fetchedProductInfo?.name || "",
					mainImages: fetchedProductInfo?.mainImages || [],
					content: fetchedProductInfo?.content || "",
					price: fetchedProductInfo?.price || 0,
					buyQuantity: fetchedProductInfo?.buyQuantity || 0,
					shippingFees: 0,
					extra: {
						category: fetchedProductInfo?.extra?.category || "",
						tags: fetchedProductInfo?.extra?.tags || [],
						soundFile: fetchedProductInfo?.extra?.soundFile || {
							url: "",
							fileName: "",
							orgName: "",
						},
					},
				});
			} catch (error) {
				console.error("상품 정보 조회 실패:", error);
			}
		};
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
		fetchUserProductInfo();
	}, [productId]);

	function handleEditProduct(e: { preventDefault: () => void }) {
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
				.patch(`/seller/products/${productId}`, postItem, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then(() => {
					toast.success("상품이 성공적으로 수정되었습니다", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					navigate(-1);
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

	function handleEditCancel() {
		const result = confirm("정말로 수정을 취소하시겠습니까?");
		if (result) {
			navigate(-1);
		}
	}

	return (
		<section>
			<Helmet>
				<title>Edit Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상품 수정</h2>
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
							name="photo"
							id="photo"
							onChange={(e: { target: { files: any } }) => {
								uploadFile(e.target.files[0], setPostItem, "image");
							}}
						/>
						<img
							src={postItem?.mainImages[0].url}
							alt={`${userProductInfo?.name}앨범아트`}
						/>
					</div>
					<div>
						<FormInput
							name="title"
							label="타이틀"
							defaultValue={userProductInfo?.name}
							handleFn={debounce((e: { target: { value: any } }) =>
								setPostItem({ ...postItem, name: e.target.value }),
							)}
						/>
						<div>
							<div>
								<label htmlFor="genre">장르</label>
								<select
									name="genre"
									id="genre"
									defaultValue={userProductInfo?.extra?.category}
									onChange={(e) => {
										setPostItem({
											...postItem,
											extra: { ...postItem.extra, category: e.target.value },
										});
									}}
								>
									{category && category.length !== 0
										? category.map((item) => (
												<option key={item.code} value={item.code}>
													{item.value}
												</option>
										  ))
										: undefined}
								</select>
							</div>
							<FormInput
								name="hashTag"
								label="해시태그"
								defaultValue={userProductInfo?.extra?.tags}
								placeholder="해시태그를 ','(콤마)로 구분해주세요"
								handleFn={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
									const tagsArray = e.target.value.split(",");
									setPostItem({
										...postItem,
										extra: { ...postItem.extra, tags: tagsArray },
									});
								})}
							/>
						</div>
						<div>
							<div>
								<label htmlFor="description">설명</label>
								<textarea
									name="description"
									id="description"
									cols={30}
									rows={3}
									defaultValue={userProductInfo?.content}
									onChange={debounce((e: { target: { value: any } }) =>
										setPostItem({ ...postItem, content: e.target.value }),
									)}
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
					<FormInput
						name="price"
						label="가격"
						type="number"
						defaultValue={userProductInfo?.price}
						handleFn={debounce((e: { target: { value: string | number } }) =>
							setPostItem({ ...postItem, price: +e.target.value }),
						)}
					/>
					<div>
						<span>공개여부</span>
						<div>
							<input
								type="radio"
								value="true"
								name="public"
								onChange={() => setPostItem({ ...postItem, show: true })}
							/>
							<span>공개</span>
						</div>
						<div>
							<input
								type="radio"
								value="false"
								name="public"
								onChange={() => setPostItem({ ...postItem, show: false })}
							/>
							<span>비공개</span>
						</div>
					</div>
				</div>
				<div>
					<FunctionalButton
						secondary={true}
						handleFn={handleEditCancel}
						text="취소"
					/>
					<FunctionalButton
						type="submit"
						handleFn={handleEditProduct}
						text="수정"
					/>
				</div>
			</form>
		</section>
	);
}

export default ProductEdit;

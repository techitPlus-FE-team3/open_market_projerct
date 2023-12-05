import { uploadFile } from "@/utils/uploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface ProductEditForm {
	show: boolean;
	name: string;
	mainImages: string[];
	content: string;
	price: number;
	shippingFees: number;
	buyQuantity: number;
	extra: {
		category: string;
		tags: string[];
		soundFile: string;
		bookmark: number;
	};
}

function ProductEdit() {
	const navigate = useNavigate();

	const { productId } = useParams();
	const [userProductInfo, setUserProductInfo] = useState<Product>();
	const [postItem, setPostItem] = useState<ProductEditForm>({
		show: false,
		name: "",
		mainImages: [],
		content: "",
		price: 0,
		shippingFees: 0,
		buyQuantity: 0,
		extra: {
			category: "",
			tags: [],
			soundFile: "",
			bookmark: 0,
		},
	});

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		const fetchUserProductInfo = async () => {
			try {
				const response = await axios.get<ProductResponse>(
					`https://localhost/api/seller/products/${productId}`,
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
						soundFile: fetchedProductInfo?.extra?.soundFile || "",
						bookmark: fetchedProductInfo?.extra?.bookmark || 0,
					},
				});
			} catch (error) {
				console.error("상품 정보 조회 실패:", error);
			}
		};

		fetchUserProductInfo();
	}, [productId]);

	function handleEditProduct(e: { preventDefault: () => void }) {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");

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
			axios
				.patch(`https://localhost/api/seller/products/${productId}`, postItem, {
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
							src={postItem?.mainImages[0]}
							alt={`${userProductInfo?.name}앨범아트`}
						/>
					</div>
					<div>
						<div>
							<label htmlFor="title">타이틀 | </label>
							<input
								type="text"
								name="title"
								id="title"
								placeholder="제목을 입력해주세요"
								defaultValue={userProductInfo?.name}
								onChange={(e) =>
									setPostItem({ ...postItem, name: e.target.value })
								}
							/>
						</div>
						<div>
							<div>
								<label htmlFor="genre">장르 | </label>
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
									{/*{genres.map((genre) => (
										<option key={genre} value={genre}>
											{genre}
										</option>
									))}*/}
								</select>
							</div>
							<div>
								<label htmlFor="hashTag">해시태그 | </label>
								<input
									type="text"
									name="hashTag"
									id="hashTag"
									placeholder=",(콤마)로 구분하여 입력해주세요"
									defaultValue={userProductInfo?.extra?.tags}
									onChange={(e) => {
										const tagsArray = e.target.value.split(",");
										setPostItem({
											...postItem,
											extra: { ...postItem.extra, tags: tagsArray },
										});
									}}
								/>
							</div>
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
									onChange={(e) =>
										setPostItem({ ...postItem, content: e.target.value })
									}
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
						<label htmlFor="price">가격</label>
						<input
							type="number"
							name="price"
							id="price"
							defaultValue={userProductInfo?.price}
							onChange={(e) =>
								setPostItem({ ...postItem, price: +e.target.value })
							}
						/>
					</div>
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
					<button type="button" onClick={handleEditCancel}>
						취소
					</button>
					<button type="submit" onClick={handleEditProduct}>
						수정
					</button>
				</div>
			</form>
		</section>
	);
}

export default ProductEdit;

import genres from "@/data/genres";
import { uploadFile } from "@/utils/uploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface ProductRegistForm {
	active: boolean;
	name: string;
	mainImages: string[];
	content: string;
	price: number;
	shippingFees: number;
	extra: {
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		order: number;
		soundFile: string;
		bookmark: number;
	};
}
function ProductRegistration() {
	const navigate = useNavigate();
	const albumRef = useRef(null);
	const titleRef = useRef(null);
	const formRef = useRef(null);
	const genreRef = useRef(null);
	const soundFileRef = useRef(null);

	const [album, setAlbum] = useState("");
	const [soundFile, setSoundFile] = useState("");
	const [postItem, setPostItem] = useState<ProductRegistForm>({
		active: true,
		name: "",
		mainImages: [],
		content: "",
		price: 0,
		shippingFees: 0,
		extra: {
			isNew: true,
			isBest: false,
			category: "",
			tags: [],
			order: 0,
			soundFile: "",
			bookmark: 0,
		},
	});

	useEffect(() => {
		if (album) {
			uploadFile(album, setPostItem, "image");
		}
		if (soundFile) {
			uploadFile(soundFile, setPostItem, "soundFile");
		}
	}, [album, soundFile]);

	function handlePostProductRegist(e: { preventDefault: () => void }) {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");
		try {
			axios
				.post("https://localhost/api/seller/products", postItem, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then(() => {
					toast.success("상품이 성공적으로 올라갔습니다", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					navigate("/");
				})
				.catch((error) => {
					console.error("에러 발생:", error);
				});
		} catch (error) {
			console.error(error);
		}
	}

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
									setAlbum(e.target.files[0])
								}
								name="photo"
								id="photo"
							/>
						</div>
						<div>
							<div>
								<label htmlFor="title">타이틀</label>
								<input
									type="text"
									name="title"
									ref={titleRef}
									onChange={(e) =>
										setPostItem({ ...postItem, name: e.target.value })
									}
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
											const tagsArray = e.target.value.split(" ");
											setPostItem({
												...postItem,
												extra: { ...postItem.extra, tags: tagsArray },
											});
										}}
										defaultValue="none"
									>
										<option value="none" disabled hidden>
											장르를 선택해주세요
										</option>
										{genres.map((item) => (
											<option key={item} value={item}>
												{item}
											</option>
										))}
									</select>
								</div>
								<div>
									<label htmlFor="hashTag">해시태그 | </label>
									<input
										type="text"
										name="hashTag"
										onChange={(e) => {
											const tagsArray = e.target.value.split(" ");
											setPostItem({
												...postItem,
												extra: { ...postItem.extra, tags: tagsArray },
											});
										}}
										id="hashTag"
										placeholder="해시태그를 띄어쓰기로 구분해주세요"
									/>
								</div>
							</div>
							<div>
								<div>
									<label htmlFor="description">설명</label>
									<textarea
										name="description"
										id="description"
										onChange={(e) =>
											setPostItem({ ...postItem, content: e.target.value })
										}
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
											setSoundFile(e.target.files[0])
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
								onChange={(e) =>
									setPostItem({ ...postItem, price: +e.target.value })
								}
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
										onChange={(e) => setPostItem({ ...postItem, active: true })}
									/>
								</div>
								<div>
									<span>비공개</span>
									<input
										type="radio"
										value="false"
										name="public"
										onChange={(e) =>
											setPostItem({ ...postItem, active: false })
										}
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

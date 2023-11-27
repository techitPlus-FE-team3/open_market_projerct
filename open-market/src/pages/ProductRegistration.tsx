import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function ProductRegistration() {
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
								name="photo"
								id="photo"
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
								/>
							</div>
							<div>
								<div>
									<label htmlFor="genre">장르 | </label>
									<select name="genre" id="genre" defaultValue="none">
										<option value="none" disabled hidden>
											장르를 선택해주세요
										</option>
										<option value="dance">dance</option>
										<option value="pop">pop</option>
										<option value="k-pop">k-pop</option>
										<option value="indie">indie</option>
									</select>
								</div>
								<div>
									<label htmlFor="hashTag">해시태그 | </label>
									<input
										type="text"
										name="hashTag"
										id="hashTag"
										placeholder="해시태그를 입력해주세요"
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
									/>
								</div>
								<div>
									<div>
										<FileUploadIcon fontSize="small" />
										<label htmlFor="mp3">음원 업로드</label>
									</div>
									<input type="file" accept="audio/*" name="mp3" id="mp3" />
								</div>
							</div>
						</div>
					</div>
					<div>
						<div>
							<label htmlFor="price">가격</label>
							<input type="number" name="price" id="price" />
						</div>
						<div>
							<span>공개여부</span>
							<div>
								<div>
									<span>공개</span>
									<input type="radio" value="true" name="public" />
								</div>
								<div>
									<span>비공개</span>
									<input type="radio" value="false" name="public" />
								</div>
							</div>
						</div>
					</div>
					<div>
						<Link to={"/"}>취소</Link>
						<button type="submit">등록</button>
					</div>
				</form>
			</div>
		</section>
	);
}

export default ProductRegistration;

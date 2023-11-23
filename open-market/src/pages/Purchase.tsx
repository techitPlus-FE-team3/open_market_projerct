import { Helmet } from "react-helmet-async";

function Purchase() {
	return (
		<>
			<Helmet>
				<title>Purchase Product - 모두의 오디오 MODI</title>
			</Helmet>
			<section>
				<h2>상품 구매</h2>
				<form encType="multipart/form-data">
					<div>
						<div>
							<label htmlFor="photo">앨범아트</label>
							<input
								type="file"
								accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
								name="photo"
								id="photo"
							/>
						</div>
						<div>
							<div>
								<label htmlFor="title">제목</label>
								<input
									type="text"
									name="title"
									id="title"
									placeholder="제목을 입력해주세요"
								/>
							</div>
							<div>
								<div>
									<label htmlFor="genre">장르</label>
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
									<label htmlFor="hashTag">해시태그</label>
									<input
										type="text"
										name="hashTag"
										id="hashTag"
										placeholder="해시태그를 입력해주세요"
									/>
								</div>
							</div>
							<div>
								<label htmlFor="price">가격</label>
								<input type="number" name="price" id="price" />
							</div>
						</div>
					</div>
					<div>
						<div>결제 정보</div>
					</div>
					<div>
						<button type="reset">취소</button>
						<button type="submit">확인</button>
					</div>
				</form>
			</section>
		</>
	);
}

export default Purchase;

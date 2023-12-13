import { useRequireAuth } from "@/hooks/useRequireAuth";
import { axiosInstance } from "@/utils";
import axios from "axios";
import { Key, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MyPageList from "@/components/MyPageList";

function MyPage() {
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const [userOrdersInfo, setUserOrdersInfo] = useState<Order[]>([]);

	const [bookmarkDetails, setBookmarkDetails] = useState<any[]>([]);

	const userId = localStorage.getItem("_id");
	const accessToken = localStorage.getItem("accessToken");
	const historyList = JSON.parse(
		sessionStorage.getItem("historyList") as string,
	);

	// 비로그인 상태 체크
	useRequireAuth();

	useEffect(() => {
		async function fetchUserInfo() {
			try {
				const response = await axiosInstance.get<UserResponse>(
					`/users/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setUserInfo(response.data.item);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.error("회원 정보 조회 실패:", error);
				} else {
					// 에러가 AxiosError가 아닌 경우
					console.error("Unexpected error:", error);
				}
			}
		}

		async function fetchUserProductsInfo() {
			try {
				const response = await axiosInstance.get<ProductListResponse>(
					`/seller/products/`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setUserProductsInfo(response.data.item);
			} catch (error) {
				console.error("회원 정보 조회 실패:", error);
			}
		}

		async function fetchUserOrderInfo() {
			try {
				const response = await axiosInstance.get<OrderListResponse>("/orders", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setUserOrdersInfo(response.data.item);
			} catch (err) {
				console.error(err);
			}
		}

		async function fetchBookmarks() {
			try {
				const response = await axiosInstance.get(`/bookmarks`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setBookmarkDetails(response.data.item || []);
			} catch (error) {
				console.error("북마크 정보 조회 실패:", error);
			}
		}

		fetchUserInfo();
		fetchUserProductsInfo();
		fetchUserOrderInfo();
		fetchBookmarks();
	}, [accessToken]);

	if (!userInfo) {
		return <div>Loading...</div>; // 로딩 처리
	}

	const profileImageUrl = userInfo.extra?.profileImage || "public/user.svg";

	return (
		<section>
			<Helmet>
				<title>My Page - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>마이페이지</h2>
			<article>
				<h3>내 정보</h3>
				<img src={profileImageUrl} alt="회원 썸네일" />
				<div>
					<div>
						<h4>회원정보</h4>
						<div>
							<h5>이메일</h5>
							<p>{userInfo.email}</p>
						</div>
						<div>
							<h5>이름</h5>
							<p>{userInfo.name}</p>
						</div>
						<div>
							<h5>휴대폰 번호</h5>
							<p>{userInfo.phone}</p>
						</div>
						<Link to={`/useredit/${userId}`}>회원정보 수정</Link>
					</div>
					<div>
						<h4>내가 쓴 댓글</h4>
						<div>
							<h5>게시글 제목</h5>
							<p>내용</p>
						</div>
						<div>
							<h5>게시글 제목</h5>
							<p>내용</p>
						</div>
						<div>
							<h5>게시글 제목</h5>
							<p>내용</p>
						</div>
						<Link to="/">전체보기</Link>
					</div>
				</div>
			</article>
			<article>
				<h3>북마크</h3>
				<ul>
					{bookmarkDetails.length !== 0 ? (
						bookmarkDetails.slice(0, 4).map((item) => (
							<li key={item._id}>
								<Link to={`/productdetail/${item.product_id}`}>
									<img src={`${item.product.image.url}`} alt="앨범아트" />
								</Link>
							</li>
						))
					) : (
						<span>북마크가 없습니다.</span>
					)}
				</ul>
				<Link to="/">전체보기</Link>
			</article>
			<MyPageList
				title="북마크"
				data={bookmarkDetails.length !== 0 ? bookmarkDetails.slice(0, 4) : []}
				renderItem={(item) => (
					<Link to={`/productdetail/${item.product_id}`}>
						<img src={`${item.product.image.url}`} alt="앨범아트" />
					</Link>
				)}
				linkText="전체보기"
				linkUrl="/"
			/>
			<article>
				<h3>히스토리</h3>
				<ul>
					{historyList ? (
						historyList.map(
							(item: { _id: Key | null | undefined; mainImages: any[] }) => (
								<li key={item._id}>
									<Link to={`/productdetail/${item._id}`}>
										<img src={`${item?.mainImages[0].url}`} alt="앨범아트" />
									</Link>
								</li>
							),
						)
					) : (
						<span>히스토리가 없습니다.</span>
					)}
				</ul>
			</article>
			<MyPageList
				title="히스토리"
				data={historyList ? historyList.slice(0, 4) : []}
				renderItem={(item) => (
					<Link to={`/productdetail/${item._id}`}>
						<img src={`${item.mainImages[0].url}`} alt="앨범아트" />
					</Link>
				)}
			/>
			<article>
				<h3>구매내역</h3>
				<ul>
					{userOrdersInfo.length !== 0 ? (
						userOrdersInfo.slice(0, 4).map((item) => {
							return (
								<li key={item._id}>
									<Link to={`/productdetail/${item.products[0]._id}`}>
										<img
											src={item.products[0].image.url}
											alt={`${item.products[0].name} 사진`}
										/>
									</Link>
								</li>
							);
						})
					) : (
						<span>구매 내역이 없습니다.</span>
					)}
				</ul>
				<Link to="/orders">전체보기</Link>
			</article>
			<MyPageList
				title="구매내역"
				data={userOrdersInfo.length !== 0 ? userOrdersInfo.slice(0, 4) : []}
				renderItem={(item) => (
					<Link to={`/productdetail/${item.products[0]._id}`}>
						<img
							src={item.products[0].image.url}
							alt={`${item.products[0].name} 사진`}
						/>
					</Link>
				)}
				linkText="전체보기"
				linkUrl="/orders"
			/>
			<article>
				<h3>판매상품관리</h3>
				<ul>
					{userProductsInfo.length !== 0 ? (
						userProductsInfo.slice(0, 5).map((item) => (
							<li key={item._id}>
								<Link to={`/productmanage/${item._id}`}>
									<img src={`${item.mainImages[0].url}`} alt="앨범아트" />
								</Link>
							</li>
						))
					) : (
						<span>판매 내역이 없습니다.</span>
					)}
				</ul>
				<Link to={`/user/${userId}/products`}>전체보기</Link>
			</article>
			<MyPageList
				title="판매상품관리"
				data={userProductsInfo.length !== 0 ? userProductsInfo.slice(0, 5) : []}
				renderItem={(item) => (
					<Link to={`/productmanage/${item._id}`}>
						<img src={`${item.mainImages[0].url}`} alt="앨범아트" />
					</Link>
				)}
				linkText="전체보기"
				linkUrl={`/user/${userId}/products`}
			/>
		</section>
	);
}

export default MyPage;

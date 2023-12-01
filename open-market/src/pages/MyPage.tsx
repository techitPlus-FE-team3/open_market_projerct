import axiosInstance from "@/utils/TokenRefresh";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MyPage() {
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const [userOrdersInfo, setUserOrdersInfo] = useState<Order[]>([]);

	const [bookmarks, setBookmarks] = useState<number[]>([]);
	const [bookmarkDetails, setBookmarkDetails] = useState<any[]>([]);

	const userId = localStorage.getItem("_id");
	const accessToken = localStorage.getItem("accessToken");

	useEffect(() => {
		const fetchUserInfo = async () => {
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
				if (response.data.item.extra && response.data.item.extra.bookmarks) {
					setBookmarks(response.data.item.extra.bookmarks);
				} else {
					setBookmarks([]);
				}
			} catch (error) {
				console.error("회원 정보 조회 실패:", error);
			}
		};

		const fetchUserProductsInfo = async () => {
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
		};

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

		fetchUserInfo();
		fetchUserProductsInfo();
		fetchUserOrderInfo();
	}, []);

	useEffect(() => {
		const fetchBookmarkDetails = async () => {
			const bookmarkInfo = [];
			for (const bookmarkId of bookmarks) {
				try {
					const response = await axiosInstance.get(`/products/${bookmarkId}`, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					bookmarkInfo.push(response.data.item);
				} catch (error) {
					console.error(`북마크 ${bookmarkId} 정보 조회 실패:`, error);
				}
			}
			setBookmarkDetails(bookmarkInfo);
		};

		if (bookmarks.length > 0) {
			fetchBookmarkDetails();
		}
	}, [bookmarks]);

	if (!userInfo) {
		return <div>Loading...</div>; // 로딩 처리
	}

	return (
		<section>
			<Helmet>
				<title>My Page - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>마이페이지</h2>
			<article>
				<h3>내 정보</h3>
				<img src="public/user.svg" alt="회원 썸네일" />
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
						<Link to="/update/userId">회원정보 수정</Link>
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
					{bookmarkDetails.map((product) => (
						<li key={product._id}>
							<Link to={`/products?_id=${product._id}`}>
								<img src={product.mainImages[0]} alt={`앨범 ${product.name}`} />
							</Link>
						</li>
					))}
				</ul>
				<Link to="/">전체보기</Link>
			</article>
			<article>
				<h3>히스토리</h3>
				<ul>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
					<li>
						<Link to="/">
							<img src="" alt="앨범아트" />
						</Link>
					</li>
				</ul>
				<Link to="/">전체보기</Link>
			</article>
			<article>
				<h3>구매내역</h3>
				<ul>
					{userOrdersInfo.length !== 0 ? (
						userOrdersInfo.slice(0, 4).map((order) => {
							return (
								<li key={order._id}>
									<Link to={`/products?_id=${order.products[0]._id}`}>
										{order.products[0].image ? (
											<img
												src={order.products[0].image}
												alt={`${order.products[0].name} 사진`}
											/>
										) : (
											<img
												src="/noImage.svg"
												alt={`${order.products[0].name} 사진 없음`}
											/>
										)}
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
			<article>
				<h3>판매상품관리</h3>
				<ul>
					{Array.isArray(userProductsInfo) ? (
						userProductsInfo.slice(0, 4).map((item) => (
							<li key={item._id}>
								<Link to={`/productmanage/${item._id}`}>
									<img src={`${item.mainImages[0]}`} alt="앨범아트" />
								</Link>
							</li>
						))
					) : (
						<span>데이터가 없습니다.</span>
					)}
				</ul>
				<Link to={`/user/${userId}/products`}>전체보기</Link>
			</article>
		</section>
	);
}

export default MyPage;

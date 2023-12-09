import styled from "@emotion/styled";
import {
	AccountCircle,
	ExitToApp,
	FileUpload,
	Notifications,
	Search,
} from "@mui/icons-material";
import {
	AppBar,
	Badge,
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	Menu,
	MenuItem,
	TextField,
	Toolbar,
} from "@mui/material";
import { KeyboardEvent, useEffect, useState } from "react";

import axiosInstance from "@/api/instance";
import {
	categoryKeywordState,
	fetchproductListState,
	productListState,
	searchKeywordState,
	searchedProductListState,
} from "@/states/productListState";
import { searchProductList } from "@/utils";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { loggedInState } from "../states/authState";
import logoImage from "/logo/logo2.svg";

const Logo = styled.h1`
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;

		img {
			height: 40px;
		}
	}
`;

const Header = () => {
	const [isLogoLoaded, setIsLogoLoaded] = useState(false); // 로고 로딩 상태 관리

	const [productList, setProductList] = useRecoilState(productListState);
	const fetchedProductList = useRecoilValue(fetchproductListState);

	const { refetch } = useQuery(["productList", productList], fetchProductList, {
		onSuccess: (data) => {
			setProductList(data?.data.item);
		},
		refetchOnWindowFocus: false,
	});

	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [_, setSearchedProductList] = useRecoilState<Product[]>(
		searchedProductListState,
	);
	const [__, setCategoryFilter] = useRecoilState<string>(categoryKeywordState);

	const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [notificationAnchorEl, setNotificationAnchorEl] =
		useState<null | HTMLElement>(null);

	async function fetchProductList() {
		try {
			return await axiosInstance.get("/products");
		} catch (err) {
			console.error(err);
		}
	}

	// 로고 이미지 로딩 완료 시 핸들러
	function onLogoLoad() {
		setIsLogoLoaded(true);
	}

	function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
		const currentTarget = event.currentTarget;
		if (currentTarget && document.body.contains(currentTarget)) {
			setAnchorEl(currentTarget);
		}
	}

	function handleNotificationsMenuOpen(event: React.MouseEvent<HTMLElement>) {
		setNotificationAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
		setNotificationAnchorEl(null);
	}

	function handleLogout() {
		// 토큰 제거 및 상태 업데이트
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("_id");
		setLoggedIn(false);

		// 로그인 페이지로 리디렉션
		toast.success(`로그아웃 되었습니다.`);
		navigate("/");
	}

	function handleEnterKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		if (e.key === "Enter" && !e.nativeEvent.isComposing) {
			e.preventDefault();
			setSearchKeyword(target.value);
			target.value = "";
			setCategoryFilter("all");
		}
	}

	useEffect(() => {
		setProductList(fetchedProductList!);
	}, []);

	useEffect(() => {
		refetch();
	}, [productList]);

	useEffect(() => {
		setSearchedProductList(
			searchProductList({
				searchKeyword: searchKeyword,
				productList: productList!,
			}),
		);
	}, [searchKeyword]);

	return (
		<AppBar position="static" color="default" elevation={1}>
			<Toolbar>
				<Logo>
					<Link
						to="/"
						onClick={() => {
							setSearchKeyword("");
							setCategoryFilter("all");
						}}
					>
						<img
							src={logoImage}
							alt="모디 로고"
							onLoad={onLogoLoad} // 이미지 로딩 완료 핸들러
							style={{ display: isLogoLoaded ? "block" : "none" }} // 로딩 상태에 따라 이미지 표시 여부 결정
						/>
						{!isLogoLoaded && <CircularProgress />}
					</Link>
				</Logo>
				<TextField
					variant="outlined"
					size="small"
					placeholder="검색어를 입력하세요"
					label="검색"
					onKeyDown={(e) =>
						handleEnterKeyPress(e as KeyboardEvent<HTMLInputElement>)
					}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<IconButton>
									<Search />
								</IconButton>
							</InputAdornment>
						),
					}}
					sx={{ m: 2 }}
				/>
				{loggedIn && (
					<>
						<Button
							startIcon={<FileUpload />}
							variant="outlined"
							color="inherit"
							component={Link}
							to="/productregistration"
							sx={{ mr: 2 }}
						>
							업로드
						</Button>

						<IconButton color="inherit" onClick={handleNotificationsMenuOpen}>
							<Badge badgeContent={4} color="secondary">
								<Notifications />
							</Badge>
						</IconButton>
						<Menu
							anchorEl={notificationAnchorEl}
							open={Boolean(notificationAnchorEl)}
							onClose={handleMenuClose}
						>
							{/* Notification items can be mapped here */}
							<MenuItem onClick={handleMenuClose}>알림1</MenuItem>
						</Menu>

						<IconButton color="inherit" onClick={handleProfileMenuOpen}>
							<AccountCircle />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem component={Link} to="/mypage" onClick={handleMenuClose}>
								마이페이지
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								{" "}
								<ExitToApp />
								로그아웃
							</MenuItem>
						</Menu>
					</>
				)}
				{!loggedIn && (
					<>
						<IconButton color="inherit" onClick={handleProfileMenuOpen}>
							<AccountCircle />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem component={Link} to="/signin" onClick={handleMenuClose}>
								회원가입 / 로그인
							</MenuItem>
						</Menu>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;

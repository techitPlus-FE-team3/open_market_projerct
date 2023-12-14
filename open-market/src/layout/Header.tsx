import { Common } from "@/styles/common";
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

import { loggedInState } from "@/states/authState";
import {
	categoryKeywordState,
	fetchproductListState,
	productListState,
	searchKeywordState,
	searchedProductListState,
} from "@/states/productListState";
import { axiosInstance, searchProductList } from "@/utils";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import logoImage from "/logo/logo2.svg";

const HeaderContainer = styled(AppBar)`
	background: rgba(40, 40, 44, 0.8);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	width: 100%;
	align-items: center;
`;

const HeaderWrapper = styled(Toolbar)`
	width: 1440px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 0 20px;
`;

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

const SearchBar = styled(TextField)`
	& .MuiOutlinedInput-root {
		width: 700px; // 너비
		border-radius: 100px; // 둥근 모서리
		background-color: ${Common.colors.white}; // 배경색
		&.Mui-focused fieldset {
			border-color: ${Common.colors.emphasize}; // 포커스 시 테두리 색상
		}
	}

	& .MuiInputLabel-root {
		// 레이블 기본 스타일
	}

	& .MuiInputLabel-root.Mui-focused {
		color: ${Common.colors.primary}; // 포커스 시 레이블 색상 변경
		// background-color: ${Common.colors.white}; // 배경색
	}

	& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-color: ${Common.colors.emphasize}; // 포커스 시 테두리 색상 변경
	}

	& .MuiIconButton-root {
		margin-right: -8px; // 아이콘 버튼 왼쪽 여백
		padding: 2px; // 아이콘 버튼 패딩
		background-color: ${Common.colors.emphasize}; // 아이콘 배경색
		color: ${Common.colors.white}; // 아이콘 색상
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;

const UploadButton = styled(Button)`
	color: ${Common.colors.white};
	background-color: transparent;
	border-radius: 10px;
	border: 1px solid ${Common.colors.emphasize};

	&:hover {
		background-color: ${Common.colors.black};
	}

	.MuiButton-startIcon {
		margin-right: ${Common.space.spacingMd};
		color: ${Common.colors.primary};
	}
`;

const NotificationButton = styled(IconButton)`
	color: ${Common.colors.white};

	& > .MuiBadge-root :hover {
		color: ${Common.colors.emphasize};
	}
`;

const UserButton = styled(Button)`
	color: ${Common.colors.white};
	&:hover {
		color: ${Common.colors.emphasize};
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
		<HeaderContainer position="static" color="default" elevation={1}>
			<HeaderWrapper>
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
				<SearchBar
					size="small"
					variant="outlined"
					placeholder="검색어를 입력하세요"
					label="검색"
					onKeyDown={(e) =>
						handleEnterKeyPress(e as KeyboardEvent<HTMLInputElement>)
					}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton>
									<Search />
								</IconButton>
							</InputAdornment>
						),
					}}
					sx={{ m: 2 }}
				/>
				{loggedIn && (
					<ButtonWrapper>
						<UploadButton
							startIcon={<FileUpload />}
							variant="outlined"
							color="inherit"
							href="/productregistration"
						>
							업로드
						</UploadButton>

						<NotificationButton onClick={handleNotificationsMenuOpen}>
							<Badge badgeContent={1}>
								<Notifications />
							</Badge>
						</NotificationButton>
						<Menu
							anchorEl={notificationAnchorEl}
							open={Boolean(notificationAnchorEl)}
							onClose={handleMenuClose}
						>
							{/* Notification items can be mapped here */}
							<MenuItem onClick={handleMenuClose}>알림1</MenuItem>
						</Menu>

						<UserButton color="inherit" onClick={handleProfileMenuOpen}>
							<AccountCircle />
						</UserButton>
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
					</ButtonWrapper>
				)}
				{!loggedIn && (
					<ButtonWrapper>
						<UserButton onClick={handleProfileMenuOpen}>
							<AccountCircle />
						</UserButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem component={Link} to="/signin" onClick={handleMenuClose}>
								회원가입 / 로그인
							</MenuItem>
						</Menu>
					</ButtonWrapper>
				)}
			</HeaderWrapper>
		</HeaderContainer>
	);
};

export default Header;

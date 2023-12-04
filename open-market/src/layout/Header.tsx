import { useState } from "react";
import styled from "@emotion/styled";
import {
	AppBar,
	Toolbar,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	InputAdornment,
	Badge,
	Button,
	CircularProgress,
} from "@mui/material";
import {
	AccountCircle,
	Notifications,
	Search,
	FileUpload,
	ExitToApp,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loggedInState } from "../states/authState";
import toast from "react-hot-toast";
import logoImage from "../../public/logo/logo2.svg"; // 로고 이미지를 import 합니다.

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

	const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [notificationAnchorEl, setNotificationAnchorEl] =
		useState<null | HTMLElement>(null);

	// 로고 이미지 로딩 완료 시 핸들러
	const onLogoLoad = () => {
		setIsLogoLoaded(true);
	};

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		const currentTarget = event.currentTarget;
		if (currentTarget && document.body.contains(currentTarget)) {
			setAnchorEl(currentTarget);
		}
	};

	const handleNotificationsMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
	) => {
		setNotificationAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setNotificationAnchorEl(null);
	};

	const handleLogout = () => {
		// 토큰 제거 및 상태 업데이트
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("_id");
		setLoggedIn(false);

		// 로그인 페이지로 리디렉션
		toast.success(`로그아웃 되었습니다.`);
		navigate("/");
	};

	return (
		<AppBar position="static" color="default" elevation={1}>
			<Toolbar>
				<Logo>
					<Link to="/">
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

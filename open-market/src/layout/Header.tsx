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

const StyledHeader = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 2rem;
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const SearchForm = styled.form`
	display: flex;
	align-items: center;
	flex-grow: 1;
	input {
		flex-grow: 1;
		padding: 0.5rem 1rem;
		border: 1px solid #ddd;
		border-radius: 20px;
		margin-right: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		border: none;
		border-radius: 20px;
		color: white;
		cursor: pointer;

		&:hover {
			background-color: #0056b3;
		}
	}
`;

const ActionGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 1rem;
`;

const UploadButton = styled(Link)`
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	background-color: #28a745;
	border: none;
	border-radius: 20px;
	color: white;
	cursor: pointer;

	svg {
		margin-right: 0.5rem;
	}

	&:hover {
		background-color: #1e7e34;
	}
`;

const LoginButton = styled(Link)`
	padding: 0.5rem 1rem;
	background-color: #6c757d;
	border: none;
	border-radius: 20px;
	color: white;
	cursor: pointer;

	&:hover {
		background-color: #5a6268;
	}
`;

const MyPageButton = styled(Link)`
	padding: 0.5rem 1rem;
	background-color: #6c757d;
	border: none;
	border-radius: 20px;
	color: white;
	cursor: pointer;

	&:hover {
		background-color: #5a6268;
	}
`;

const LogoutButton = styled.button`
	border: none;
	color: #ffb258;
	cursor: pointer;
	background-color: transparent;

	&:hover {
		color: #bd2130;
	}
`;

const Header = () => {
	const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [notificationAnchorEl, setNotificationAnchorEl] =
		useState<null | HTMLElement>(null);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
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
						<img src="public/logo/logo2.svg" alt="모디 로고" />
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
						<IconButton
							color="inherit"
							component={Link}
							to="/productregistration"
						>
							<FileUpload />
							업로드
						</IconButton>

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

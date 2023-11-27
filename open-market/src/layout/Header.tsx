import styled from "@emotion/styled";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Link } from "react-router-dom";

const StyledHeader = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 2rem;
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
	font-size: 1.5rem;
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

const Header = () => {
	return (
		<StyledHeader>
			<Logo>
				<Link to="/">
					<img src="/logo.png" alt="모디 로고" />
				</Link>
			</Logo>
			<SearchForm action="">
				<input type="text" placeholder="검색어를 입력하세요" />
				<button type="submit">검색</button>
			</SearchForm>
			<ActionGroup>
				<UploadButton to="/productregistration">
					<FileUploadIcon fontSize="small" />
					업로드
				</UploadButton>
				<LoginButton to="/signin">로그인 / 회원가입</LoginButton>
			</ActionGroup>
		</StyledHeader>
	);
};

export default Header;

import React from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const Header = () => {
	return (
		<header>
			<h1>
				<a href="">
					<img src="" alt="모디 로고" />
				</a>
			</h1>
			<form action="">
				<input type="text" placeholder="검색어를 입력하세요" />
				<button type="submit">검색</button>
			</form>
			<button>
				<FileUploadIcon />
				업로드
			</button>
			<button>로그인 / 회원가입</button>
		</header>
	);
};

export default Header;

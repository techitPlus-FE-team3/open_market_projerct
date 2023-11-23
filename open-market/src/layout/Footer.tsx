/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Link } from "react-router-dom";

// Footer 스타일 정의
const FooterContainer = styled.footer`
	padding: 20px;
	background-color: #f8f9fa;
	text-align: center;
	font-size: 0.8rem;
`;

const FooterLink = styled(Link)`
	margin: 0 10px;
	color: #007bff;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const Footer = () => {
	return (
		<FooterContainer>
			<div>© 2023 모두의 오디오 : 모디. All rights reserved.</div>
			<nav>
				<FooterLink to="/about">회사 정보</FooterLink>
				<FooterLink to="/terms">이용 약관</FooterLink>
				<FooterLink to="/privacy">개인정보 처리방침</FooterLink>
				<FooterLink to="/contact">고객 지원</FooterLink>
			</nav>
			<div>
				소셜 미디어:
				<FooterLink to="/facebook">Facebook</FooterLink>
				<FooterLink to="/instagram">Instagram</FooterLink>
				<FooterLink to="/twitter">Twitter</FooterLink>
				<FooterLink to="/youtube">YouTube</FooterLink>
			</div>
		</FooterContainer>
	);
};

export default Footer;

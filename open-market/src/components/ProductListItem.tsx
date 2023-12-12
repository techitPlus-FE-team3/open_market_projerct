import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import MusicPlayer from "./listMusicPlayer/MusicPlayer";

const theme = createTheme({
	palette: {
		primary: { main: "#FFB258" },
		secondary: { main: "#D9D9D9" },
	},
});

const ListItem = styled("li")`
	width: 1140px;
	height: 64px;
	padding: 5px 30px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: 30px;
	border-radius: 10px;
	background-color: ${Common.colors.white};

	.bookmark {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 2px;
		background-color: transparent;
		border: none;

		span {
			position: relative;
			top: 1px;
		}
	}
`;

const StyledLink = styled(Link)`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: 30px;

	img {
		width: 42px;
		height: 42px;
		border-radius: 50%;
	}

	span {
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

function ProductListItem({
	_id,
	image,
	title,
	soundFile,
	bookmarked,
}: {
	_id: number;
	image: string;
	title: string;
	soundFile: string;
	bookmarked: boolean;
}) {
	return (
		<ListItem key={String(_id)}>
			<StyledLink to={`/productdetail/${_id}`}>
				<img src={image} alt={`${title} 사진`} />
				<span title={title}>{title}</span>
			</StyledLink>
			<MusicPlayer src={soundFile} />
			<button type="submit" className="bookmark">
				<ThemeProvider theme={theme}>
					{bookmarked ? (
						<BookmarkIcon color="primary" />
					) : (
						<BookmarkBorderIcon color="secondary" />
					)}
				</ThemeProvider>
				<span>북마크</span>
			</button>
		</ListItem>
	);
}

export default ProductListItem;

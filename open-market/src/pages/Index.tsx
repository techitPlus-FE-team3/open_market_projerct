import { Link } from "react-router-dom";

function Index() {
	return (
		<main>
			<img src="/vite.svg" alt="hero" />
			<input type="text" />
			<div className="sortButtonWrapper">
				<button type="submit">인기순</button>
				<button type="submit">최신순</button>
			</div>
			<ol className="musicList">
				<li className="musicItem">
					<Link to="/">
						<img src="/vite.svg" alt="음원 사진" />
						<span>타이틀</span>
					</Link>
					<audio src="/" controls="controls" />
					<button type="submit">북마크</button>
				</li>
				<li className="musicItem">
					<Link to="/">
						<img src="/vite.svg" alt="음원 사진" />
						<span>타이틀</span>
					</Link>
					<audio src="/" controls="controls" />
					<button type="submit">북마크</button>
				</li>
				<li className="musicItem">
					<Link to="/">
						<img src="/vite.svg" alt="음원 사진" />
						<span>타이틀</span>
					</Link>
					<audio src="/" controls="controls" />
					<button type="submit">북마크</button>
				</li>
			</ol>
			<button type="submit">더보기</button>
		</main>
	);
}

export default Index;

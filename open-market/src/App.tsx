import { Helmet } from "react-helmet-async";
import { RecoilRoot } from "recoil";

function App() {
	return (
		<RecoilRoot>
			<div className="App">
				<Helmet>
					<title>모두의 오디오 : 모디</title>
				</Helmet>
			</div>
		</RecoilRoot>
	);
}

export default App;

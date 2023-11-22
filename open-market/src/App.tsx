import { Helmet, HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RecoilRoot } from "recoil";
function App() {
	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	return (
		<HelmetProvider context={helmetContext}>
			<RecoilRoot>
				<div className="App">
					<Helmet>
						<title>모두의 오디오 : 모디</title>
					</Helmet>
				</div>
			</RecoilRoot>
		</HelmetProvider>
	);
}

export default App;

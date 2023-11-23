import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import router from "./routes";
function App() {
	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	return (
		<HelmetProvider context={helmetContext}>
			<RecoilRoot>
				<RouterProvider router={router} />
			</RecoilRoot>
		</HelmetProvider>
	);
}

export default App;

import { Global, css } from "@emotion/react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import router from "./routes";
import { Common } from "./styles/common";

function App() {
	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	return (
		<HelmetProvider context={helmetContext}>
			<RecoilRoot>
				<Global
					styles={css`
						${Common.reset}
					`}
				/>
				<RouterProvider router={router} />
			</RecoilRoot>
		</HelmetProvider>
	);
}

export default App;

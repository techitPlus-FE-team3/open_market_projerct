import { Global, css } from "@emotion/react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import router from "./routes";
import { Common } from "./styles/common";

import { QueryClient, QueryClientProvider } from "react-query"; // 추가

const queryClient = new QueryClient(); // 추가

function App() {
	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
}

export default App;

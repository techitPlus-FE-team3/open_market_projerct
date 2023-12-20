import { Global, css } from "@emotion/react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Common } from "./styles/common";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<HelmetProvider context={helmetContext}>
				<Global
					styles={css`
						${Common.reset}
					`}
				/>
				<RouterProvider router={router} />
			</HelmetProvider>
		</QueryClientProvider>
	);
}

export default App;

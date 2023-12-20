import { Global, css } from "@emotion/react";
import { useEffect } from "react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import router from "./routes";
import { Common } from "./styles/common";

import { loggedInState } from "@/states/authState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	const setLoggedIn = useSetRecoilState(loggedInState);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		setLoggedIn(!!token);
	}, [setLoggedIn]);

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
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

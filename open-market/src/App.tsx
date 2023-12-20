import { Global, css } from "@emotion/react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Common } from "./styles/common";

import { codeState } from "@/states/categoryState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { axiosInstance } from "./utils";

const queryClient = new QueryClient();

function App() {
	const setCode = useSetRecoilState(codeState);

	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await axiosInstance.get(`/codes/productCategory`);
				const responseData = response.data.item;
				const categoryCodeList = responseData.productCategory.codes;
				setCode(categoryCodeList);
			} catch (error) {
				console.error("상품 리스트 조회 실패:", error);
			}
		})();
	});
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

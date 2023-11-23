import RootLayout from "@/layout/RootLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
// import ProductRegistration from "@/pages/ProductRegistration";
import SignUp from "@/pages/SignUp";
import Detail from "@/pages/Detail";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Index />} />
			<Route path="login" element={<Login />} />
			{/* <Route path="registration" element={<ProductRegistration />} /> */}
			<Route path="signup" element={<SignUp />} />
			<Route path="detail" element={<Detail />} />
		</Route>,
	),
);

export default router;

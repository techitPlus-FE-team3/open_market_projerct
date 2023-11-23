import RootLayout from "@/layout/RootLayout";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import ProductRegistration from "@/pages/ProductRegistration";
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
			<Route path="signin" element={<SignIn />} />
			<Route path="registration" element={<ProductRegistration />} />
			<Route path="signup" element={<SignUp />} />
			<Route path="detail" element={<Detail />} />
		</Route>,
	),
);

export default router;

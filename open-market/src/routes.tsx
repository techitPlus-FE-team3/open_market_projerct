import RootLayout from "@/layout/RootLayout";
import Index from "@/pages/Index";
import ProductRegistration from "@/pages/ProductRegistration";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import UserUpdate from "./pages/UserUpdate";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Index />} />
			<Route path="signin" element={<SignIn />} />
			<Route path="registration" element={<ProductRegistration />} />
			<Route path="signup" element={<SignUp />} />
			<Route path="userUpdate" element={<UserUpdate />} />
		</Route>,
	),
);

export default router;

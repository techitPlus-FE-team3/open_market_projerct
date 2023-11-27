import RootLayout from "@/layout/RootLayout";
import Detail from "@/pages/Detail";
import Index from "@/pages/Index";
import MyPage from "@/pages/MyPage";
import ProductEdit from "@/pages/ProductEdit";
import ProductManage from "@/pages/ProductManage";
import ProductRegistration from "@/pages/ProductRegistration";
import Purchase from "@/pages/Purchase";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import UserOrders from "@/pages/UserOrders";
import UserUpdate from "@/pages/UserUpdate";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import UserProducts from "./pages/UserProducts";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Index />} />
			<Route path="signin" element={<SignIn />} />
			<Route path="registration" element={<ProductRegistration />} />
			<Route path="signup" element={<SignUp />} />
			<Route path="edit/:productId" element={<ProductEdit />} />
			<Route path="detail" element={<Detail />} />
			<Route path="mypage" element={<MyPage />} />
			<Route path="update/userId" element={<UserUpdate />} />
			<Route path="productpurchase/:productId" element={<Purchase />} />
			<Route path="productmanage/:productId" element={<ProductManage />} />
			<Route path="user/userId/products" element={<UserProducts />} />
			<Route path="user/userId/orders" element={<UserOrders />} />
		</Route>,
	),
);

export default router;

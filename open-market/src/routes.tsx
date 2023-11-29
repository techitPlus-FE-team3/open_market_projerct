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
import UserProducts from "@/pages/UserProducts";
import UserUpdate from "@/pages/UserUpdate";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Index />} />
			{/* sell */}
			<Route path="productregistration" element={<ProductRegistration />} />
			<Route path="productedit/:productId" element={<ProductEdit />} />
			<Route path="productmanage/:productId" element={<ProductManage />} />
			{/* buy */}
			<Route path="products" element={<Detail />} />
			<Route path="productpurchase" element={<Purchase />} />
			{/* user */}
			<Route path="mypage" element={<MyPage />} />
			<Route path="update/userId" element={<UserUpdate />} />
			<Route path="user/userId/products" element={<UserProducts />} />
			<Route path="/orders" element={<UserOrders />} />
			{/* signin, signup */}
			<Route path="signin" element={<SignIn />} />
			<Route path="signup" element={<SignUp />} />
		</Route>,
	),
);

export default router;

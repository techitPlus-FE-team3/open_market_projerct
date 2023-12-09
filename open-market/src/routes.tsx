import RootLayout from "@/layout/RootLayout";
import ProductDetail from "@/pages/product/ProductDetail";
import Index from "@/pages/Index";
import MyPage from "@/pages/user/MyPage";
import ProductEdit from "@/pages/product/ProductEdit";
import ProductManage from "@/pages/product/ProductManage";
import ProductRegistration from "@/pages/product/ProductRegistration";
import ProductPurchase from "@/pages/product/ProductPurchase1";
import SignIn from "@/pages/user/SignIn";
import SignUp from "@/pages/user/SignUp";
import UserOrders from "@/pages/user/UserOrders";
import UserProducts from "@/pages/user/UserProducts";
import UserEdit from "@/pages/user/UserEdit";
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
			<Route path="productdetail/:productId" element={<ProductDetail />} />
			<Route path="productpurchase/:productId" element={<ProductPurchase />} />
			{/* user */}
			<Route path="mypage" element={<MyPage />} />
			<Route path="useredit/:userId" element={<UserEdit />} />
			<Route path="user/:userId/products" element={<UserProducts />} />
			<Route path="/orders" element={<UserOrders />} />
			{/* signin, signup */}
			<Route path="signin" element={<SignIn />} />
			<Route path="signup" element={<SignUp />} />
		</Route>,
	),
);

export default router;

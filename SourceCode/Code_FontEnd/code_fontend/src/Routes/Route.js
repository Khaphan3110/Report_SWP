import React from "react";
import {ProtectStaff,ProtectStaffRole} from "../Components/Amind/ProtectStaff/ProtectStaff";
import { ProtectUser } from "../Components/User/ProtectUser/ProtectUser";


const Categories = React.lazy(() => import("../Components/Amind/Categories/Categories")) ;
const Product = React.lazy(() => import("../Components/Amind/Products/Product"));
const AccountPage = React.lazy(() => import("../Components/User/AccountPage/AccountPage"));
const AddressPage = React.lazy(() => import("../Components/User/AddressPage/AddressPage"));
const AuthenEmail = React.lazy(() => import("../Components/User/Authen/AuthenEmail"));
const CartPage = React.lazy(() => import("../Components/User/CartPage/CartPage"));
const CartProductPage = React.lazy(() => import("../Components/User/CartProducts/CarProductProcess"));
const CheckoutPage = React.lazy(() => import("../Components/User/CheckoutPage/CheckoutPage"));
const Content = React.lazy(() => import("../Components/User/Content/Content"));
const ForgotPasswordForm = React.lazy(() => import("../Components/User/ForgotPassword/ForgotPasswordForm"));
const SendEmailForm = React.lazy(() => import("../Components/User/ForgotPassword/SendEmailForm"));
const LoginForm = React.lazy(() => import("../Components/User/Login/LoginForm"));
const Logout = React.lazy(() => import("../Components/User/Logout/Logout"));
const PaymentPage = React.lazy(() => import("../Components/User/PaymentPage/PaymentPage"));
const RegisterForm = React.lazy(() => import("../Components/User/Register/RegisterForm"));
const RouteAdminLayout = React.lazy(() => import("../Layouts/AdminLayout/RouteAdminLayout"));
const DashBoardAdmin = React.lazy(() => import("../Components/Amind/DashBoardAdmin/DashBoardAdmin"));
const PreorderAdmin = React.lazy(() => import("../Components/Amind/PreorderManager/PreorderManager"));
const SettingAdmin = React.lazy(() => import("../Components/Amind/SettingAdmin/SettingAdmin"));
const Success = React.lazy(() => import("../Components/User/SuccessOrNot/Success/Success"))
const NotSuccess = React.lazy(() => import("../Components/User/SuccessOrNot/NotSuccess/NotSuccess"))
const Refun = React.lazy(() => (import("../Components/User/Refun/Refun")))
const Polyci = React.lazy(() => (import("../Components/User/polyci/ProcessOrder")))
const Payment = React.lazy(() => (import("../Components/User/Payment/PaymentInfor")))
const LoginAdmin = React.lazy(() => import("../Components/Amind/LoginRegisterAdmin/LoginRegisterAdmin"))
const SendEmailForgotAdmin = React.lazy(() => (import("../Components/Amind/SendEmailForgotAdmin/SendEmailForgotAdmin")))
const ResetPassWordAdmin = React.lazy(() => (import("../Components/Amind/ResetPasswordadmin/ResetPasswordadmin")))
const AuthenRegisterAdmin = React.lazy(() => (import("../Components/Amind/AuthenRegister/AuthenRegister")))
const SearchFilterProduct = React.lazy(() => (import("../Components/User/SearchFilterProduct/SearchFilterProduct")))
const ProductDetail = React.lazy(() => (import("../Components/User/ProductDetail/ProductDetail")))
const LogoutAdmin = React.lazy(() => (import("../Components/Amind/LogoutAdmin/LogoutAdmin")))
const StaffManager = React.lazy(() => (import("../Components/Amind/StaffManager/StaffManager")))
const MemberManager = React.lazy(() => (import("../Components/Amind/MemberManager/MemberManager")))
const OrderManager = React.lazy(() => (import("../Components/Amind/OrderManager/OrderManager")))
const PromotionManager = React.lazy(() => (import("../Components/Amind/ManagerPromotion/Promotion")))

const OrderDetail = React.lazy(() => (import("../Components/User/OrderDetail/OrderDetail")))
const OrderUser = React.lazy(() => (import("../Components/User/OrderUser/OrderUser")))
const BlogManagement = React.lazy(() => import("../Components/Amind/BlogManagement/BlogManagement"))
const Blog = React.lazy(() => (import("../Components/User/Blog/Blog")))


//SettingAdmin
// <Route path="/" element={<HomePage />} />
//         <Route path="/Header" element={<Header />} /> 
//         <Route path="/Footer" element={<Footer />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/account" element={<AccountPage />} />
//         <Route path="/addresses" element={<AddressPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/Content" element={<Content />} />
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/authenOTP" element={<AuthenEmail />} />
//         <Route path="/sendEmailForgot" element={<SendEmailForm />} />
//         <Route path="/ForgotPassword" element={<ForgotPasswordForm />} /> 
//         <Route path="/CategoriesType" element={<ImportCategories/>} />
const publicRoutes = [
  { path: "/", component: CartProductPage },
  { path: "/seachproduct/:search", component: SearchFilterProduct,layout:"user" },
  { path: "/productDetail/:productID", component: ProductDetail,layout:"user" },
  { path: "/authenRegisterAdmin", component: AuthenRegisterAdmin,layout:"loginOnly" },
  { path: "/resetpasswordAdmin", component: ResetPassWordAdmin,layout:"loginOnly" },
  { path: "/sendEmailForgotAdmin", component: SendEmailForgotAdmin,layout:"loginOnly" },
  { path: "/login", component: LoginForm ,layout:"user"},
  { path: "/loginadmin", component: LoginAdmin,layout:"loginOnly"},
  { path: "/logout", component: Logout ,layout:"user"},
  { path: "/payment-policy", component: Payment ,layout:"user"},
  { path: "/policy", component: Polyci ,layout:"user"},
  { path: "/refun", component: Refun ,layout:"user"},
  { path: "/register", component: RegisterForm ,layout:"user"},
  { path: "/authenOTP", component: AuthenEmail ,layout:"user"},
  { path: "/sendEmailForgot", component: SendEmailForm ,layout:"user"},
  { path: "/forgotPassword", component: ForgotPasswordForm ,layout:"user"},
  { path: "/logoutAdmin", component: LogoutAdmin},
  { path: "/blog", component: Blog,layout:"user"},
  // { path: "/orderDetail/:orderID", component: OrderDetail},
  // { path: "/order", component: OrderUser},
  // { path: "/payment/success", component: Success ,Userlayout:"user"},



  
  // { path: "/payment/success", component: Success ,layout:"user"},

  // { path: "/payment/notsuccess", component: NotSuccess ,layout:"user"},
  // { path: "/checkout", component: CheckoutPage ,layout:"user"},
  // { path: "/payment", component: PaymentPage ,layout:"user"},
  // { path: "/addresses", component: AddressPage ,layout:"user"},
  // { path: "/account", component: AccountPage ,layout:"user"},
  // { path: "/cart", component: CartPage ,layout:"user"},
  // { path: "/content", component: Content ,layout:"user"},
  
];
const privateRoutes = [
  { path: "/payment/success", component: Success ,layout:"user",protect:ProtectUser},
  { path: "/payment/notsuccess", component: NotSuccess ,layout:"user",protect:ProtectUser},
  { path: "/checkout/:action", component: CheckoutPage ,layout:"user",protect:ProtectUser},
  { path: "/payment/:actionPayment", component: PaymentPage ,layout:"user",protect:ProtectUser},
  { path: "/addresses", component: AddressPage ,layout:"user",protect:ProtectUser},
  { path: "/account", component: AccountPage ,layout:"user",protect:ProtectUser},
  { path: "/cart", component: CartPage ,layout:"user",protect:ProtectUser},
  { path: "/content", component: Content ,layout:"user",protect:ProtectUser},
  { path: "/admin", component: DashBoardAdmin ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin']},
  { path: "/admin/categories", component: Categories ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin','staffmember'] },
  { path: "/admin/product", component: Product ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin','staffmember']},
  { path: "/admin/settingadmin", component: SettingAdmin ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin']},
  { path: "/admin/preorderadmin", component: PreorderAdmin ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin','staffmember']},
  { path: "/admin/memberManager", component: MemberManager ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin','staffmember']},
  { path: "/admin/ordermanager", component: OrderManager ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin','staffmember']},
  { path: "/admin/staffmanager", component: StaffManager ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin']},
  { path: "/admin/promotion", component: PromotionManager ,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin']},
  { path: "/orderDetail/:orderID", component: OrderDetail,layout:"user",protect:ProtectUser},
  { path: "/order", component: OrderUser,layout:"user",protect:ProtectUser},
  { path: "/admin/blog", component: BlogManagement,layout:"admin",protect:ProtectStaff,allowedRoles:['staffadmin','staffmember']},
  // { path: "/sideBar", component: SideBarAdmin },SettingAdmin/PromotionManager BlogManagement
];

export { privateRoutes, publicRoutes };


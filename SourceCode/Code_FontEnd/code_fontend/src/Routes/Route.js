import React from "react";



const Categories = React.lazy(() => import("../Components/Amind/Categories/Categories")) ;
const Product = React.lazy(() => import("../Components/Amind/Products/Product"));
const AccountPage = React.lazy(() => import("../Components/User/AccountPage/AccountPage"));
const AddressPage = React.lazy(() => import("../Components/User/AddressPage/AddressPage"));
const AuthenEmail = React.lazy(() => import("../Components/User/Authen/AuthenEmail"));
const CartPage = React.lazy(() => import("../Components/User/CartPage/CartPage"));
const CartProductPage = React.lazy(() => import("../Components/User/CartProducts/CartProducts"));
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
const PreorderAdmin = React.lazy(() => import("../Components/Amind/PreorderAdmin/PreorderAdmin"));
const SettingAdmin = React.lazy(() => import("../Components/Amind/SettingAdmin/SettingAdmin"));

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
  { path: "/login", component: LoginForm ,layout:"user"},
  { path: "/logout", component: Logout ,layout:"user"},
  { path: "/register", component: RegisterForm ,layout:"user"},
  { path: "/authenOTP", component: AuthenEmail ,layout:"user"},
  { path: "/sendEmailForgot", component: SendEmailForm ,layout:"user"},
  { path: "/forgotPassword", component: ForgotPasswordForm ,layout:"user"},
  
];
const privateRoutes = [
  { path: "/checkout", component: CheckoutPage ,layout:"user",protect:"user"},
  { path: "/payment", component: PaymentPage ,layout:"user",protect:"user"},
  { path: "/addresses", component: AddressPage ,layout:"user",protect:"user"},
  { path: "/account", component: AccountPage ,layout:"user",protect:"user"},
  { path: "/cart", component: CartPage ,layout:"user",protect:"user"},
  { path: "/content", component: Content ,layout:"user",protect:"user"},
  { path: "/admin", component: DashBoardAdmin ,layout:"admin",protect:"admin"},
  { path: "/admin/categories", component: Categories ,layout:"admin",protect:"admin" },
  { path: "/admin/product", component: Product ,layout:"admin",protect:"admin"},
  { path: "/admin/settingadmin", component: SettingAdmin ,layout:"admin",protect:"admin"},
  { path: "/admin/preorderadmin", component: PreorderAdmin ,layout:"admin",protect:"admin"},
  // { path: "/sideBar", component: SideBarAdmin },
];

export { privateRoutes, publicRoutes };


import Categories from "../Components/Amind/Categories/Categories";
import AccountPage from "../Components/User/AccountPage/AccountPage";
import AddressPage from "../Components/User/AddressPage/AddressPage";
import AuthenEmail from "../Components/User/Authen/AuthenEmail";
import CartPage from "../Components/User/CartPage/CartPage";
import Content from "../Components/User/Content/Content";
import ForgotPasswordForm from "../Components/User/ForgotPassword/ForgotPasswordForm";
import SendEmailForm from "../Components/User/ForgotPassword/SendEmailForm";
import LoginForm from "../Components/User/Login/LoginForm";
import Logout from "../Components/User/Logout/Logout";
import RegisterForm from "../Components/User/Register/RegisterForm";
import RouteAdminLayout from "../Layouts/AdminLayout/RouteAdminLayout";
import HomePage from "../Pages/HomePage/HomePage";
import CheckoutPage from "../Components/User/CheckoutPage/CheckoutPage";
import PaymentPage from "../Components/User/PaymentPage/PaymentPage";
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
  { path: "/", component: HomePage },
  { path: "/login", component: LoginForm },
  { path: "/logout", component: Logout },
  { path: "/register", component: RegisterForm },
  { path: "/authenOTP", component: AuthenEmail },
  { path: "/sendEmailForgot", component: SendEmailForm },
  { path: "/forgotPassword", component: ForgotPasswordForm },
  { path: "/checkout", component: CheckoutPage },
  { path: "/payment", component: PaymentPage },
  { path: "/authenOTP", component: AuthenEmail },
  { path: "/addresses", component: AddressPage },
  { path: "/cart", component: CartPage },
  { path: "/content", component: Content },
];
const privateRoutes = [
  { path: "/admin", component: RouteAdminLayout },
  { path: "/categories", component: Categories },
  // { path: "/sideBar", component: SideBarAdmin },
];

export { privateRoutes, publicRoutes };


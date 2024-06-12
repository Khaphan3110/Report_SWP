import { Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import Footer from "./Components/Footer/Footer";
import ForgotPasswordForm from "./Components/ForgotPassword/ForgotPasswordForm";
import SendEmailForm from "./Components/ForgotPassword/SendEmailForm";
import HomePage from "./Components/HomePage/HomePage";
import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Register/RegisterForm";
import Header from "./Components/Header/Header";
import AuthenEmail from "./Components/Authen/AuthenEmail";
import Content from "./Components/Content/Content";
import AccountPage from "./Components/AccountPage/AccountPage";
import AddressPage from "./Components/AddressPage/AddressPage";
import CartPage from "./Components/CartPage/CartPage";
import ResetPasswordPage from "./Components/ForgotPassword/ResetPasswordPage";
import CheckoutPage from "./Components/CheckoutPage/CheckoutPage";
import PaymentPage from "./Components/PaymentPage/PaymentPage";
=======
import RouteAdminLayout from "./Layouts/AdminLayout/RouteAdminLayout";
import RouteUserLayout from "./Layouts/UserLayouts/RouteUserLayout";
import LoginForm from "./Components/User/Login/LoginForm";
import Header from "./Components/User/Header/Header";
import Footer from "./Components/User/Footer/Footer";
import AccountPage from "./Components/User/AccountPage/AccountPage";
import AddressPage from "./Components/User/AddressPage/AddressPage";
import CartPage from "./Components/User/CartPage/CartPage";
import Content from "./Components/User/Content/Content";
import RegisterForm from "./Components/User/Register/RegisterForm";
import AuthenEmail from "./Components/User/Authen/AuthenEmail";
import SendEmailForm from "./Components/User/ForgotPassword/SendEmailForm";
import ForgotPasswordForm from "./Components/User/ForgotPassword/ForgotPasswordForm";

>>>>>>> 4fffd67ee0402449809fba2b15bd168b204aa625
function App() {
  return (
    <>
      {/* <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/addresses" element={<AddressPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} /> 
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/Content" element={<Content />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/authenOTP" element={<AuthenEmail />} />
        <Route path="/sendEmailForgot" element={<SendEmailForm />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />
<<<<<<< HEAD
        <Route path="/reset-password/:token/:email" element={<ResetPasswordPage />} />
=======
        <Route path="/CategoriesType" element={<ImportCategories/>} />
        {/* Add the route for ResetPasswordPage */}
      {/* <Route path="/FAQ" element={<FAQ />} /> */}
      {/* </Routes> */}
      {/* <Footer /> */}
      <Routes>
        <Route path="/" element={<RouteUserLayout />}>
          <Route path="/Header" element={<Header />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/addresses" element={<AddressPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/Content" element={<Content />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/authenOTP" element={<AuthenEmail />} />
          <Route path="/sendEmailForgot" element={<SendEmailForm />} />
          <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />
        </Route>

        {/* <Route path="/admin" element={<RouteAdminLayout />}><Route/> */}
        <Route path="/admin" element={<RouteAdminLayout />}>
          <Route path="register" element={<RegisterForm />} />
        </Route>
>>>>>>> 4fffd67ee0402449809fba2b15bd168b204aa625
      </Routes>
    </>
  );
}

export default App;

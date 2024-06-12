import { Route, Routes } from "react-router-dom";
import Footer from "./Components/User/Footer/Footer";
import ForgotPasswordForm from "./Components/User/ForgotPassword/ForgotPasswordForm";
import SendEmailForm from "./Components/User/ForgotPassword/SendEmailForm";
import AccountPage from "./Components/User/AccountPage/AccountPage";
import AddressPage from "./Components/User/AddressPage/AddressPage";
import AuthenEmail from "./Components/User/Authen/AuthenEmail";
import CartPage from "./Components/User/CartPage/CartPage";
import Content from "./Components/User/Content/Content";
import Header from "./Components/User/Header/Header";
import LoginForm from "./Components/User/Login/LoginForm";
import RegisterForm from "./Components/User/Register/RegisterForm";
import RouteAdminLayout from "./Layouts/AdminLayout/RouteAdminLayout";
import RouteUserLayout from "./Layouts/UserLayouts/RouteUserLayout";
import CheckoutPage from "./Components/User/CheckoutPage/CheckoutPage";
import PaymentPage from "./Components/User/PaymentPage/PaymentPage";

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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
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
      </Routes>
    </>
  );
}

export default App;

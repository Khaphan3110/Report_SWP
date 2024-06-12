import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountPage from "../../Components/User/AccountPage/AccountPage";
import AddressPage from "../../Components/User/AddressPage/AddressPage";
import AuthenEmail from "../../Components/User/Authen/AuthenEmail";
import CartPage from "../../Components/User/CartPage/CartPage";
import Content from "../../Components/User/Content/Content";
import Footer from "../../Components/User/Footer/Footer";
import ForgotPasswordForm from "../../Components/User/ForgotPassword/ForgotPasswordForm";
import SendEmailForm from "../../Components/User/ForgotPassword/SendEmailForm";
import Header from "../../Components/User/Header/Header";
import LoginForm from "../../Components/User/Login/LoginForm";
import RegisterForm from "../../Components/User/Register/RegisterForm";

export default function RouteUserLayout() {
  return (
    <>
      <Header />
      <Routes>
        
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
        {/* Add the route for ResetPasswordPage */}
        {/* <Route path="/FAQ" element={<FAQ />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

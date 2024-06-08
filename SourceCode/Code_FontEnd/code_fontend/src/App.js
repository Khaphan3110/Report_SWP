import { Route, Routes } from "react-router-dom";
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
import ResetPasswordPage from "./Components/ForgotPassword/ResetPasswordPage";// Import the ResetPasswordPage component

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
        <Route path="/reset-password/:token/:email" element={<ResetPasswordPage />} />
        {/* <Route path="/FAQ" element={<FAQ />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;

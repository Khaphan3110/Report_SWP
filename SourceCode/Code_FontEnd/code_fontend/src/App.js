import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import ForgotPasswordForm from "./Components/ForgotPassword/ForgotPasswordForm";

import SendEmailForm from "./Components/ForgotPassword/SendEmailForm";
import Header from "./Components/Header/Header";
import HomePage from "./Components/HomePage/HomePage";
import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Register/RegisterForm";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/sendEmailForgot" element={<SendEmailForm />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />
        {/* <Route path="/FAQ" element={<FAQ />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;

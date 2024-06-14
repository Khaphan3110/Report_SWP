import React from "react";
import Header from "../../Components/User/Header/Header";
import Footer from "../../Components/User/Footer/Footer";

export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      { children }
      <Footer />
    </>
  );
}

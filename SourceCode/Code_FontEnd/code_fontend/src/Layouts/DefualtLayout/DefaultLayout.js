import React from "react";
import Header from "../DefualtLayout/Header/Header";
import Footer from "../DefualtLayout/Footer/Footer";

export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      { children }
      <Footer />
    </>
  );
}

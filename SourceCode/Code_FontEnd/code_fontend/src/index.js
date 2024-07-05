import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { StoreProvider } from "./Store";
import CategoriesProvider from "./Store/ContextConfig/CategoriesProvider";
import ProductProvider from "./Store/ContextConfig/ProductProvider";
import UserProvider from "./Store/ContextConfig/UserProvider";
import AdminProvider from "./Store/ContextConfig/AdminProvider";
import StaffManagerProvider from "./Store/ContextConfig/StaffController";
import MemberManagerProvider from "./Store/ContextConfig/MemberController";
import OrderManagerProvider from "./Store/ContextConfig/OrderController";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AdminProvider>
    <OrderManagerProvider>
      <React.StrictMode>
        <CategoriesProvider>
          <ProductProvider>
            <UserProvider>
              <StoreProvider>
                <MemberManagerProvider>
                  <StaffManagerProvider>
                    <BrowserRouter>
                      <App />
                    </BrowserRouter>
                  </StaffManagerProvider>
                </MemberManagerProvider>
              </StoreProvider>
            </UserProvider>
          </ProductProvider>
        </CategoriesProvider>
      </React.StrictMode>
    </OrderManagerProvider>
  </AdminProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

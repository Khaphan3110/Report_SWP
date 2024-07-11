import { Route, Routes } from "react-router-dom";
import RouteAdminLayout from "./Layouts/AdminLayout/RouteAdminLayout";
import DefaultLayout from "./Layouts/DefualtLayout/DefaultLayout";
import { privateRoutes, publicRoutes } from "./Routes/Route";
import React, { Suspense } from "react";
import Loading from "./Components/User/Loading/Loading";
import ProtectUser from "./Components/User/ProtectUser/ProtectUser";
import Success from "./Components/User/SuccessOrNot/Success/Success";
function App() {
  return (
    <>
      {/* <Success></Success> */}
      <Suspense fallback={<Loading />}>
        <Routes>
          {publicRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            if (route.layout === "loginOnly") {
              Layout = null;
            } else if (route.layout === "admin") {
              Layout = RouteAdminLayout;
            }

            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}

          {privateRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            if (route.layout === "user") {
              Layout = DefaultLayout;
            } else {
              Layout = RouteAdminLayout;
            }
            const Protect = route.protect;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Protect  allowedRoles={route.allowedRoles}>
                    <Layout>
                      <Page />
                    </Layout>
                  </Protect>
                }
              />
            );
          })}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

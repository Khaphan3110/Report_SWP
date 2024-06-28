import { Route, Routes } from "react-router-dom";
import RouteAdminLayout from "./Layouts/AdminLayout/RouteAdminLayout";
import DefaultLayout from "./Layouts/DefualtLayout/DefaultLayout";
import { privateRoutes, publicRoutes } from "./Routes/Route";
import { Suspense } from "react";
import Loading from "./Components/User/Loading/Loading";
import ProtectUser from "./Components/User/ProtectUser/ProtectUser";
function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {publicRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
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
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectUser>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectUser>
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

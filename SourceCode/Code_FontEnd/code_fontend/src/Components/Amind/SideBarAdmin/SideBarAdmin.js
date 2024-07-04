import React from "react";
import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
import "./SideBarAdmin.css";
export default function SideBarAdmin() {
  return (
    <ul className="side-navbar-admin">
      <div className="main-link-sidebar-admin">
        <Link to={"/admin"} className="link-sidebar-admin">
          <li className="categories-word">
            <i className="fa-solid fa-chart-simple"></i> Dashboard
          </li>
        </Link>
        <Link to={"/admin/product"} className="link-sidebar-admin">
          <li className="categories-word">
            <i className="fa-brands fa-product-hunt"></i> Product
          </li>
        </Link>
        <Link to={"/admin/categories"} className="link-sidebar-admin">
          <li className="categories-word">
            <i className="fa-solid fa-layer-group"></i> Categories
          </li>
        </Link>
      </div>
      <div className="logout-link-sidebar-admin">
        <Link to={"/logoutAdmin"} className="link-sidebar-admin">
          <li className="categories-word">Logout</li>
        </Link>
      </div>
    </ul>
  );
}

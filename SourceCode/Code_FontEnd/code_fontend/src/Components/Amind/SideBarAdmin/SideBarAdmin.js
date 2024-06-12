import React from "react";
import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
import "./SideBarAdmin.css";
export default function SideBarAdmin() {
  return (
      <ul className="side-navbar-admin">
        <Link to={"/dashboard"}>
          <li className="categories-word">Dashboard</li>
        </Link>
        <Link to={"/categories"}>
          <li className="categories-word">Product</li>
        </Link>
        <Link to={"/categories"}>
          <li className="categories-word">Staff</li>
        </Link>
        <Link to={"/categories"}>
          <li className="categories-word"></li>
        </Link>
      </ul>
  );
}

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Content.css";
import  iconSubmenu  from "../../../assets/images/iconSub.png";

export default function Content() {
  return (
    <section className="image-homepage-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-15  d-xl-block d-none navigation-wrapper">
            <nav className="h-100">
              <ul className="navigation list-group list-group-flush scroll">
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    <img src={iconSubmenu} width={24} height={24}></img>
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
                <li className="menu-item">
                  <a className="menu-item-link" href="#">
                    {/* <img src={iconSubmenu} width={24} height={24}></img> */}
                    <span>Link</span>
                    <i class="fa-solid fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

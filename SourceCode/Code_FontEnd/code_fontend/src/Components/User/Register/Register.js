import React from "react";
import "./Register.css";
import rlogin from "../../assets/images/cow_little.jpg";

export default function Register() {
  return (
    <div>
      <div>
        <h1>Header</h1>
      </div>
      <div className="R-wrap row vh-100 g-0">
        {/* left side */}
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <div
            className="R-picture"
            style={{ backgroundImage: `url(${rlogin})` }}
          ></div>
        </div>
        {/* left side */}

        {/* right side */}
        <div className="R-input col-lg-6 vh-100 g-0">
          <form>
            <h1>Resigter</h1>
            <div className="R_input-place">
              <input type="text" placeholder="Fullname"></input>
              <i class="fa-solid fa-person"></i>
            </div>
            <div className="R_input-place">
              <input type="text" placeholder="Email"></input>
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div className="R_input-place">
              <input type="text" placeholder="User name"></input>
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="R_input-place">
              <input type="password" placeholder="Password"></input>
              <i class="fa-solid fa-eye-slash"></i>
            </div>
            <div className="R_input-place">
              <input type="password" placeholder="Cofirm password"></input>
              <i class="fa-solid fa-eye-slash"></i>
            </div>
            <div className="R-button">
              <button type="submit">
                <p>Register</p>
              </button>
            </div>
            <div className="Return-login">
              <span>Have account? </span>
              <a href="#">Return</a>
            </div>
          </form>
        </div>
        {/* right side */}
      </div>
      <div>
        <h1>Footer</h1>
      </div>
    </div>
  );
}

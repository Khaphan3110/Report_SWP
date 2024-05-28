import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignIn.css";
import logosign from "../../assets/images/cow_little.jpg";

export default function SignIn() {
  return (
    <div>
      <div>
        <h1>Header</h1>
      </div>
      <div className="row vh-100 g-0 ">
        {/* left side */}
        <div className="col-lg-6 position-relative d-none d-lg-block">
          <div
            className="bg-holder"
            style={{ backgroundImage: `url(${logosign})` }}
          ></div>
        </div>
        {/* left side */}
        {/* right sight */}
        <div className="wrapper col-lg-6">
          <form>
            <h1>Login</h1>
            <div className="input-place">
              <input type="text" placeholder="username" required></input>
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="input-place">
              <input type="password" placeholder="password" required></input>
              <i className="fa-solid fa-lock"></i>
            </div>
            <div className="check-link">
              <label>
                <input type="checkbox"></input> <span>Remember</span>
              </label>
              <a href="#">Forgot password</a>
            </div>
            <div className="b-login">
              <button type="submit">
                <p>Login</p>
              </button>
            </div>
            <div className="R-account">
              <span>Don't have an account? </span>
              <a href="#">Register</a>
            </div>
            <hr></hr>
            <div className="L-google">
              <button>
                <p>Login Google</p>
                <i class="fa-brands fa-google"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        <h1>Footer</h1>
      </div>
    </div>
  );
}

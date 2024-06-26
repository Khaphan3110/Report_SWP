import React, { useState } from "react";
import './LoginRegisterAdmin.css';
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";

const LoginRegisterAdmin = () => {
    const [action, setAction] = useState('');

    const registerAdmin = (e) => {
        e.preventDefault();
        setAction('active');
    }

    const loginLink = (e) => {
        e.preventDefault();
        setAction('');
    }

    return (
        <div className={`wrapper-LoginRegisteradmin`}>
        <div className={`wrapper-LoginRegisteradmin-sub ${action}`}>
            <div className="form-box login">
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' required />
                        <FaLock className="icon" />
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" /> Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="registerAdmin-link">
                        <p>Don't have an account? <a href="#" onClick={registerAdmin}>Register</a></p>
                    </div>
                </form>
            </div>
            <div className="form-box registerAdmin">
                <form action="">
                    <h1>Register</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' required />
                        <FaLock className="icon" />
                    </div>
                    <div className="input-box">
                            <input type="password" placeholder='Confirm Password' required />
                            <FaLock className="icon" />
                        </div>
                    <div className="input-box">
                        <input type="email" placeholder='Email' required />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='Phone Number' required />
                        <FaPhone className="icon" />
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" /> I agree to the terms & conditions</label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="registerAdmin-link">
                        <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default LoginRegisterAdmin;

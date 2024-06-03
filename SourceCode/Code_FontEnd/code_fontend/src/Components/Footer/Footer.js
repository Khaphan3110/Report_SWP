// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Hà Nội</h5>
            <p>
              <strong>Showroom:</strong> 21 Phan Chu Trinh - 17 Lý Thường Kiệt,
              phường Phan Chu Trinh, quận Hoàn Kiếm, Hà Nội.
              <br /> Tel: 024 39 335 388 / 0969 96 466
              <br /> Thời gian mở cửa: 8:30 - 21:30 (Kể cả T7, CN)
              <br /> Đặt hàng: 1900 86 6606
              <br /> Email: online@snb.com.vn
            </p>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Giới Thiệu</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">
                  Về Soc&Brothers
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Hướng Dẫn</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Tạo tài khoản
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Chính Sách</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Chính sách đổi trả hàng
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Xử lý đơn hàng
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Bảo mật thông tin
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Chính sách thẻ thành viên
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">FAQ</h5>
            <Link to={"/FQA"} className="text-dark">Các câu hỏi thường gặp khi sử dụng web</Link>
            {/* <form>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form5Example2"
                  className="form-control"
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block mb-4">
                Đăng ký
              </button>
              <div className="g-recaptcha" data-sitekey="your_site_key"></div>
            </form> */}
          </div>
        </div>
      </div>

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <a href="#!" className="text-dark me-4">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#!" className="text-dark me-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#!" className="text-dark me-4">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#!" className="text-dark me-4">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <div className="mt-3">
          © 2017 - Công ty Cổ Phần Thế Giới Tuổi Thơ SNB
          <br /> Địa chỉ: Số 9 Nguyễn Vĩnh Bảo, Phường Yên Hòa, Quận Cầu Giấy,
          Thành phố Hà Nội, Việt Nam.
          <br /> Điện thoại: 024 3933 5399. Mã số thuế: 0102527451 cấp ngày
          16/11/2007, tại Sở KHĐT HN.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

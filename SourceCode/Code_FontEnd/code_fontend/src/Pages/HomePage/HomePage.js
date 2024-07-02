import React, { useEffect, useRef } from "react";
import "./HomePage.css";
import { useCateGories } from "../../Store";

export default function HomePage() {
  const slideshowRef = useRef(null);
  const { listCategories } = useCateGories();
  useEffect(() => {
    const slides = slideshowRef.current.children;
    let currentSlide = 0;
    const totalSlides = slides.length;

    const slideInterval = setInterval(() => {
      slides[currentSlide].style.display = "none";
      currentSlide = (currentSlide + 1) % totalSlides;
      slides[currentSlide].style.display = "block";
    }, 3000); // Thay đổi hình ảnh mỗi 3 giây

    return () => clearInterval(slideInterval);
  }, []);

  return (
    // <div className="homepage-custom">
      <div className="main-content-custom">
        <div className="content-wrapper-custom">
          <div className="navbar-link-header">
            <ul>
            { listCategories ? (
              listCategories.map((cate,index) => (
                <li>
                <img
                  src="https://theme.hstatic.net/1000186075/1000909086/14/menu_icon_1.png?v=4490"
                  alt="icon milk"
                  width={24}
                  height={24}
                ></img> {" "}
                {cate.brandName}
              </li>
              ))
              ) : "danh sách sản phẩm" }
            </ul>
          </div>
          <div className="main-banner-custom">
            <div ref={slideshowRef} className="slideshow-custom">
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/slider_2.jpg?v=4483"
                alt="Slide 1"
              />
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/slider_3.jpg?v=4483"
                alt="Slide 2"
              />
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/slider_4.jpg?v=4483"
                alt="Slide 3"
              />
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/slider_5.jpg?v=4483"
                alt="Slide 4"
              />
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/slider_7.jpg?v=4483"
                alt="Slide 5"
              />
              <img
                src="https://theme.hstatic.net/1000186075/1000909086/14/slider_8.jpg?v=4483"
                alt="Slide 6"
              />
            </div>
          </div>
          <div className="promotions-custom">
            <img
              src="https://theme.hstatic.net/1000186075/1000909086/14/right_banner_1.jpg?v=4483"
              alt="Promotion 1"
            />
            <img
              src="https://theme.hstatic.net/1000186075/1000909086/14/right_banner_2.jpg?v=4483"
              alt="Promotion 2"
            />
          </div>
        </div>
        <div className="additional-images">
          <img
            src="https://theme.hstatic.net/1000186075/1000909086/14/banner_coll_1.jpg?v=4483"
            alt="Promotion 4"
          />
          <img
            src="https://theme.hstatic.net/1000186075/1000909086/14/banner_coll_2.jpg?v=4483"
            alt="Promotion 5"
          />
          <img
            src="https://theme.hstatic.net/1000186075/1000909086/14/banner_coll_3.jpg?v=4483"
            alt="Promotion 6"
          />
        </div>
      </div>
    // </div>
  );
}

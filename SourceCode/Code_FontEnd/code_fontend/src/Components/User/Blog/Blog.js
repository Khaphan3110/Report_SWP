import React from 'react';
import './Blog.css';

const Blog = () => {
    const Article = ({ title, date, image, className }) => (
        <div className={`blog_article ${className}`}>
            <img src={image} alt={title} className="blog_article-image" />
            <div className="blog_article-content">
                <h3 className="blog_article-title">{title}</h3>
                {date && <p className="blog_article-date">{date}</p>}
            </div>
        </div>
    );

    const SideArticle = ({ title, date, image }) => (
        <div className="blog_side-article">
            <img src={image} alt={title} className="blog_side-article-image" />
            <div className="blog_side-article-content">
                <h3 className="blog_side-article-title">{title}</h3>
                {date && <p className="blog_side-article-date">{date}</p>}
            </div>
        </div>
    );

    return (
        <div className="blog_container">
            <div className="blog_main-article">
                <Article 
                    title="Trẻ sơ sinh phải vía - Nhận biết, nguyên nhân và cách xử lý"
                    date="19/09/2023"
                    image="https://file.hstatic.net/1000186075/article/tre-so-sinh-phai-via_e9b48a69800c4ce0b114ae9eb0159cd9_grande.jpg"
                    className="main"
                />
            </div>
            <div className="blog_other-articles">
                <Article 
                    title="5 lưu ý khi chọn đồ bơi cho bé mà ba mẹ không nên bỏ qua"
                    image="https://file.hstatic.net/1000186075/article/chon-do-boi-cho-be_44b7df975ba048d496594cde2a070d14_grande.jpg"
                />
                <Article 
                    title="Cách chăm sóc và giúp bé hồi phục nhanh chóng khi bệnh tay chân miệng"
                    image="https://file.hstatic.net/1000186075/article/cach_cham_soc_va_giup_be_hoi_phuc_nhanh_chong_khi_benh_tay_chan_mieng_b4bd78a82c17426bbb04804767f6bd3c_grande.jpg"
                />
                <Article 
                    title="Nước ép trái cây Pororo có thể giúp bé tăng đề kháng"
                    image="https://file.hstatic.net/1000186075/article/nuoc-ep-tra-cay-pororo_7763e68d5a904725ba1d148eb53144b5_grande.jpg"
                />
            </div>
            <div className="blog_taskbar-container">
                <div className="blog_taskbar blog_taskbar-mom">
                    <div className="blog_taskbar-item">MẸ BẦU</div>
                </div>
                <div className="blog_taskbar blog_taskbar-new">
                    <div className="blog_taskbar-item">TIN MỚI</div>
                </div>
            </div>
            <div className="blog_content">
                <div className="blog_mom">
                    <Article 
                        title="Top 3 loại kem và dầu chống rạn da được nhiều mẹ bầu yêu thích nhất tại Soc&Brothers"
                        date="28/08/2023"
                        image="https://file.hstatic.net/1000186075/article/ran-da__1__22532523ea184f918775d23b9e5ad6e6_master.jpg"
                        className="main"
                    />
                    <div className="blog_mom-side-articles">
                        <SideArticle 
                            title="Chế độ ăn uống giúp sinh con trai, sinh con gái có phải lời đồn?"
                            date="19/04/2023"
                            image="https://file.hstatic.net/1000186075/article/che-do-an-uong-giup-sinh-con-trai-sinh-con-gai-co-phai-loi-don_c1b1288523bd49c4b44ecd7a4f11ba5a_master.jpg"
                        />
                        <SideArticle 
                            title="Chế độ dinh dưỡng cho bà bầu 3 tháng đầu thai kì cần bổ sung những chất gì?"
                            date="28/03/2023"
                            image="https://file.hstatic.net/1000186075/article/g-che-do-dinh-duong-cho-ba-bau-3-thang-dau-thai-ki-can-bo-sung-chat-gi_8e7a2de845024fa4998da8a75cf0bfdd_master.jpg"
                        />
                        <SideArticle 
                            title="Những trái cây mẹ bầu bị tiểu đường thai kỳ vẫn ăn được"
                            date="22/07/2022"
                            image="https://file.hstatic.net/1000186075/article/nhung-trai-cay-me-bau-bi-tieu-duong-thai-ky-van-an-duoc_98ec5a411fd24b0296cffb2bc93775f5_master.jpeg"
                        />
                        <SideArticle 
                            title="Các loại đậu tốt cho bà bầu nên ăn trong thai kỳ để mẹ khỏe bé khỏe"
                            date="18/03/2022"
                            image="https://file.hstatic.net/1000186075/article/cac-loai-dau-tot-cho-ba-bau_d2c2ea3c48024750b6aab0514e5a9b39_master.png"
                        />
                    </div>
                </div>
                <div className="blog_new-articles">
                    <div className="blog_new-articles-row">
                        <Article 
                            title="Tổng hợp những câu hỏi khi sử dụng bình sữa Betta"
                            image="https://file.hstatic.net/1000186075/article/tong-hop-nhung-cau-hoi-khi-su-dung-binh-sua-betta-4_d8d0e0f87364489fbb0f64a756a5243d_master.jpg"
                        />
                        <Article 
                            title="So sánh sữa công thức Aptamil New Zealand và Aptamil Anh"
                            image="https://file.hstatic.net/1000186075/article/so-sanh-sua-cong-thuc-aptamil-new-zealand-va-aptamil-anh-bia_6c1b3a8a588e4158b9e7375dcfae59e4_master.jpg"
                        />
                    </div>
                    <div className="blog_new-articles-row">
                        <Article 
                            title="So sánh sữa Aptamil Đức và New Zealand"
                            image="https://file.hstatic.net/1000186075/article/so-sanh-sua-aptamil-duc-new-zealand_8982245c0458460c97609e11c63b1fb5_master.jpg"
                        />
                        <Article 
                            title="6 bí quyết giảm đau sau sinh cho các mẹ cực hiệu quả"
                            image="https://file.hstatic.net/1000186075/article/giam-dau-sau-sinhi_7cda3866fb2c4448be8e808a91dc98a3_master.jpg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;

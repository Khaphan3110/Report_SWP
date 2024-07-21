import React, { useEffect, useState } from 'react';
import './Blog.css';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { GetblogPaging } from '../../../Service/BlogService/BlogService';
import ReactPaginate from 'react-paginate';

const Blog = () => {
    const [listBlog, setListBlog] = useState()
    const [pageIndex, setPageIndex] = useState(1)
    const [modalShow, setModalShow] = React.useState(false);
    const [blogCurrent, setBlogCurrent] = useState()
    const handlePageClickPre = (event) => {
        setPageIndex(+event.selected + 1);
        // setPageIndex(+event.selected+1)
    };
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

    const getBlogPaging = async () => {
        try {
            const res = await GetblogPaging(pageIndex, 6);
            if (res) {
                setListBlog(res.data)
            }
        } catch (error) {
            console.log("get blog paging error", error)
        }
    }

    useEffect(() => {
        getBlogPaging()
    }, [])
    const handShowDetailBlog = (blog) => {
        setModalShow(true)
        console.log('blog', blog)
        setBlogCurrent(blog)
    }
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
                    <Row>
                        {listBlog && listBlog.items.length > 0 ? (
                            listBlog.items.map((blog, index) => (
                                <>
                                    <Col xl={6}>
                                        <Card style={{ width: '18rem', height: "256px", marginTop: "10px" }} onClick={() => handShowDetailBlog(blog)}>
                                            <Card.Body>
                                                <Card.Title>{blog.title}</Card.Title>
                                                <Card.Text>
                                                    {blog.content}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                </>
                            ))
                        ) : (null)}

                    </Row>
                    {blogCurrent ? (
                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            blog={blogCurrent}
                        />) : (null)}

                    <div style={{ display: "flex", justifyContent: "end", marginRight: '10px' }}>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="sau >"
                            onPageChange={handlePageClickPre}
                            pageRangeDisplayed={2}
                            pageCount={listBlog ? listBlog.pageCount : null}
                            marginPagesDisplayed={1}
                            previousLabel="< trước"
                            renderOnZeroPageCount={null}
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                        />
                    </div>
                </div>
            </div>
        </div>

    );
};

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.blog.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6 style={{fontWeight:"bold"}}>{props.blog.categories}</h6>
                <p>
                    {props.blog.content}
                </p>
                <p style={{ margin: "0", fontWeight: "bold" }}>Người tạo :
                    <span style={{fontWeight:"normal"}}>{props.blog.staffId} </span>
                </p>
                <p style={{ margin: "0", fontWeight: "bold" }}>Ngày tạo :
                    <span style={{fontWeight:"normal"}}>{props.blog.dateCreate}</span>
                </p>


            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>đóng</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default Blog;

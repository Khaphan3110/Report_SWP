import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountPage.css";
import { getUserInfor } from "../../../Service/UserService/UserService";
import { useOrderManager, usePreorder, useUserProfile } from "../../../Store";
import TrackingOrder from "./TrackingOrder";
import { Margin } from "@mui/icons-material";
import ReactPaginate from "react-paginate";
import { PreorderPagingMember, PreorderPagingMemberTracking } from "../../../Service/PreorderService/PreorderService";
import TrackingPreorder from "./TrackingPreorder";
import { getProductID } from "../../../Service/ProductService/ProductService";
import { GetOrderPigingTrackingMember } from "../../../Service/OrderService/OrderService";
const AccountPage = () => {
  const navigator = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const location = useLocation();
  const { getOrderPagin, listOrder, setListOrder } = useOrderManager();
  const {
    userProfile,
    setUserProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useUserProfile();
  const [pageIndex, setPageIndex] = useState(1);
  const [statePage, setStatePage] = useState("order");
  const handleAddressModalClose = () => setShowAddressModal(false);
  const handleAddressModalShow = () => setShowAddressModal(true);
  const {listPreorder,setListPreOrder} = usePreorder();
  const [pagePre, setPagePre] = useState(1);
  const handleAddressSubmit = (event) => {
    event.preventDefault();
    // Xử lý việc nhập địa chỉ tại đây
    alert(`Địa chỉ mới: ${address}`);
    handleAddressModalClose();
  };

  const handleLogout = () => {
    navigator("/logout");
  };

  const isEmpty = (obj) => {
    return Object.keys(obj).length !== 0;
  };
  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1);
    // setPageIndex(+event.selected+1)
  };

  const handlePageClickPre = (event) => {
    setPagePre(+event.selected + 1);
    // setPageIndex(+event.selected+1)
  };

  const handStatepage = (pageCurrent) => {
    console.log("page", pageCurrent);
    setStatePage(pageCurrent);
  };

  useEffect(() => {
    const resPre = async () => {
      try {
        const res = await PreorderPagingMemberTracking(
          userProfile.profile.member.memberId,
          pagePre,
          3
        );
        // console.log("preorder respone",res.data)
        if(res){
          setListPreOrder(res.data);
        } else {
          setListPreOrder([])
        }
      } catch (error) {
        console.log("error preorder fetch data", error);
      }
    };
    resPre();
  }, [pagePre]);
  console.log("lisst pre order", listPreorder);

  useEffect(() => {
    const resData = async () => {
      try {
        const res = await GetOrderPigingTrackingMember(
          userProfile.profile.member.memberId,
          pageIndex,
          3
        );
        if (!res) {
          setListOrder([]);
        } else {
          setListOrder(res.data)
        }
      } catch (error) {
        console.log("error fetch data", error);
      }
    };
    resData()
  }, [pageIndex]);
  console.log("order",listOrder)
  return (
    <Container className="mt-5">
      <ToastContainer />
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>TRANG TÀI KHOẢN</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Xin chào,{" "}
                {userProfile.profile
                  ? userProfile.profile.member.lastName
                  : "Ho"}{" "}
                {userProfile.profile
                  ? userProfile.profile.member.firstName
                  : "ten"}
                !
              </ListGroup.Item>
              <ListGroup.Item>
                {location.pathname === "/account" ? (
                  "Thông tin tài khoản"
                ) : (
                  <Link to="/account">Thông tin tài khoản</Link>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to="/addresses">Số địa chỉ</Link>{" "}
                {/* Use Link to navigate to addresses page */}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="link" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header>TÀI KHOẢN</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Tên tài khoản:</strong>{" "}
                {userProfile.profile
                  ? userProfile.profile.member.userName
                  : "tai khoan"}
                <br />
                <strong>Địa chỉ: </strong>
                {isEmpty(userProfile.CurrentAdress) ? (
                  userProfile.CurrentAdress.house_Number +
                  "," +
                  userProfile.CurrentAdress.street_Name +
                  "," +
                  userProfile.CurrentAdress.district_Name +
                  "," +
                  userProfile.CurrentAdress.city +
                  "," +
                  userProfile.CurrentAdress.region
                ) : (
                  <span style={{ color: "red" }}>
                    không có địa chỉ vui lòng thêm !!!{" "}
                    <Link to={"/addresses"}>Đây</Link>
                  </span>
                )}
                <br />
                <strong>Điện thoại:</strong>{" "}
                {userProfile.profile
                  ? userProfile.profile.member.phoneNumber
                  : ""}
                <br />
              </Card.Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <h5 style={{ alignContent: "center", margin: "0" }}>
                 {statePage === "order" ? "ĐƠN HÀNG CỦA BẠN" : "ĐƠN HÀNG MUA TRƯỚC CỦA BẠN"} 
                </h5>
                <div>
                  <button
                    onClick={() =>
                      handStatepage(
                        statePage === "order" ? "preorder" : "order"
                      )
                    }
                    className="button-change-mode-tracking"
                  >
                    {statePage === "order" ? "sản phẩm mua trước" : "Đơn Hàng"}
                  </button>
                  <Link to={"/order"} style={{textDecoration:"none"}}>
                  <button className="button-change-mode-tracking" >
                    lịch sử mua hàng
                  </button></Link>
                  
                </div>
              </div>

                <>
                  {statePage === "order" ? (
                    <>
                      {listOrder.items && listOrder.items.length > 0 ? (
                        <>
                          <TrackingOrder
                            listOrder={listOrder}
                            page={pageIndex}
                          />
                          <div
                            style={{
                              marginTop: "5px",
                              display: "flex",
                              justifyContent: "end",
                            }}
                          >
                            <ReactPaginate
                              breakLabel="..."
                              nextLabel=">"
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={3}
                              marginPagesDisplayed={1}
                              pageCount={listOrder.pageCount}
                              previousLabel="<"
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
                        </>
                      ) : (
                        <p style={{ fontWeight: "bold", margin: "0",textAlign:'center' }}>
                          Hiện tại chưa có đơn hàng
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {isEmpty(listPreorder) ? (
                        <>
                          <TrackingPreorder
                            listPreorder={listPreorder}
                            page={pagePre}
                          />
                          <div
                            style={{
                              marginTop: "5px",
                              display: "flex",
                              justifyContent: "end",
                            }}
                          >
                            <ReactPaginate
                              breakLabel="..."
                              nextLabel=">"
                              onPageChange={handlePageClickPre}
                              pageRangeDisplayed={3}
                              marginPagesDisplayed={1}
                              pageCount={listPreorder.pageCount}
                              previousLabel="<"
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
                        </>
                      ) : (
                        <p style={{ fontWeight: "bold", margin: "0",textAlign: "center" }}>
                          Hiện tại chưa có đơn hàng
                        </p>
                      )}
                    </>
                  )}
                </>


              {/* <table className="table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>     
                    <th>TT vận chuyển</th>
                    <th>Thành tiền</th>
                    <th>Trạng thái đơn hàng</th>
                  </tr>
                </thead>
                <tbody>
                  <TrackingOrder/>
                </tbody>
              </table> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountPage;

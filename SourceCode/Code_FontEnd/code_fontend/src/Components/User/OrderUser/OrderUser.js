import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useOrderManager, usePreorder } from "../../../Store";
import TrackingOrder from "../AccountPage/TrackingOrder";
import TrackingPreorder from "../AccountPage/TrackingPreorder";
import "./OrderUser.css";
import OrderHistory from "./OrderHistory";
import PreorderHistory from "./PreorderHistory";
export default function OrderUser() {
  const {getOrderPagin,listOrder,setListOrder} = useOrderManager()
  const {listPreorder,setListPreOrder} = usePreorder()
  const [pageState,setPageState] = React.useState("order")
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pagePre, setPagePre] = React.useState(1);
  const handleStatePage = (status) => {
    console.log("order page",status)
    setPageState(status)
  }

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
  return (
    <Container style={{marginBottom:"1%",marginTop:"1%"}}>
      <Row>
        <Col>
        <div className="order-history-user">
            <h4>{pageState === 'order' ? "Lịch sử mua hàng" : "Lịch Sử Đặt Hàng Trước"}</h4>
            <div
            className="action-order-user">
              <button className="action-order-user-button" onClick={() => handleStatePage("order")}>Lịch Sử Mua hàng</button>
              <button className="action-order-user-button" onClick={() => handleStatePage("preOrder")}>Lịch Sử Đặt Hàng Trước</button>
            </div>
        </div>
        <>
                  {pageState === "order" ? (
                    <>
                      {listOrder.items && listOrder.items.length > 0 ? (
                        <>
                          <OrderHistory
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
                          <PreorderHistory
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
                              onPageChange={handlePageClick}
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
        </Col>
      </Row>
    </Container>
  );
}

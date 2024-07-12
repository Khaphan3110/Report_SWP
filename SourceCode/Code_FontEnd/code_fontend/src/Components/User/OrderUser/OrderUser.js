import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useOrderManager, usePreorder, useUserProfile } from "../../../Store";
import TrackingOrder from "../AccountPage/TrackingOrder";
import TrackingPreorder from "../AccountPage/TrackingPreorder";
import "./OrderUser.css";
import OrderHistory from "./OrderHistory";
import PreorderHistory from "./PreorderHistory";
import { GetOrderPigingMemberHistory } from "../../../Service/OrderService/OrderService";
import { getProductID } from "../../../Service/ProductService/ProductService";
export default function OrderUser() {
  const {
    getOrderPagin,
    listOrder,
    setListOrder,
    listHistoryOrder,
    setListHistoryOrder,
  } = useOrderManager();
  const {
    listPreorder,
    setListPreOrder,
    listPreorderHistory,
    setlistPreorderHistory,
  } = usePreorder();
  const { userProfile } = useUserProfile();
  const [pageState, setPageState] = React.useState("order");
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pagePre, setPagePre] = React.useState(1);
  const handleStatePage = (status) => {
    console.log("order page", status);
    setPageState(status);
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

  React.useEffect(() => {
    const fetchHistoryOrder = async () => {
      try {
        const resOrder = await GetOrderPigingMemberHistory(
          userProfile.profile.member.memberId,
          pageIndex,
          6
        );
        if (resOrder) {
          setListHistoryOrder(resOrder.data);
        } else {
          setListHistoryOrder([]);
        }
      } catch (error) {
        console.log("lỗi ở fetch data order history", error);
      }
    };

    fetchHistoryOrder();
  }, [pageIndex]);

  React.useEffect(() => {
    const fetchHistoryPreOrder = async () => {
      try {
        const resPreOrder = await GetOrderPigingMemberHistory(
          userProfile.profile.member.memberId,
          pageIndex,6
        );
        console.log("preorder",resPreOrder.data)
        if (resPreOrder) {
          const resProduct = await getProductID(
            resPreOrder.data.items[0].productId
          );
          console.log("preorder product",resProduct.data)
          setListPreOrder({
            preorder: resPreOrder.data,
            product: resProduct.data,
          });
        } else {
          setlistPreorderHistory({});
        }
      } catch (error) {
        console.log("lỗi ở fetch data order history", error);
      }
    };

    fetchHistoryPreOrder();
  }, [pagePre]);
  // console.log('orderhis',listHistoryOrder)
  console.log('preorderhis',listPreorderHistory)
  return (
    <Container style={{ marginBottom: "1%", marginTop: "1%" }}>
      <Row>
        <Col>
          <div className="order-history-user">
            <h4>
              {pageState === "order"
                ? "Lịch sử mua hàng"
                : "Lịch Sử Đặt Hàng Trước"}
            </h4>
            <div className="action-order-user">
              <button
                className="action-order-user-button"
                onClick={() => handleStatePage("order")}
              >
                Lịch Sử Mua hàng
              </button>
              <button
                className="action-order-user-button"
                onClick={() => handleStatePage("preOrder")}
              >
                Lịch Sử Đặt Hàng Trước
              </button>
            </div>
          </div>
          <>
            {pageState === "order" ? (
              <>
                {listHistoryOrder.items && listHistoryOrder.items.length > 0 ? (
                  <>
                    <OrderHistory listOrder={listHistoryOrder} page={pageIndex} />
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
                        pageCount={listHistoryOrder.pageCount}
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
                  <p
                    style={{
                      fontWeight: "bold",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
                    Hiện tại chưa có đơn hàng
                  </p>
                )}
              </>
            ) : (
              <>
                {isEmpty(listPreorderHistory) ? (
                  <>
                    <PreorderHistory
                      listPreorder={listPreorderHistory}
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
                        pageCount={listPreorderHistory.pageCount}
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
                  <p
                    style={{
                      fontWeight: "bold",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
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

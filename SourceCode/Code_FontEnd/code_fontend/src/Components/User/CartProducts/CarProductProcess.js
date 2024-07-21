import React, { useEffect, useState } from "react";
import { useProduct } from "../../../Store";
import CartProducts from "./CartProducts";
import HomePage from "../../../Pages/HomePage/HomePage";
import { Container, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

export default function CarProductProcess() {
  const { listProduct, getAllProductToContext } = useProduct();
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getListProduct = async () => {
      try {
        setIsLoading(true);
        await getAllProductToContext(pageIndex, 15);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getListProduct();
  }, [pageIndex]);

  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1);
  };

  
  return (
    <>
      <Container>
        <HomePage />
        {isLoading ? (
          <div style={{ margin: "0 auto", width: "100px", color: "#FF6C89" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : listProduct.items && listProduct.items.length > 0 ? (
          <>
            <CartProducts listProduct={listProduct.items} page={pageIndex} />
            <div className="cart-product-painaging-home-page">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={listProduct.pageCount}
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
                forcePage={pageIndex - 1}
              />
            </div>
          </>
        ) : (
          <div>
            <h2 style={{ textAlign: "center" }}>Không có Sản phẩm nào cả</h2>
          </div>
        )}
      </Container>
    </>
  );
}

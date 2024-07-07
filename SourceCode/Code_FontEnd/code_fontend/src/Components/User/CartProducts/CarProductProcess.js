import React, { useEffect, useState } from "react";
import { useProduct } from "../../../Store";
import CartProducts from "./CartProducts";
import HomePage from "../../../Pages/HomePage/HomePage";
import { Container } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function CarProductProcess() {
  const { listProduct, getAllProductToContext } = useProduct();
  const [pageIndex,setPageIndex] = useState(1)

  useEffect(() => {
    const getListProduct = async () => {
      await getAllProductToContext(pageIndex, 12)
    };
    getListProduct();
    console.log("một",listProduct)
  }, [pageIndex]);

  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1)
  };

  return (
    <>
      <Container>
        <HomePage />
        {listProduct.items && listProduct.items.lenght > 0 ? (
          <>
            <CartProducts listProduct={listProduct.items} />
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
            />
          </>
        ) : (
          <div>
            <h2 style={{ textAlign: "center" }}> Không có Sản phẩm nào cả </h2>
          </div>
        )}
      </Container>
    </>
  );
}

import React, { useEffect } from "react";
import { useProduct } from "../../../Store";
import CartProducts from "./CartProducts";
import HomePage from "../../../Pages/HomePage/HomePage";
import { Container } from "react-bootstrap";

export default function CarProductProcess() {
  const { listProduct, getAllProductToContext } = useProduct();

  useEffect(() => {
    const getProduct = async () => {
      await getAllProductToContext(1, 12);
    };
    getProduct();
  }, []);
  return (
    <>
      <Container>
        <HomePage />
        {listProduct && listProduct.lenght > 0 ? (
          <CartProducts listProduct={listProduct} />
        ) : (
          <div>
            <h2 style={{textAlign:"center"}}> Không có Sản phẩm nào cả </h2>
          </div>
        )}
      </Container>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PreProductDetail from "./PreProductDetail";
import { useParams } from "react-router-dom";
import { getProductID } from "../../../Service/ProductService/ProductService";
import { imageGetAll } from "../../../Service/ProductService/imageService";
import { getCateByID } from "../../../Service/CateService/CateService";
import { GetReviewProduct } from "../../../Service/ReviewService/ReviewService";
import { getMemberID } from "../../../Service/UserService/UserService";

export default function ProductDetail() {
  const param = useParams();
  const productId = param.productID;
  const [products, setProductDetail] = useState({});

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, imagesRes] = await Promise.all([
          getProductID(productId),
          imageGetAll(productId),
        ]);

        if (productRes && imagesRes) {
          const categoryRes = await getCateByID(productRes.data.categoriesId);
          const ProductReview = await GetReviewProduct(productId);
          if (ProductReview) {
            const memberReview = await getMemberID(
              ProductReview.data[0].memberId
            );
            setProductDetail({
              categoriesId: productRes.data.categoriesId,
              description: productRes.data.description,
              image: productRes.data.image,
              images: imagesRes.data,
              price: productRes.data.price,
              productId: productRes.data.productId,
              productName: productRes.data.productName,
              quantity: productRes.data.quantity,
              statusDescription: productRes.data.statusDescription,
              category: categoryRes ? categoryRes.data : null,
              review: ProductReview ? ProductReview.data : null,
              member: memberReview ? memberReview.data : null,
            });
          } else {
            setProductDetail({
              categoriesId: productRes.data.categoriesId,
              description: productRes.data.description,
              image: productRes.data.image,
              images: imagesRes.data,
              price: productRes.data.price,
              productId: productRes.data.productId,
              productName: productRes.data.productName,
              quantity: productRes.data.quantity,
              statusDescription: productRes.data.statusDescription,
              category: categoryRes ? categoryRes.data : null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductData();
  }, [param, productId]);

  const hasData = (obj) => {
    // Check if the object is not empty and has essential keys
    return obj && Object.keys(obj).length > 0;
  };
  return (
    <Container style={{ marginTop: "1%", marginBottom: "1%" }}>
      {hasData(products) ? (
        <PreProductDetail productDetail={products} />
      ) : (
        <div>
          <h2 style={{ textAlign: "center", color: "#f05a72" }}>sản phẩm bị lỗi</h2>
        </div>
      )}
    </Container>
  );
}

import React, { useEffect, useState } from "react";
import "./SearchFilterProduct.css";
import { Col, Container, Row } from "react-bootstrap";
import CartProducts from "../CartProducts/CartProducts";
import { useParams } from "react-router-dom";
import { GetProductByCatePaging } from "../../../Service/CateService/CateService";
import ReactPaginate from "react-paginate";
import { imageGetAll } from "../../../Service/ProductService/imageService";
export default function SearchFilterProduct() {
  const list = [];
  const paramSearch = useParams();
  const [pageIndex, setPageIndex] = useState(1);
  const [listProduct, setlistProduct] = useState();
  const [CounterPage, setCounterPage] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  // console.log("param search", paramSearch)

  const resDatapagingByCate = async () => {
    try {
      const resData = await GetProductByCatePaging(paramSearch.search, pageIndex, 6);
      if (resData) {
        setCounterPage(resData.data.pageCount)
        // Use Promise.all to fetch images for each product concurrently
        const listProductAndImage = await Promise.all(resData.data.items.map(async (product) => {
          const resImageProduct = await imageGetAll(product.productId); // Assuming imageGetAll takes productId as a parameter and returns the image
          return { ...product, images: resImageProduct.data };
        }));

        setlistProduct(listProductAndImage);
      }
    } catch (error) {
      console.log('error at paging search by cate', error);
    }
  };

  useEffect(() => {
    resDatapagingByCate()
  }, [pageIndex, paramSearch])
  console.log("product", listProduct)
  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1);
    // setPageIndex(+event.selected+1)
  };

  useEffect(() => {
    filterProductsByPrice();
  }, [priceFilter, listProduct]);

  const filterProductsByPrice = () => {
    if (!priceFilter) {
      setFilteredProducts(listProduct);
      return;
    }
    const filtered = listProduct.filter(product => {
      if (priceFilter === 'under_100k') return product.price < 100000;
      if (priceFilter === '100k_300k') return product.price >= 100000 && product.price <= 300000;
      if (priceFilter === '300k_500k') return product.price >= 300000 && product.price <= 500000;
      if (priceFilter === '500k_1m') return product.price >= 500000 && product.price <= 1000000;
      if (priceFilter === '1m_3m') return product.price >= 1000000 && product.price <= 3000000;
      if (priceFilter === 'above_3m') return product.price > 3000000;
      return true;
    });
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filter) => {
    setPriceFilter(filter);
  };

  const handleDoubleClick = (filter) => {
    if (priceFilter === filter) {
      setPriceFilter(null); // Deselect if double-clicked
    } else {
      setPriceFilter(filter);
    }
  };
  console.log("list product", listProduct)
  return (
    <Container className="search-product-wraper">
      <Row style={{ height: "100vh" }}>
        <Col xl={2}>
          <div className="filter-product-search">
            <h5>MỨC GIÁ</h5>
            <div className="filter-check-box-product">
              <input
                type="checkbox"
                onChange={() => handleFilterChange('under_100k')}
                onDoubleClick={() => handleDoubleClick('under_100k')}
                checked={priceFilter === 'under_100k'}
              />
              <p>Giá dưới 100,000₫</p>
            </div>
            <div className="filter-check-box-product">
              <input
                type="checkbox"
                onChange={() => handleFilterChange('100k_300k')}
                onDoubleClick={() => handleDoubleClick('100k_300k')}
                checked={priceFilter === '100k_300k'}
              />
              <p>100,000₫ - 300,000₫</p>
            </div>
            <div className="filter-check-box-product">
              <input
                type="checkbox"
                onChange={() => handleFilterChange('300k_500k')}
                onDoubleClick={() => handleDoubleClick('300k_500k')}
                checked={priceFilter === '300k_500k'}
              />
              <p>300,000₫ - 500,000₫</p>
            </div>
            <div className="filter-check-box-product">
              <input
                type="checkbox"
                onChange={() => handleFilterChange('500k_1m')}
                onDoubleClick={() => handleDoubleClick('500k_1m')}
                checked={priceFilter === '500k_1m'}
              />
              <p>500,000₫ - 1,000,000₫</p>
            </div>
            <div className="filter-check-box-product">
              <input
                type="checkbox"
                onChange={() => handleFilterChange('1m_3m')}
                onDoubleClick={() => handleDoubleClick('1m_3m')}
                checked={priceFilter === '1m_3m'}
              />
              <p>1,000,000₫ - 3,000,000₫</p>
            </div>
            <div className="filter-check-box-product">
              <input
                type="checkbox"
                onChange={() => handleFilterChange('above_3m')}
                onDoubleClick={() => handleDoubleClick('above_3m')}
                checked={priceFilter === 'above_3m'}
              />
              <p>Giá trên 3,000,000₫</p>
            </div>
          </div>
        </Col>
        <Col xl={10}>
          <div className="search-product-wraper-right">
            <h4>Sữa được tìm kiếm</h4>
            <div className="filter-product-search-right">

              <ul className="nav-search-fillter-right">
                <li>Sắp Xếp: </li>
                <li> Từ A - Z</li>
                <li> Từ Z - A</li>
                <li>Giá tăng dần</li>
                <li>Giá giảm dần</li>
              </ul>
              {filteredProducts && filteredProducts.length > 0 ? (
                <>
                  <CartProducts listProduct={filteredProducts} />
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
                      pageCount={CounterPage}
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
              )
                :
                (<div><h2 style={{ textAlign: "center" }}>Kh có sản phẩm nào phù hợp với kết quả tìm kiếm</h2></div>)}

            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

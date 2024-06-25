import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { importImageProduct } from "../../../Service/ProductService/imageService";
import { useCateGories, useProduct } from "../../../Store/Hooks/Hooks";
import "./Product.css";
export default function Categories() {
  const [listProductExport, setlistProductExport] = useState([]);
  const [cateGoriesID, setCateGoriesID] = useState("");
  const [show, setShow] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const { listCategories } = useCateGories();
  const { listProduct, importProductList, getAllProductToContext } =
    useProduct();

  const getProductToExport = async (event, done) => {
    const result = [];
    if (listProduct && listProduct.length > 0) {
      result.push([
        "productName",
        "quantity",
        "price",
        "description",
        "statusDescription",
      ]);
      listProduct.map((product, index) => {
        let arr = [];
        arr[0] = product.productName;
        arr[1] = product.quantity;
        arr[2] = product.price;
        arr[3] = product.description;
        arr[4] = product.statusDescription;
        result.push(arr);
      });
      setlistProductExport(result);
      done();
    }
  };

  const handleImportFileProduct = async (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("chỉ được nhập file csv");
        return;
      }
      Papa.parse(file, {
        // header:true,

        complete: async function (results) {
          let rawCSV = results.data;
          if (rawCSV[0] && rawCSV[0].length === 5) {
            if (
              rawCSV[0][0] !== "productName" ||
              rawCSV[0][1] !== "quantity" ||
              rawCSV[0][2] !== "price" ||
              rawCSV[0][3] !== "description" ||
              rawCSV[0][4] !== "statusDescription"
            ) {
              toast.error("sai format của dữ liệu trong file!");
            }
            {
              let result = [];
              rawCSV.map((product, index) => {
                if (index > 0 && product.length === 5) {
                  let productObj = {};
                  productObj.categoriesId = cateGoriesID;
                  productObj.productName = product[0];
                  productObj.quantity = product[1];
                  productObj.price = product[2];
                  productObj.description = product[3];
                  productObj.statusDescription = product[4];
                  result.push(productObj);
                }
              });
              if (cateGoriesID) {
                console.log("day la list product", result);
                const resImportProduct = await importProductList(result);
                if (resImportProduct) {
                  toast.success("nhập sản phẩm thành công ");
                } else {
                  toast.error("Nhập sản phẩm kh thành công");
                }
              } else {
                toast.error("Chưa chọn loại sản phẩm !!!");
              }
            }
          }
        },
      });
    }
  };

  useEffect(() => {
    const getListProduct = async () => {
      await getAllProductToContext(1, 11);
    };
    getListProduct();
  }, []);

  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setcurrentItems] = useState([]);
  const [pageCount, setpageCount] = useState();

  useEffect(() => {
    if (listProduct && listProduct.length > 0) {
      const endOffset = itemOffset + 11;
      setcurrentItems(listProduct.slice(itemOffset, endOffset));
      setpageCount(Math.ceil(listProduct.length / 11));
    } else {
      console.log("kh co du lieu");
    }
  }, [listProduct, itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 11) % listProduct.length;
    setItemOffset(newOffset);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handDeleteButton = () => {
    alert("bạn có chắc là muốn xóa không ???");
  };

  const handleGetCateValue = (event) => {
    setCateGoriesID(event.target.value);
  };

  const handleImportFileImage = async (event, productID) => {
    let image = Array.from(event.target.files);
    // console.log("image",image)
    setImageFile(image);
    const formData = new FormData();
    imageFile.forEach((image, index) => {
      formData.append("imageFiles", image);
    });
    // console.log("fdsa",formData)
    const resImage = await importImageProduct(productID, formData);
    if (resImage) {
      toast.success("lưu hỉnh ảnh thành công", {
        autoClose: 1000,
      });
    } else {
      toast.error("lưu hỉnh ảnh KHÔNG thành công", {
        autoClose: 1000,
      });
    }

    // 'imageFiles=@download.png;type=image/png'
  };

  return (
    <>
      <ToastContainer />
      <div className="header-Product">
        <div className="search-form-categories">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>List Products</h4>
        </div>

        <div className="button-Product">
          <div className="sub-button-Product">
            <label htmlFor="test" className="btn btn-success">
              <i className="fa-solid fa-file-import"></i> Import
            </label>
            <input
              type="file"
              hidden
              id="test"
              onChange={(event) => handleImportFileProduct(event)}
            />
          </div>

          <div className="sub-button-Product">
            <CSVLink
              data={listProductExport}
              filename={"Products.csv"}
              className="btn btn-secondary"
              asyncOnClick={true}
              onClick={getProductToExport}
            >
              <i className="fa-solid fa-download"></i> Export
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="wrapper-search">
        <div className="search-Product">
          <input
            id="search-product"
            type="search"
            name="search-product"
            placeholder="search"
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="select-categories">
          <label htmlFor="Categories">Choose Categories Before Import</label>
          <select
            title="Categories"
            id="Categories"
            onChange={handleGetCateValue}
          >
            <option> Categories Type</option>
            {listCategories &&
              listCategories.map((cate, index) => {
                return (
                  <>
                    <option key={index} value={cate.categoriesId}>
                      {cate.brandName}
                    </option>
                  </>
                );
              })}
          </select>
        </div>
      </div>

      <div className="stateImportProduct">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>stt</th>
              <th>productID</th>
              <th>productName</th>
              <th>quantity</th>
              <th>price</th>
              <th>description</th>
              <th>statusDescription</th>
              <th>categoriesId</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems &&
              currentItems.map((product, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td>{product.statusDescription}</td>
                    <td>{product.categoriesId}</td>
                    <th>
                      <Button
                        variant="warning"
                        className="action-button"
                        onClick={handleShow}
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        className="action-button"
                        onClick={handDeleteButton}
                      >
                        Delete
                      </Button>

                      <div className="sub-button-Product-importImage">
                        <label
                          htmlFor={`UpImage-${product.productId}`}
                          className="btn btn-info"
                        >
                          <i className="fa-solid fa-file-import"></i> UpImage
                        </label>
                        <input
                          type="file"
                          hidden
                          accept="image/png"
                          multiple
                          id={`UpImage-${product.productId}`}
                          onChange={(event) =>
                            handleImportFileImage(event, product.productId)
                          }
                        />
                      </div>
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="sau >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

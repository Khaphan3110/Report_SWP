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
import { FaPen, FaTrash } from "react-icons/fa";
import {
  DeleteProduct,
  UpdateProduct,
  productGetAll,
} from "../../../Service/ProductService/ProductService";
import * as Yup from "yup";
import { useFormik } from "formik";
import { cateGetAllNoPaginate } from "../../../Service/CateService/CateService";
export default function Categories() {
  const [listProductExport, setlistProductExport] = useState([]);
  const [cateGoriesID, setCateGoriesID] = useState("");
  const [show, setShow] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const { listCategories,getAllCategoreisNopaginate } = useCateGories();
  const [listCate,setListCate] = useState()
  const { listProduct, importProductList, getAllProductToContext } =
    useProduct();
  const [currentProduct, setCurrentProduct] = useState();
  const [pageIndex,setPageIndex] = useState(1)
  const getProductToExport = async (event, done) => {
    try {
      const result = [];
      const res = await productGetAll();
      if (res.data && res.data.length > 0) {
        result.push([
          "productName",
          "quantity",
          "price",
          "description",
          "statusDescription",
        ]);
        res.data.map((product, index) => {
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
      } else {
        toast.error("can not export file ");
      }
    } catch (error) {
      console.log("lỗi export product", error);
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
                // console.log("day la list product", result);
                const resImportProduct = await importProductList(result);
                if (resImportProduct) {
                  getAllProductToContext(pageIndex,8);
                  toast.success("nhập sản phẩm thành công ", {
                    autoClose: 1500,
                  });
                } else {
                  toast.error("Nhập sản phẩm kh thành công", {
                    autoClose: 1500,
                  });
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
      await getAllProductToContext(pageIndex, 8);
    };
    getListProduct();
  }, []);

  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1)
  };

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setShow(true);
    setCurrentProduct(product);
  };
  const handDeleteButton = (productID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      DeleteProduct(productID);
      getAllProductToContext(pageIndex, 8);
      toast.success("delete success!", {
        autoClose: 1500,
      });
    } else {
      toast.error("delete unsuccess!!", {
        autoClose: 1500,
      });
    }
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
  };
  const formikProduct = useFormik({
    initialValues: {
      CategoriesId: "",
      ProductId: "",
      ProductName: "",
      Quantity: "",
      Price: "",
      Description: "",
      statusDescription: "",
    },

    validationSchema: Yup.object({
      ProductName: Yup.string().required("ProductName is required"),
      Quantity: Yup.number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be greater than 0")
        .integer("Quantity must be an integer")
        .required("Quantity is required"),
      Price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be greater than 0")
        .required("Price is required"),
      Description: Yup.string().required("Description is required"),
      statusDescription: Yup.string()
        .oneOf(
          ["còn hàng", "hết hàng"],
          'Status description must be either "còn hàng" or "hết hàng"'
        )
        .required("Status description is required"),
    }),

    onSubmit: async (values) => {
      const formProduct = new FormData();
      formProduct.append("ProductId", values.ProductId);
      formProduct.append("CategoriesId", values.CategoriesId);
      formProduct.append("ProductName", values.ProductName);
      formProduct.append("Quantity", values.Quantity);
      formProduct.append("Description", values.Description);
      //
      try {
        setShow(false);
        const res = await UpdateProduct(values.ProductId,formProduct);
        if (res) {
          getAllProductToContext(pageIndex,8)
          toast.success("update product successFull!", {
            autoClose: 1500,
          });
        } else {
          toast.error("Update is not success", {
            autoClose: 1500,
          });
        }
      } catch (error) {
        console.log("lỗi ở update product page", error);
      }
    },
  });

  useEffect(() => {
    if (currentProduct) {
      console.log(currentProduct);
      formikProduct.setValues({
        CategoriesId: currentProduct.categoriesId,
        ProductId: currentProduct.productId,
        ProductName: currentProduct.productName,
        Quantity: currentProduct.quantity,
        Price: currentProduct.price,
        Description: currentProduct.description,
        statusDescription: currentProduct.statusDescription,
      });
    }
  }, [currentProduct]);
  // 'imageFiles=@download.png;type=image/png'
  useEffect(  () => {
    const getCate = async () => {
      const res = await cateGetAllNoPaginate()
    setListCate(res.data)
    }
    getCate();
  },[])

  useEffect(() => {
    getAllProductToContext(pageIndex,8)
  },[pageIndex])
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
            {listCate &&
              listCate.map((cate, index) => {
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
            {listProduct &&
              listProduct.items.map((product, index) => {
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
                    <th className="action-product-controller">
                      <FaPen
                        className="action-button"
                        onClick={() => handleShow(product)}
                      ></FaPen>
                      <FaTrash
                        className="action-button"
                        onClick={() => handDeleteButton(product.productId)}
                      ></FaTrash>

                      <div className="sub-button-Product-importImage">
                        <label
                          htmlFor={`UpImage-${product.productId}`}
                          className="btn btn-info"
                        >
                          <i className="fa-solid fa-file-import"></i> IpImg
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikProduct.handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ProductName</Form.Label>
              <Form.Control
                name="ProductName"
                type="ProductName"
                placeholder="ProductName"
                autoFocus
                value={formikProduct.values.ProductName}
                onChange={formikProduct.handleChange}
              />
            </Form.Group>
            {formikProduct.errors.ProductName && (
              <p style={{ color: "red", margin: "0" }}>
                {formikProduct.errors.ProductName}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                name="Quantity"
                type="Quantity"
                placeholder="Quantity"
                autoFocus
                value={formikProduct.values.Quantity}
                onChange={formikProduct.handleChange}
              />
            </Form.Group>
            {formikProduct.errors.Quantity && (
              <p style={{ color: "red", margin: "0" }}>
                {formikProduct.errors.Quantity}
              </p>
            )}
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="Price"
                type="Price"
                placeholder="Price"
                autoFocus
                value={formikProduct.values.Price}
                onChange={formikProduct.handleChange}
              />
            </Form.Group>
            {formikProduct.errors.Price && (
              <p style={{ color: "red", margin: "0" }}>
                {formikProduct.errors.Price}
              </p>
            )} */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="Description"
                type="Description"
                placeholder="Description"
                autoFocus
                value={formikProduct.values.Description}
                onChange={formikProduct.handleChange}
              />
            </Form.Group>
            {formikProduct.errors.Description && (
              <p style={{ color: "red", margin: "0" }}>
                {formikProduct.errors.Description}
              </p>
            )}
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>statusDescription</Form.Label>
              <Form.Control
                name="statusDescription"
                type="statusDescription"
                placeholder="statusDescription"
                autoFocus
                value={formikProduct.values.statusDescription}
                onChange={formikProduct.handleChange}
              />
            </Form.Group>
            {formikProduct.errors.statusDescription && (
              <p style={{ color: "red", margin: "0" }}>
                {formikProduct.errors.statusDescription}
              </p>
            )} */}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

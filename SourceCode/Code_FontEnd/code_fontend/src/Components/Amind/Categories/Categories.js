import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Papa from "papaparse";
import ReactPaginate from "react-paginate";
import { useCateGories } from "../../../Store";
import "./Categories.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cateGetAllNoPaginate, DeleteCategories, UpdateCategories } from "../../../Service/CateService/CateService";
export default function Categories() {
  const [listCategoriesExport, setListCategoreisExport] = useState([]);
  // const [listCategoriesImport, setListCategoreisImport] = useState([]);
  // const [stateCate, setSateCate] = useState(false);
  const [show, setShow] = useState(false);
  // const [stateImportCate, setStateImportCate] = useState(false);
  const {
    listCategories,
    setListCategoreis,
    FunImportCateGories,
    getAllCategoreis,
    errorNumber,
    getAllCategoreisNopaginate
  } = useCateGories();
  const [numberPaginate,setNumberPaginate] = useState(1);
  const getCategoriesExport = async (event, done) => {
    const result = [];
    const res = await cateGetAllNoPaginate();
    if (res.data && res.data.length > 0) {
      
      result.push([
        "categoriesId",
        "brandName",
        "ageRange",
        "subCategories",
        "packageType",
        "source",
      ]);
      res.data.map((cate, index) => {
        let arr = [];
        arr[0] = cate.categoriesId;
        arr[1] = cate.brandName;
        arr[2] = cate.ageRange;
        arr[3] = cate.subCategories;
        arr[4] = cate.packageType;
        arr[5] = cate.source;
        result.push(arr);
      });
      setListCategoreisExport(result);
      done();
    } else {
      toast.error("Can not export file cate")
    }
  };

  const handleImportFile = async (event) => {
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
              rawCSV[0][0] !== "brandName" ||
              rawCSV[0][1] !== "ageRange" ||
              rawCSV[0][2] !== "subCategories" ||
              rawCSV[0][3] !== "packageType" ||
              rawCSV[0][4] !== "source"
            ) {
              toast.error("sai format của dữ liệu trong file!");
            }
            {
              let result = [];
              rawCSV.map((cate, index) => {
                if (index > 0 && cate.length === 5) {
                  let cateObj = {};
                  cateObj.brandName = cate[0];
                  cateObj.ageRange = cate[1];
                  cateObj.subCategories = cate[2];
                  cateObj.packageType = cate[3];
                  cateObj.source = cate[4];
                  result.push(cateObj);
                }
              });
              const res = await FunImportCateGories(result);
              if (res) {
                toast.success("nhập Cate thành công !!");
              } else {
                toast.error("nhập sản phẩm thất bại");
              }
              await getAllCategoreis(numberPaginate,8);
            }
          }
        },
      });
    }
  };

  const handlePageClick = (event) => {
    setNumberPaginate(+event.selected + 1);
  };

  const handleClose = () => setShow(false);

  const handDeleteButton = (categoriesId) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      DeleteCategories(categoriesId)
      getAllCategoreis(numberPaginate, 8);
      toast.success("delete success!",{
        autoClose:1500,
      })
    }
  };

  const [currentCate, setCurrentcate] = useState();
  const handleUpdateCate = (cate) => {
    setCurrentcate(cate);
    setShow(true);
  };
  const formikCategories = useFormik({
    initialValues: {
      categoriesId: "",
      brandName: "",
      ageRange: "",
      subCategories: "",
      packageType: "",
      source: "",
    },

    validationSchema: Yup.object({
      // brandName: Yup.string().required("Brand name must not be empty"),
      ageRange: Yup.string().notOneOf(["0"], "Age range must not be 0"),
      // subCategories: Yup.string().required("Sub-categories must not be empty"),
      packageType: Yup.string().matches(
        /^[^\d]*$/,
        "Package type must not contain numbers"
      ),
    }),

    onSubmit: async (values) => {
        setShow(false);
        try {
          const res = await UpdateCategories(values.categoriesId, values);
          if (res) {
            getAllCategoreis(numberPaginate, 8);
            toast.success("update cate successfull!", {
              autoClose: 1500,
            });
          } else {
            toast.error("update not success", {
              autoClose: 1500,
            });
          }
        
        } catch (error) {
          console.log("lỗi ở cate update page", error);
        }
    },
  });

  useEffect(() => {
    if (currentCate) {
      formikCategories.setValues({
        categoriesId: currentCate.categoriesId,
        brandName: currentCate.brandName,
        ageRange: currentCate.ageRange,
        subCategories: currentCate.subCategories,
        packageType: currentCate.packageType,
        source: currentCate.source,
      });
    }
  }, [currentCate]);

  useEffect(() => {
    getAllCategoreis(numberPaginate, 8);
  }, [numberPaginate]);
  return (
    <>
      <ToastContainer />
      <div className="header-categories">
        <div className="search-form-categories">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>List categories</h4>
        </div>

        <div className="button-categories">
          <div className="sub-button-categories">
            <label htmlFor="test" className="btn btn-success">
              <i className="fa-solid fa-file-import"></i> Import
            </label>
            <input
              type="file"
              hidden
              id="test"
              onChange={(event) => handleImportFile(event)}
            />
          </div>
          <div className="sub-button-categories">
            <CSVLink
              data={listCategoriesExport}
              filename={"Categories.csv"}
              className="btn btn-secondary"
              asyncOnClick={true}
              onClick={getCategoriesExport}
            >
              <i className="fa-solid fa-download"></i> Export
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="search-categories">
        <input
          id="search-cate"
          type="search"
          name="search-categoreis"
          placeholder="search"
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="stateImportCate">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>stt</th>
              <th>categoriesId</th>
              <th>brandName</th>
              <th>ageRange</th>
              <th>subCategories</th>
              <th>packageType</th>
              <th>source</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listCategories.items &&
              listCategories.items.map((cate, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cate.categoriesId}</td>
                    <td>{cate.brandName}</td>
                    <td>{cate.ageRange}</td>
                    <td>{cate.subCategories}</td>
                    <td>{cate.packageType}</td>
                    <td>{cate.source}</td>
                    <th>
                      <Button
                        variant="warning"
                        className="action-button"
                        onClick={() => handleUpdateCate(cate)}
                        style={{border:"0",padding:"5px"}}
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        className="action-button"
                        onClick={()=>handDeleteButton(cate.categoriesId)}
                        style={{border:"0",padding:"5px"}}
                      >
                        Delete
                      </Button>
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
        pageCount={listCategories.pageCount}
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
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikCategories.handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>brandName</Form.Label>
              <Form.Control
                type="text"
                placeholder="brandName"
                autoFocus
                value={formikCategories.values.brandName}
                onChange={formikCategories.handleChange}
                name="brandName"
              />
            </Form.Group>
            {formikCategories.errors.brandName && (
              <p style={{ color: "red", margin: "0" }}>
                {formikCategories.errors.brandName}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ageRange</Form.Label>
              <Form.Control
                type="text"
                placeholder="ageRange"
                autoFocus
                value={formikCategories.values.ageRange}
                onChange={formikCategories.handleChange}
                name="ageRange"
              />
            </Form.Group>
            {formikCategories.errors.ageRange && (
              <p style={{ color: "red", margin: "0" }}>
                {formikCategories.errors.ageRange}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>subCategories</Form.Label>
              <Form.Control
                type="text"
                placeholder="subCategories"
                autoFocus
                value={formikCategories.values.subCategories}
                onChange={formikCategories.handleChange}
                name="subCategories"
              />
            </Form.Group>
            {formikCategories.errors.subCategories && (
              <p style={{ color: "red", margin: "0" }}>
                {formikCategories.errors.subCategories}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>packageType</Form.Label>
              <Form.Control
                type="text"
                placeholder="packageType"
                autoFocus
                value={formikCategories.values.packageType}
                onChange={formikCategories.handleChange}
                name="packageType"
              />
            </Form.Group>
            {formikCategories.errors.packageType && (
              <p style={{ color: "red", margin: "0" }}>
                {formikCategories.errors.packageType}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>source</Form.Label>
              <Form.Control
                type="text"
                placeholder="source"
                autoFocus
                value={formikCategories.values.source}
                onChange={formikCategories.handleChange}
                name="source"
              />
            </Form.Group>
            {formikCategories.errors.source && (
              <p style={{ color: "red", margin: "0" }}>
                {formikCategories.errors.source}
              </p>
            )}
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

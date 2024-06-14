import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import {
  cateGetAll,
  importCateGories,
} from "../../../Service/CateService/CateService";
import "./Categories.css";
import Papa from "papaparse";
import ReactPaginate from "react-paginate";
export default function Categories() {
  const [listCategories, setListCategoreis] = useState([]);
  const [listCategoriesImport, setListCategoreisImport] = useState([]);
  const [stateCate, setSateCate] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const categet = async () => {
      const res = await cateGetAll();
      setListCategoreis(res.data);
    };
    categet();
  }, []);
  const getCategoriesExport = async (event, done) => {
    const result = [];
    if (listCategories && listCategories.length > 0) {
      result.push([
        "categoriesId",
        "brandName",
        "ageRange",
        "subCategories",
        "packageType",
      ]);
      listCategories.map((cate, index) => {
        let arr = [];
        arr[0] = cate.categoriesId;
        arr[1] = cate.brandName;
        arr[2] = cate.ageRange;
        arr[3] = cate.subCategories;
        arr[4] = cate.packageType;
        result.push(arr);
      });
      setListCategoreis(result);
      done();
    }
  };

  const handleImportFile = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("chỉ được nhập file csv");
        return;
      }
      Papa.parse(file, {
        // header:true,

        complete: function (results) {
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
                setListCategoreisImport(result);
              });
            }
          }
        },
      });
    }
  };

  useEffect(() => {
    setSateCate(true);
    console.log("vovo");
    console.log(listCategoriesImport);
    const formData = new FormData();
    listCategoriesImport.map(
      async (cate, index) => {
        console.log("cate", cate);

        formData.append("BrandName", cate.brandName);
        formData.append("AgeRange", cate.ageRange);
        formData.append("SubCategories", cate.subCategories);
        formData.append("PackageType", cate.packageType);
        formData.append("Source", cate.source);
        const resImport = await importCateGories(formData);
        console.log("nhap", resImport);
        console.log("form data", formData);
      },
      [stateCate]
    );
  });

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + 11;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = listCategories.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(listCategories.length / 11);
  // const [ endOffset, pageCount, listOfSet ] = usePagination(listOrchil,8)
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 11) % listCategories.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handDeleteButton = () => {
    alert("bạn có chắc là muốn xóa không ???")
  };
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
              data={listCategories}
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

      <div className="table-categories">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>stt</th>
              <th>categoriesId</th>
              <th>brandName</th>
              <th>ageRange</th>
              <th>subCategories</th>
              <th>packageType</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems &&
              currentItems.map((cate, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cate.categoriesId}</td>
                    <td>{cate.brandName}</td>
                    <td>{cate.ageRange}</td>
                    <td>{cate.subCategories}</td>
                    <td>{cate.packageType}</td>
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
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </Table>
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
      </div>

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

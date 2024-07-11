import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";

import * as Yup from "yup";
import { useFormik } from "formik";
import { FaPlusCircle } from "react-icons/fa";
import {
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "../../../Service/PromotionService/PromotionService";
import { usePromotionManger } from "../../../Store/Hooks/Hooks";
import { ToastContainer, toast } from "react-toastify";
import { FaPen, FaTrash } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import "../Categories/Categories"
export default function Promotion() {
  const [show, setShow] = useState(false);
  const { listPromotion, getAllPromotion } = usePromotionManger();
  const [pageIndex, setPageIndex] = useState(1);
  const [action, setAction] = useState("");
  const [currentPromotion, setCurrentPromotion] = useState();
  // const [ endOffset, pageCount, listOfSet ] = usePagination(listOrchil,8)
  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1);
    // setPageIndex(+event.selected+1)
  };
  const handleShow = (promotion, action) => {
    setShow(true);
    setAction(action);
    setCurrentPromotion(promotion);
  };
  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const handDeleteButton = async (promtionID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    try {
      if (confirmed) {
        const res = await deletePromotion(promtionID);
        if (res) {
          await getAllPromotion();
          toast.success("delete success", {
            autoClose: 1500,
          });
        } else {
          toast.error("delete failed", {
            autoClose: 1500,
          });
        }
      }
    } catch (error) {
      console.log("loiixo delete promotion", error);
    }
  };

  // Hàm để lấy ngày hiện tại (định dạng "YYYY-MM-DD")
  const today = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      promotionId: "",
      name: "",
      discountType: "",
      discountValue: 0,
      startDate: "",
      endDate: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .matches(/^[\p{L}\s]+$/u, "Name must contain only letters and spaces"),
      discountType: Yup.string()
        .required("Discount type is required")
        .matches(/^[\p{L}\s]+$/u, "Discount type must contain only letters"),
      discountValue: Yup.number()
        .required("Discount value is required")
        .positive("Discount value must be greater than 0"),
      startDate: Yup.date()
        .required("Start date is required")
        .min(today, "Start date cannot be in the past and now"),
      endDate: Yup.date()
        .required("End date is required")
        .min(
          Yup.ref("startDate"),
          "End date must be at least one day after start date"
        )
        .test(
          "is-later",
          "End date must be at least one day after start date",
          function (value) {
            const { startDate } = this.parent;
            if (startDate && value) {
              const start = new Date(startDate);
              const end = new Date(value);
              return end >= start && end >= start.setDate(start.getDate() + 1);
            }
            return true;
          }
        ),
    }),

    onSubmit: async (values) => {
      try {
        if (!action) {
          setShow(false);
          const ress = await createPromotion(values);
          if (ress) {
            await getAllPromotion();
            toast.success("add promotion success", {
              autoClose: 1500,
            });
            console.log("listpro", listPromotion);
            formik.resetForm();
          } else {
            toast.error("add promotion failed", {
              autoClose: 1500,
            });
          }
        } else if (action === "update") {
          setShow(false);
          const res = await updatePromotion(values.promotionId, values);
          if (res) {
            await getAllPromotion();
            toast.success("update promotion success", {
              autoClose: 1500,
            });
            console.log("listpro", listPromotion);
            formik.resetForm();
          } else {
            toast.error("update promotion failed", {
              autoClose: 1500,
            });
          }
        }
      } catch (error) {
        console.log("error add promotion", error);
      }
    },
  });

  useEffect(() => {
    const res = async () => {
      await getAllPromotion();
    };
    res();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (currentPromotion) {
      formik.setValues({
        promotionId: currentPromotion.promotionId,
        name: currentPromotion.name,
        discountType: currentPromotion.discountType,
        discountValue: currentPromotion.discountValue,
        startDate: formatDate(currentPromotion.startDate),
        endDate: formatDate(currentPromotion.endDate),
      });
      console.log('bla',formatDate(currentPromotion.endDate))
    }
  }, [currentPromotion]);
  return (
    <>
      <ToastContainer />
      <div className="header-categories">
        <div className="search-form-categories">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>Manager promotion</h4>
        </div>

        <div className="button-categories">
          <div className="sub-button-categories" onClick={handleShow}>
            <label htmlFor="test" className="btn btn-success">
              <FaPlusCircle style={{ paddingBottom: "3px" }} /> Add Promotion
            </label>
          </div>
        </div>
        {/* <div className="button-categories">
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
              data={listStaffExport}
              filename={"Staff.csv"}
              className="btn btn-secondary"
              asyncOnClick={true}
              onClick={getStaffExport}
            >
              <i className="fa-solid fa-download"></i> Export
            </CSVLink>
          </div>
        </div> */}
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
              <th>PromotinID</th>
              <th>Prmotion name</th>
              <th>discountType</th>
              <th>discountValue</th>
              <th>start day</th>
              <th>end day</th>
              <th>action</th>
            </tr>
          </thead>

          {listPromotion ? (
            <tbody>
              {listPromotion.map((promot, index) => (
                <tr key={index}>
                  <td>{promot.promotionId}</td>
                  <td>{promot.name}</td>
                  <td>{promot.discountType}</td>
                  <td>{promot.discountValue}</td>
                  <td>{promot.startDate}</td>
                  <td>{promot.endDate}</td>
                  <td>
                    <FaPen onClick={() => handleShow(promot, "update")} />{" "}
                    <FaTrash
                      style={{ marginLeft: "5px" }}
                      onClick={() => handDeleteButton(promot.promotionId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <h1 style={{ color: "red", margin: "0 auto" }}>
              There no one at all
            </h1>
          )}
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={1}
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
          <Modal.Title>Acting Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>name</Form.Label>
              <Form.Control
                type="text"
                placeholder="name promotion"
                autoFocus
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {formik.errors.name && (
              <p style={{ color: "red", margin: "0" }}>{formik.errors.name}</p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>discountType</Form.Label>
              <Form.Control
                type="text"
                placeholder="discountType promotion vd:theo tháng"
                autoFocus
                name="discountType"
                value={formik.values.discountType}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {formik.errors.discountType && (
              <p style={{ color: "red", margin: "0" }}>
                {formik.errors.discountType}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>discountValue</Form.Label>
              <Form.Control
                type="text"
                placeholder="discountValue promotion"
                autoFocus
                name="discountValue"
                value={formik.values.discountValue}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {formik.errors.discountValue && (
              <p style={{ color: "red", margin: "0" }}>
                {formik.errors.discountValue}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>startDate</Form.Label>
              <Form.Control
                type="date"
                placeholder="startDate promotion"
                autoFocus
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {formik.errors.startDate && (
              <p style={{ color: "red", margin: "0" }}>
                {formik.errors.startDate}
              </p>
            )}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>endDate</Form.Label>
              <Form.Control
                type="date"
                placeholder="endDate promotion"
                autoFocus
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {formik.errors.endDate && (
              <p style={{ color: "red", margin: "0" }}>
                {formik.errors.endDate}
              </p>
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

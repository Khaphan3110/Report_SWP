import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Papa from "papaparse";
import ReactPaginate from "react-paginate";
import {
  useAdminProfile,
  useCateGories,
  useStaffManager,
} from "../../../Store";
import "../Categories/Categories.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  DeleteCategories,
  UpdateCategories,
} from "../../../Service/CateService/CateService";
import { deleteStaff, GetAllStaff, StaffRegister } from "../../../Service/StaffService/StaffService";
export default function Categories() {
  const [listStaffExport, setListStaffExport] = useState([]);
  const [show, setShow] = useState(false);
  const {
    listCategories,
    setListCategoreis,
    FunImportCateGories,
    getAllCategoreis,
    errorNumber,
  } = useCateGories();
  const { getStaffPinagine, listStaff, setListStaff } = useStaffManager();
  const { StaffProfile } = useAdminProfile();
  const [pageIndex, setPageIndex] = useState(1);
  const [sst, setSST] = useState(0);
  const getStaffExport = async (event, done) => {
    const result = [];
    const res = await GetAllStaff(StaffProfile.adminToken)
    if (res && res.data.length > 0) {
      result.push([
        "idStaff",
        "userName",
        "fullName",
        "email",
        "phoneNumber",
      ]);
      console.log("staff",res.data)
      res.data.map((staff, index) => {
        let arr = [];
        arr[0] = staff.id;
        arr[1] = staff.userName;
        arr[2] = staff.fullName;
        arr[3] = staff.email;
        arr[4] = staff.phoneNumber;
        result.push(arr);
      });
      setListStaffExport(result);
      done();
    } else {
      toast.error("Can not export file cate");
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
          if (rawCSV[0] && rawCSV[0].length === 7) {
            if (
              rawCSV[0][0] !== "firstName" ||
              rawCSV[0][1] !== "lastName" ||
              rawCSV[0][2] !== "email" ||
              rawCSV[0][3] !== "phoneNumber" ||
              rawCSV[0][4] !== "userName" ||
              rawCSV[0][5] !== "password" ||
              rawCSV[0][6] !== "confirmPassword"
            ) {
              toast.error("sai format của dữ liệu trong file!");
            }
            {
              let result = [];
              rawCSV.map((staff, index) => {
                if (index > 0 && staff.length === 7) {
                  let staffObj = {};
                  staffObj.firstName = staff[0];
                  staffObj.lastName = staff[1];
                  staffObj.email = staff[2];
                  staffObj.phoneNumber = staff[3];
                  staffObj.userName = staff[4];
                  staffObj.password = staff[5];
                  staffObj.confirmPassword = staff[6];
                  result.push(staffObj);
                }
              });

              const res = await StaffRegister(result, StaffProfile.adminToken);
              if (res) {
                toast.success("Register staff success !!");
              } else {
                toast.error("Register staff failed");
              }
              await getStaffPinagine(pageIndex, 8, StaffProfile.adminToken);
            }
          }
        },
      });
    }
  };

  // const [ endOffset, pageCount, listOfSet ] = usePagination(listOrchil,8)
  const handlePageClick = (event) => {
    setPageIndex(+event.selected+1);
    // setPageIndex(+event.selected+1)
  };

  const handleClose = () => setShow(false);

  const handDeleteButton = (staffID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmed) {
      const res = deleteStaff(staffID,StaffProfile.adminToken);
      if(res){
        getStaffPinagine(pageIndex, 8, StaffProfile.adminToken);
        toast.success("delete success!", {
          autoClose: 1500,
        });
      } else {
        toast.error("delete failed!", {
          autoClose: 1500,
        });
      }    
    }
  };

  useEffect(() => {
    getStaffPinagine(pageIndex, 8, StaffProfile.adminToken);
  }, [pageIndex]);
  return (
    <>
      <ToastContainer />
      <div className="header-categories">
        <div className="search-form-categories">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>List Staff</h4>
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
              data={listStaffExport}
              filename={"Staff.csv"}
              className="btn btn-secondary"
              asyncOnClick={true}
              onClick={getStaffExport}
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
              <th>id</th>
              <th>role</th>
              <th>userName</th>
              {/* <th>password</th> */}
              <th>fullName</th>
              <th>email</th>
              <th>phoneNumber</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listStaff.items &&
              listStaff.items.map((Staff, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{Staff.id}</td>
                  <td>{Staff.role}</td>
                  <td>{Staff.userName}</td>
                  {/* <td>{Staff.password}</td> */}
                  <td>{Staff.fullName}</td>
                  <td>{Staff.email}</td>
                  <td>{Staff.phoneNumber}</td>
                  <td>
                    <Button
                      variant="danger"
                      className="action-button"
                      onClick={() => handDeleteButton(Staff.id)}
                      style={{ border: "0", padding: "5px" }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={listStaff.pageCount}
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
  );
}

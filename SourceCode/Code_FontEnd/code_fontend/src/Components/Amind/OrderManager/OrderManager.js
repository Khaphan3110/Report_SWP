import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { deleteStaff, GetAllStaff, StaffRegister } from "../../../Service/StaffService/StaffService";
import { toast, ToastContainer } from "react-toastify";
import Papa from "papaparse";
import { useAdminProfile, useCateGories, useOrderManager, useStaffManager } from "../../../Store";
import { CSVLink } from "react-csv";
import "../Categories/Categories.css";
export default function OrderManager() {
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

  const {listOrder,getOrderPagin} = useOrderManager()
  const getStaffExport = async (event, done) => {
    const result = [];
    const res = await GetAllStaff(StaffProfile.adminToken);
    if (res && res.data.length > 0) {
      result.push(["idStaff", "userName", "fullName", "email", "phoneNumber"]);
      console.log("staff", res.data);
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

  // const [ endOffset, pageCount, listOfSet ] = usePagination(listOrchil,8)
  const handlePageClick = (event) => {
    setPageIndex(+event.selected + 1);
    // setPageIndex(+event.selected+1)
  };

  const handleClose = () => setShow(false);

  const handDeleteButton = (staffID) => {

  };

  

  useEffect(() => {
    getOrderPagin(pageIndex,8);
  },[])

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
          <h4>Order Manager</h4>
        </div>

        <div className="button-categories">
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
              <th>OrderID</th>
              <th>role</th>
              <th>userName</th>
              <th>password</th>
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
                  <td>{Staff.password}</td>
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
        pageCount={listOrder.pageCount}
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

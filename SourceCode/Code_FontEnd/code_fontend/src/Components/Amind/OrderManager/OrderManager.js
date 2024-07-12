import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import { GetAllStaff } from "../../../Service/StaffService/StaffService";
import {
  useAdminProfile,
  useCateGories,
  useOrderManager,
  useStaffManager,
} from "../../../Store";
import "../Categories/Categories.css";
import "./OrderManager.css";
import {
  GetOrderPigingTrackingMember,
  GetOrderPigingWithStatus,
} from "../../../Service/OrderService/OrderService";
import PreOrderManager from "./PreOrderManager";
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

  const { listOrder, getOrderPagin, listCurrentOrder, setlistCurrentOrder } =
    useOrderManager();
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

  const handDeleteButton = (staffID) => {};

  useEffect(() => {
    const fetchDataOrderCurrent = async () => {
      try {
        const resData = await GetOrderPigingWithStatus(1, pageIndex, 6);
        if (resData) {
          setlistCurrentOrder(resData.data);
        } else {
          setlistCurrentOrder([]);
        }
      } catch (error) {
        console.log("error current list order", error);
      }
    };
    fetchDataOrderCurrent();
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
      {listCurrentOrder.items && listCurrentOrder.items.length > 0 ? (
        <>
        <PreOrderManager listOrder = {listCurrentOrder} page={pageIndex}/>
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={listCurrentOrder.pageCount}
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
      ) : (
        <p style={{margin:"0",fontWeight:"bold",textAlign:"center"}}>There's no Order now</p>
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import { PreorderPagingMemberWithStatus } from "../../../Service/PreorderService/PreorderService";
import {
  GetAllStaff
} from "../../../Service/StaffService/StaffService";
import {
  useAdminProfile,
  useCateGories,
  usePreorder,
  useStaffManager,
} from "../../../Store";
import "../Categories/Categories.css";
import PrePreorderManager from "./PrePreorderManager";
export default function PreorderManager() {
  const [listStaffExport, setListStaffExport] = useState([]);
  const [show, setShow] = useState(false);

  const { StaffProfile } = useAdminProfile();
  const [pageIndex, setPageIndex] = useState(1);

  const { listCurrentPreOrder, setlistCurrentPreOrder } = usePreorder();
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



  useEffect(() => {
    const fetchdata = async () => {
      try {
        const resData = await PreorderPagingMemberWithStatus(1, pageIndex, 6);
        console.log('pre',resData.data)
        if (resData) {
          setlistCurrentPreOrder(resData.data);
        } else {
          setlistCurrentPreOrder({});
        }
      } catch (error) {
        console.log("error comfirm preorder", error);
      }
    };
    fetchdata();
  },[pageIndex])
  console.log('preorder',listCurrentPreOrder)

  const isNotEmpty = (obj) => {
    return Object.keys(obj).length !== 0;
  };
  return (
    <>
      <ToastContainer />
      <div className="header-categories">
        <div className="search-form-categories">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>Manager Preorder</h4>
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

      {isNotEmpty(listCurrentPreOrder) ? (
        <>
        <PrePreorderManager listPreorder= {listCurrentPreOrder} page = {pageIndex} />
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={listCurrentPreOrder.pageCount}
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
        <h4 style={{margin:"0",fontWeight:'bold',textAlign:"center"}}>There's is not Preorder Now</h4>
      )}
    </>
  );
}

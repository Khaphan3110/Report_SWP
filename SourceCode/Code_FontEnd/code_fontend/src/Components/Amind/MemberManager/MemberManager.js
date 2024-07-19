import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { DeleteMember, GetAllMember } from '../../../Service/UserService/UserService';
import { useAdminProfile, useMemberManager } from '../../../Store/Hooks/Hooks';
import "../Categories/Categories.css"
export default function MemberManager() {
  const [show, setShow] = useState(false);
  const [pageIndex, setPageindex] = useState(1)
  const { getMemberPagingController, listMember, setlistMember } = useMemberManager()
  const [listMemberExport, setlistMemberExport] = useState([])
  const { StaffProfile } = useAdminProfile()
  const getMemberExport = async (event, done) => {
    try {
      const result = [];
      const res = await GetAllMember(StaffProfile.adminToken);
      if (res && res.data.length > 0) {
        result.push([
          "memberId",
          "lastName",
          "firstName",
          "email",
          "phoneNumber",
          "userName",
          "registrationDate",
        ]);
        res.data.map((member, index) => {
          let arr = [];
          arr[0] = member.memberId;
          arr[1] = member.lastName;
          arr[2] = member.firstName;
          arr[3] = member.email;
          arr[4] = member.phoneNumber ? member.phoneNumber:"Chưa đăng ký SDT";
          arr[5] = member.userName;
          arr[6] = member.registrationDate;
          result.push(arr);
        });
        setlistMemberExport(result)
        done();
      } else {
        toast.error("export member is failed")
      }
    } catch (error) {
      console.log("error export ", error)
    }
  };

  const res = async () => {
    try {
      await getMemberPagingController(pageIndex, 6);
    } catch (error) {
      console.log("loi r", error)
    }
  }
  useEffect(() => {
    res();
    getMemberExport()
  }, [pageIndex])

  const handlePageClickPre = (event) => {
    setPageindex(+event.selected + 1);
    // setPageIndex(+event.selected+1)
  };


  const handDeleteButton = async (memberID) => {
    try {
      const res = await DeleteMember(memberID,StaffProfile.adminToken)
      if(res){
        await getMemberPagingController(pageIndex, 6);
        toast.success("Delete success !!",{
          autoClose:1000,
        })
      } else {
        toast.error("Delete is failed!!!",{
          autoClose:1000
        })
      }
    } catch (error) {
      console.log("error delete member", error)
    }
  }
  // console.log("list member", listMember.items)
  return (
    <>
      <ToastContainer />
      <div className="header-categories">
        <div className="search-form-categories">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>List Members</h4>
        </div>

        <div className="button-categories">

          <div className="sub-button-categories">
            <CSVLink
              data={listMemberExport}
              filename={"Member.csv"}
              className="btn btn-secondary"
              asyncOnClick={true}
              onClick={getMemberExport}
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
              <th>MemberID</th>
              <th>email</th>
              <th>phoneNumber</th>
              <th>lastName</th>
              <th>firstName</th>
              <th>userName</th>

              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listMember && listMember.items.length > 0 ? (
              listMember.items.map((member, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{member.memberId}</td>
                  <td>{member.email}</td>
                  <td>{member.phoneNumber ? member.phoneNumber : ("chưa đăng ký SDT")}</td>
                  <td>{member.lastName}</td>
                  <td>{member.firstName}</td>
                  <td>{member.userName}</td>

                  <th>
                    <Button
                      variant="danger"
                      className="action-button"
                      onClick={() => handDeleteButton(member.memberId)}
                    >
                      Delete
                    </Button>
                  </th>
                </tr>
              ))
            ) : (null)}
          </tbody>
        </Table>
      </div>
      <div style={{ display: "flex", justifyContent: "end", marginRight: '10px' }}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="sau >"
          onPageChange={handlePageClickPre}
          pageRangeDisplayed={2}
          pageCount={listMember.items}
          marginPagesDisplayed={1}
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

    </>
  )
}

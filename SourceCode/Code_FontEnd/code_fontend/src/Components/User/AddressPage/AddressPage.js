import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserProfile } from "../../../Store";
import AddressForm from "./AddressForm";
import "./AddressPage.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { deleteUserAddress, updatePhoneNumberOfUser } from "../../../Service/UserService/UserService";
import ReactPaginate from "react-paginate";
const AddressPage = () => {
  const [currentAddressesID, setCurrentAddressesID] = useState(null);
  // const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const {
    userProfile,
    setUserProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useUserProfile();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  const [acting,setActing] = useState("");
  // const handleSaveAddress = (newAddress) => {
  //   if (currentAddress) {
  //     setAddresses(
  //       addresses.map((addr) => (addr === currentAddress ? newAddress : addr))
  //     );
  //   } else {
  //     setAddresses([...addresses, newAddress]);
  //   }
  //   setIsFormVisible(false);
  //   setCurrentAddress(null);
  // };

  const handleEditAddress = ( address ) => {
    setCurrentAddressesID(address);
    setIsFormVisible(true);
  };

  const handleDeleteAddress = async (addressID) => {
    if (window.confirm("bạn có chắc muốn xóa địa chỉ này không?")) {
      const res = deleteUserAddress(addressID,userProfile.userToken);
      console.log('adress',res)
      if(res === 200){
         await getAllAdressByToken(userProfile.userToken);
        toast.success("xóa thành công!",{
          autoClose:1500,
        })
      } else {
        toast.error("server đang lag đợi 5s rồi tiếp tục!!!",{
          autoClose:1500,
        })
      }
      
  } else {
      // User clicked "Cancel"
      toast.error("bạn đã hủy xóa địa chỉ!",{
        autoClose:1000,
      })
  }
  }

  const handleAddAddress = () => {
    setCurrentAddress(null);
    setIsFormVisible(true);
    setActing("add")
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setCurrentAddress(null);
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      firstName: "",
      lastName: "",
    },

    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .required("không được bỏ trống số điện thoại!")
        .matches(
          /^\d{10,}$/,
          "phải nhập chữ số kh được nhập ký tự đủ 10 chữ số"
        ),
    }),

    onSubmit: async (values) => {
      try {
        const res = await updatePhoneNumberOfUser(
          userProfile.userToken,
          values
        );
        if (res) {
          toast.success("lưu số điện thoại thành công", {
            autoClose: 1500,
          });
          await getUserProfileByToken(userProfile.userToken);
        }
      } catch (error) {
        console.log("có cái lỗi ở nhập phone ở adress page", error);
      }
    },
  });

  const [show, setShow] = useState(false);

  const handleClose = () => {
    if (!formik.errors.phoneNumber) {
      setShow(false);
    } else {
      toast.error("vui lòng nhập đầy đủ thông tin trước khi lưu", {
        autoClose: 1500,
      });
    }
  };
  const handleShow = () => setShow(true);

  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setcurrentItems] = useState([]);
  const [pageCount, setpageCount] = useState();

  useEffect(() => {
    if (userProfile.addresses && userProfile.addresses.length > 0) {
      const endOffset = itemOffset + 3;
      setcurrentItems(userProfile.addresses.slice(itemOffset, endOffset));
      setpageCount(Math.ceil(userProfile.addresses.length / 3));
    } else {
      console.log("kh co du lieu");
    }
  }, [userProfile.addresses, itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 3) % userProfile.addresses.length;
    setItemOffset(newOffset);
  };

  const handleAddressDefault = (address) => {
    addCurrentAddress(address);
    toast.success("đã đặt làm địa chỉ mặt định !!!", {
      autoClose: 1000,
    });
  };

  
  return (
    <Container className="mt-5">
      <Row>
        <ToastContainer />
        <Col md={3}>
          <Card>
            <Card.Header>TRANG TÀI KHOẢN</Card.Header>
            <Card.Body>
              <Card.Text>
                Xin chào, {userProfile && userProfile.profile.member.lastName}{" "}
                {userProfile && userProfile.profile.member.firstName}!
              </Card.Text>
              <Card.Link as={Link} to="/account">
                Thông tin tài khoản
              </Card.Link>
              <Card.Link as={Link} to="/addresses">
                Số địa chỉ
              </Card.Link>
              <Link to={"/logout"}>Đăng xuất</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header>ĐỊA CHỈ CỦA BẠN</Card.Header>
            <Card.Body>
              <Button
                variant="primary"
                className="mb-3"
                onClick={handleAddAddress}
              >
                Thêm địa chỉ
              </Button>
              {/* { addresses && addresses.map((adress,index) => { */}
              {userProfile && userProfile.addresses.length > 0 ? (
                <>
                  {currentItems.map((adress, index) => (
                    <>
                      <Row className="address-item mb-3" key={index}>
                        <Col>
                          <Card.Text>
                            <strong>Họ tên:</strong>{" "}
                            {userProfile && userProfile.profile.member.lastName}{" "}
                            {userProfile && userProfile.profile.member.firstName}{" "}
                            <br />
                            <strong>Địa chỉ:</strong>{" "}
                            {adress &&
                              adress.house_Number +
                                "," +
                                adress.street_Name +
                                "," +
                                adress.district_Name +
                                "," +
                                adress.city +
                                "," +
                                adress.region}{" "}
                            <br />
                            <strong>Số điện thoại:</strong>{" "}
                            {userProfile && userProfile.profile.member.phoneNumber}{" "}
                            <br />
                          </Card.Text>
                        </Col>
                        <Col md="auto" className="text-right">
                          <Button
                            variant="link"
                            // onClick={() => handleEditAddress(addr)}
                            onClick={() => handleAddressDefault(adress)}
                            className="button-crud-address-page"
                          >
                            Đặt làm địa chỉ mặt định
                          </Button>
                          <Button
                            variant="link"
                            onClick={handleShow}
                            className="button-crud-address-page"
                          >
                            Thêm số điện thoại
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => handleEditAddress(adress)}
                            className="button-crud-address-page"
                          >
                            Chỉnh sửa địa chỉ
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => handleDeleteAddress(adress.id)}
                            className="button-crud-address-page"
                          >
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    </>
                  ))}
                </>
              ) : (
                <Card.Text>
                  <h3 style={{color:"red"}}>hiện kh có địa chỉ nào cả , thêm nào</h3>
                </Card.Text>
              )}
            </Card.Body>
          </Card>
          <ReactPaginate
            breakLabel="..."
            nextLabel="sau >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
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
        </Col>
      </Row>
      <AddressForm
        show={isFormVisible}
        handleClose={handleCloseForm}
        initialData={currentAddressesID}
        acting = {acting}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm số điện thoại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="số điện thoại vd:0123"
                autoFocus
                name="phoneNumber"
                values={formik.values.phoneNumber}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {formik.errors.phoneNumber && (
              <p style={{ color: "red" }}>{formik.errors.phoneNumber}</p>
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                đóng
              </Button>
              <Button variant="success" type="submit" onClick={handleClose}>
                Lưu
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AddressPage;

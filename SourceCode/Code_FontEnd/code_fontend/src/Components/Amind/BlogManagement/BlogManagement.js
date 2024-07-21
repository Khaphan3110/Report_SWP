//BlogManagement

import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { DeleteMember } from '../../../Service/UserService/UserService';
import { useAdminProfile, useMemberManager } from '../../../Store/Hooks/Hooks';
import "../Categories/Categories.css";
import { cateGetAllNoPaginate } from '../../../Service/CateService/CateService';
import * as Yup from "yup"
import { useFormik } from 'formik';
import { createBlog, DeleteBlog, updateBlog } from '../../../Service/BlogService/BlogService';
export default function BlogManagement() {
    const [show, setShow] = useState(false);
    const [pageIndex, setPageindex] = useState(1)
    const { getMemberPagingController, listMember, setlistMember } = useMemberManager()
    const { StaffProfile } = useAdminProfile()
    const [listCategories, setlistCategories] = useState()
    const [currentCate, setCurrentCate] = useState()
    const handlePageClickPre = (event) => {
        setPageindex(+event.selected + 1);
        // setPageIndex(+event.selected+1)
    };

    useEffect(() => {
        const resCate = async () => {
            try {
                const res = await cateGetAllNoPaginate()
                if (res) {
                    setlistCategories(res.data)
                }
            } catch (error) {
                console.log("error at cate blog", error)
            }
        }
        resCate();
    }, [])

    const handDeleteButton = async (memberID) => {
        try {
            const res = await DeleteMember(memberID, StaffProfile.adminToken)
            if (res) {
                await getMemberPagingController(pageIndex, 6);
                toast.success("Delete success !!", {
                    autoClose: 1000,
                })
            } else {
                toast.error("Delete is failed!!!", {
                    autoClose: 1000
                })
            }
        } catch (error) {
            console.log("error delete member", error)
        }
    }

    const handChooseCategories = (event) => {
        // console.log("even",event.target.value)
        setCurrentCate(event.target.value)
        formikCreate.setFieldValue("Categories", event.target.value)
    }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const formikCreate = useFormik({
        initialValues: {
            Title: "",
            Content: "",
            Categories: "",
        },

        validationSchema: Yup.object({
            Title: Yup.string()
                .min(5, "Title must be at least 5 characters long")
                .matches(/^(?![0-9])[\p{L}\s]+$/u, "Title cannot start with a number and must only contain letters and spaces.")
                .required("Title is required"),
            Content: Yup.string()
                .min(5, "Content must be at least 5 characters long")
                .max(255, "Content cannot exceed 255 characters")
                .matches(/^(?![0-9])[\p{L}\s]+$/u, "Content cannot start with a number and must only contain letters and spaces.")
                .required("Content is required")
        }),

        onSubmit: async (values) => {
            setShow(false)
            try {
                const form = new FormData()
                form.append("Title", values.Title)
                form.append("Content", values.Content)
                form.append("Categories", values.Categories)
                const resCreate = await createBlog(StaffProfile.profileAdmin.id, StaffProfile.adminToken, form)
                if (resCreate) {
                    formikCreate.resetForm();
                    toast.success("create blog success!", {
                        autoClose: 1000,
                    })
                } else {
                    formikCreate.resetForm();
                    toast.error("create blog failed!,try choose cate again", {
                        autoClose: 1000,
                    })
                }
            } catch (error) {
                console.log("create blog error", error)
            }

        }
    })


    const formikUpdate = useFormik({
        initialValues: {
            Title: "",
            Content: "",
            Categories: "",
        },

        validationSchema: Yup.object({
            Title: Yup.string()
                .min(5, "Title must be at least 5 characters long")
                .matches(/^(?![0-9])[\p{L}\s]+$/u, "Title cannot start with a number and must only contain letters and spaces.")
                .required("Title is required"),
            Content: Yup.string()
                .min(5, "Content must be at least 5 characters long")
                .max(255, "Content cannot exceed 255 characters")
                .matches(/^(?![0-9])[\p{L}\s]+$/u, "Content cannot start with a number and must only contain letters and spaces.")
                .required("Content is required")
        }),

        onSubmit: async (values) => {
            setShow(false)
            try {
                const form = "bla"
                const resUpdate = await updateBlog(StaffProfile.profileAdmin.id, StaffProfile.adminToken, form)
                if (resUpdate) {
                    formikCreate.resetForm();
                    toast.success("create blog success!", {
                        autoClose: 1000,
                    })
                } else {
                    formikCreate.resetForm();
                    toast.error("create blog failed!,try choose cate again", {
                        autoClose: 1000,
                    })
                }
            } catch (error) {
                console.log("create blog error", error)
            }

        }
    })


    const deleteBlog = async (blogID) => {

        try {
            const Comfirm = window.confirm("Are you sure to delete this blog!!!")
            if (Comfirm) {
                const resDelete = await DeleteBlog(blogID);
                if (resDelete.status === 200) {
                    toast.success("delete blog success!", {
                        autoClose: 1000,
                    })
                } else {
                    toast.error("delete blog failed!", {
                        autoClose: 1000,
                    })
                }
            }

        } catch (error) {
            console.log("errot delete blog", error)
        }
    }
    // console.log('staff',StaffProfile)
    return (
        <>
            <ToastContainer />
            <div className="header-categories">
                <div className="search-form-categories">
                    {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
                    <h4>List Members</h4>
                </div>
                {currentCate ? (
                    <div onClick={handleShow} className="button-categories" style={{ marginRight: "10px" }}  >
                        <p className="btn btn-success" >Create Blog</p>
                    </div>
                ) : (<h5 style={{ color: "red", fontWeight: "bold", marginRight: "10px" }}>Choose cate before create</h5>)}

            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <div className="search-categories" >
                    <input
                        id="search-cate"
                        type="search"
                        name="search-categoreis"
                        placeholder="search"
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div>
                    <FloatingLabel controlId="floatingSelect" label="Choose Categories for blog">
                        <Form.Select aria-label="Floating label select example" onChange={handChooseCategories}>
                            <option value="">Choose Categories</option>
                            {listCategories && listCategories.length > 0 ? (
                                listCategories.map((cate, index) => (
                                    <option value={cate.brandName} key={index} >{cate.brandName}  {cate.ageRange}</option>
                                ))
                            ) : (null)}
                        </Form.Select>
                    </FloatingLabel>
                </div>
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formikCreate.handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Blog title</Form.Label>
                            <Form.Control
                                name='Title'
                                type="text"
                                placeholder="title"
                                autoFocus
                                value={formikCreate.values.Title}
                                onChange={formikCreate.handleChange}
                            />
                        </Form.Group>
                        {formikCreate.errors.Title && (<p style={{ margin: "0", color: "red" }}>{formikCreate.errors.Title}</p>)}

                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"

                        >
                            <Form.Label>Blog content</Form.Label>
                            <Form.Control as="textarea" rows={3} name='Content'
                                type="text"
                                placeholder="content"
                                autoFocus
                                value={formikCreate.values.Content}
                                onChange={formikCreate.handleChange} />
                        </Form.Group>
                        {formikCreate.errors.Content && (<p style={{ margin: "0", color: "red" }}>{formikCreate.errors.Content}</p>)}
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            {formikCreate.errors.Content || formikCreate.errors.Title ? (
                                null
                            ) : (
                                <Button variant="primary" type='submit'>
                                    Save Changes
                                </Button>)
                            }

                        </Modal.Footer>

                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}


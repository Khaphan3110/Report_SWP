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
import { createBlog, DeleteBlog, GetblogPaging, updateBlog } from '../../../Service/BlogService/BlogService';
import { FaRegTrashAlt, FaEyeDropper } from "react-icons/fa";
import "./BlogManagement.css"
export default function BlogManagement() {
    const [show, setShow] = useState(false);
    const [pageIndex, setPageindex] = useState(1)
    const { getMemberPagingController, listMember, setlistMember } = useMemberManager()
    const { StaffProfile } = useAdminProfile()
    const [listCategories, setlistCategories] = useState()
    const [currentCate, setCurrentCate] = useState()
    const [listblog, setListBlog] = useState()
    const [statusAction, setStatusAction] = useState()
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



    const handChooseCategories = (event) => {
        // console.log("even",event.target.value)
        setCurrentCate(event.target.value)
        formikCreate.setFieldValue("Categories", event.target.value)
    }


    const handleClose = () => setShow(false);
    const handleShow = (action) => {
        if (action === 'import') {
            setStatusAction("import")
            setShow(true)
        } else {
            formikCreate.setValues({
                Title: action.title,
                Content: action.content,
                categories: action.categories,
                blogID: action.id
            })
            setShow(true)
        }

    };

    const formikCreate = useFormik({
        initialValues: {
            blogID:"",
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
            if (statusAction === "import") {
                try {
                    const form = new FormData()
                    form.append("Title", values.Title)
                    form.append("Content", values.Content)
                    form.append("Categories", values.Categories)
                    const resCreate = await createBlog(StaffProfile.profileAdmin.id, StaffProfile.adminToken, form)
                    if (resCreate) {
                        formikCreate.resetForm();
                        getBlogPaging(pageIndex, 7);
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
            } else {
                try {
                    const res = await updateBlog(values.blogID, StaffProfile.adminToken, values)
                    if (res) {
                        formikCreate.resetForm();
                        getBlogPaging(pageIndex, 7);
                        toast.success("update blog success!", {
                            autoClose: 1000,
                        })
                    } else {
                        formikCreate.resetForm();
                        toast.error("update blog failed", {
                            autoClose: 1000,
                        })
                    }
                } catch (error) {
                    console.log("error at update blog", error)
                }
            }

        }
    })


    // const formikUpdate = useFormik({
    //     initialValues: {
    //         Title: "",
    //         Content: "",
    //         Categories: "",
    //     },

    //     validationSchema: Yup.object({
    //         Title: Yup.string()
    //             .min(5, "Title must be at least 5 characters long")
    //             .matches(/^(?![0-9])[\p{L}\s]+$/u, "Title cannot start with a number and must only contain letters and spaces.")
    //             .required("Title is required"),
    //         Content: Yup.string()
    //             .min(5, "Content must be at least 5 characters long")
    //             .max(255, "Content cannot exceed 255 characters")
    //             .matches(/^(?![0-9])[\p{L}\s]+$/u, "Content cannot start with a number and must only contain letters and spaces.")
    //             .required("Content is required")
    //     }),

    //     onSubmit: async (values) => {
    //         setShow(false)
    //         try {
    //             const form = "bla"
    //             const resUpdate = await updateBlog(StaffProfile.profileAdmin.id, StaffProfile.adminToken, form)
    //             if (resUpdate) {
    //                 formikCreate.resetForm();
    //                 getBlogPaging(pageIndex,7);
    //                 toast.success("create blog success!", {
    //                     autoClose: 1000,
    //                 })
    //             } else {
    //                 formikCreate.resetForm();
    //                 toast.error("create blog failed!,try choose cate again", {
    //                     autoClose: 1000,
    //                 })
    //             }
    //         } catch (error) {
    //             console.log("create blog error", error)
    //         }

    //     }
    // })


    const deleteBlog = async (blogID) => {

        try {
            const Comfirm = window.confirm("Are you sure to delete this blog!!!")
            if (Comfirm) {
                const resDelete = await DeleteBlog(blogID, StaffProfile.adminToken);
                if (resDelete.status === 200) {
                    getBlogPaging(pageIndex, 7)
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

    const getBlogPaging = async () => {
        try {
            const res = await GetblogPaging(pageIndex, 7);
            if (res) {
                setListBlog(res.data)
            }
        } catch (error) {
            console.log("get blog paging error", error)
        }
    }

    useEffect(() => {
        getBlogPaging();
    }, [pageIndex])
    // console.log("lisst blog", listblog)
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
                    <div onClick={() => handleShow("import")} className="button-categories" style={{ marginRight: "10px" }}  >
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
                            <th>id</th>
                            <th>staffId</th>
                            <th>categories</th>
                            <th>title</th>
                            <th>content</th>
                            <th>dateCreate</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listblog && listblog.items.length > 0 ? (
                            listblog.items.map((blog, index) => (
                                <tr key={index}>
                                    <td>{blog.id}</td>
                                    <td>{blog.staffId}</td>
                                    <td>{blog.categories}</td>
                                    <td>{blog.title}</td>
                                    <td>{blog.content}</td>
                                    <td>{blog.dateCreate}</td>
                                    <td >
                                        <FaEyeDropper
                                            variant="warming"
                                            className="action-button button-crud-blog"
                                            onClick={() => handleShow(blog)}

                                        >
                                        </FaEyeDropper>
                                        <FaRegTrashAlt
                                            variant="danger"
                                            className="action-button button-crud-blog"
                                            onClick={() => deleteBlog(blog.id)}
                                        >
                                        </FaRegTrashAlt>
                                    </td>
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
                    pageCount={listblog ? listblog.pageCount : null}
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


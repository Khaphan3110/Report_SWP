import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useOrderManager, usePreorder, useUserProfile } from "../../../Store";
import "./AccountPage.css";

import { toast } from "react-toastify";
import {
  PreorderPagingMemberTracking,
  updateStatusPreorder
} from "../../../Service/PreorderService/PreorderService";
import { useNavigate } from "react-router-dom";
export default function TrackingPreorder({ listPreorder, page }) {
  // console.log("lenght", listPreorder.items);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Mã đơn HÀNG</TableCell>
            <TableCell>Ngày Đặt</TableCell>
            <TableCell>TT vận chuyển</TableCell>
            <TableCell>Thành Tiền</TableCell>
            <TableCell>Trạng thái đơn hàng</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listPreorder.items &&
            listPreorder.items.map((preorder, index) => (
              <Row row={preorder} page={page} key={index} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Row({ row, page }) {
  const { getOrderPagin } = useOrderManager();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = useState();
  const { userProfile } = useUserProfile();
  const { listPreorder, setListPreOrder, addPreorderAgain, preOrderAgain } = usePreorder();
  console.log("row", row);
  useEffect(() => {
    if (row.status === 0) {
      setStatus("chưa thanh toán");
    } else if (row.status === 1) {
      setStatus("chờ sử lý và vận chuyển");
    } else if (row.status === 2) {
      setStatus("đơn hàng thành công");
    }
  }, [row.status]);

  const handleComplete = async (orderID) => {
    console.log("order", orderID);
    try {
      const res = await updateStatusPreorder(orderID, 2);
      // console.log("update", res.data);
      if (res.status === 200) {
        const res = await PreorderPagingMemberTracking(
          userProfile.profile.member.memberId,
          page,
          3
        );
        // console.log("preorder respone",res.data)
        if (res) {
          setListPreOrder(res.data);
          toast.success("hủy đơn hàng thành công", {
            autoClose: 1000,
          });
        } else {
          setListPreOrder([]);
          toast.success("hủy đơn hàng thành công", {
            autoClose: 1000,
          });
        }

      } else {
        toast.error("lỗi mạng", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.log("lỗi complete đơn hàng", error);
    }
  };

  const handCancelOrder = async (orderID) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");
    if (confirmed) {
      try {
        const resStatus = await updateStatusPreorder(orderID, -1);
        if (resStatus.status === 200) {
          const res = await PreorderPagingMemberTracking(
            userProfile.profile.member.memberId,
            page,
            3
          );
          // console.log("preorder respone",res.data)
          if (res) {
            setListPreOrder(res.data);
            toast.success("hủy đơn hàng thành công", {
              autoClose: 1000,
            });
          } else {
            setListPreOrder([]);
            toast.success("hủy đơn hàng thành công", {
              autoClose: 1000,
            });
          }

        } else {
          toast.error("mạng yếu đợi xíu", {
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.log("lỗi ở canle preorder", error);
      }
    }
  };

  const navigator = useNavigate()
  const handlePaymentAgain = (Preorder) => {
    try {
      console.log("dàdddddddddddddđ", Preorder)
      addPreorderAgain(Preorder)
      navigator("/payment/PreorderAgain")
    } catch (error) {
      console.log("error at tracking preorder again", error)
    }
  }
  console.log("preordernew", row);
  return (
    <React.Fragment>

      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.preorderId}</TableCell>
        <TableCell>{row.preorderDate}</TableCell>
        <TableCell>{row.shippingAddress}</TableCell>
        <TableCell>{row.price.toLocaleString()}</TableCell>
        <TableCell>{row.product.statusDescription === -1 ? "Chưa có hàng" : status}</TableCell>
        <TableCell>
          {status === "chưa thanh toán" ? (
            <button
              onClick={() => handlePaymentAgain(row)}
              className="tracking-button-order-user-complete"
            >
              Thanh Toán
            </button>
          ) : row.product.statusDescription === 1 ? (
            <button
              onClick={() => handleComplete(row.preorderId)}
              className="tracking-button-order-user-complete"
            >
              Đã Nhận Hàng
            </button>
          ) : (
            <button
              // onClick={() => handleComplete(row.preorderId)}
              className="tracking-button-order-user-complete"
            >
              Chưa có hàng
            </button>
          )}

          {status === "chưa thanh toán" ? (
            <button
              onClick={() => handCancelOrder(row.preorderId)}
              className="tracking-button-order-user-cancel"
            >
              Hủy Đơn Hàng
            </button>
          ) : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Thông Tin Sản Phẩm
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Tổng Tiền đ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.product && (
                    <TableRow>
                      <TableCell>{row.product.productName}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>
                        {row.product.price.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

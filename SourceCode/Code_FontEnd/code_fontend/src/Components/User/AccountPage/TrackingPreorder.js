import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./AccountPage.css";
import { updateStatusOrder } from "../../../Service/OrderService/OrderService";
import { useOrderManager, useUserProfile } from "../../../Store";
import { toast, ToastContainer } from "react-toastify";
export default function TrackingPreorder({ listPreorder, page }) {
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
              <Row row={listPreorder} page={page} />
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
  useEffect(() => {
    if (row.orderStatus === 0) {
      setStatus("chưa thanh toán");
    } else if (row.orderStatus === 1) {
      setStatus("chờ sử lý");
    } else if (row.orderStatus === 2) {
      setStatus("đang giao hàng");
    } else if (row.orderStatus === 3) {
      setStatus("đơn hàng thành công");
    }
  }, [row.orderStatus]);

  const handleComplete = async (orderID) => {
    console.log("order", orderID);
    const newStatus = {
      newStatus: 3,
    };
    try {
      const res = await updateStatusOrder(orderID, newStatus);
      console.log("update", res.data);
      if (res) {
        await getOrderPagin(userProfile.profile.member.memberId, page, 3);
        toast.success("đơn hàng đã hoàn thành", {
          autoClose: 1000,
        });
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
    console.log("order hủy", orderID);
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");
    const newStatus = {
      newStatus: 3,
    };
    try {
      if (confirmed) {
        const res = await updateStatusOrder(orderID, newStatus);
        console.log("delete", res.data);
        if (res) {
          await getOrderPagin(userProfile.profile.member.memberId, page, 3);
          toast.success("đơn hàng đã hủy", {
            autoClose: 1000,
          });
        } else {
          await getOrderPagin(userProfile.profile.member.memberId, page, 3);
          toast.error("lỗi mạng", {
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.log("lỗi delete đơn hàng đơn hàng", error);
    }
  };
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
        <TableCell>{row.orderId}</TableCell>
        <TableCell>{row.orderDate}</TableCell>
        <TableCell>{row.shippingAddress}</TableCell>
        <TableCell>{row.totalAmount.toLocaleString()}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>
          <button
            onClick={() => handleComplete(row.orderId)}
            className="tracking-button-order-user-complete"
          >
            Đã Nhận Hàng
          </button>
          {status === "chưa thanh toán" ? (
            <button
              onClick={() => handCancelOrder(row.orderId)}
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

                      <TableRow >
                        <TableCell>{row.product.productName}</TableCell>
                        <TableCell>{row.product.productName}</TableCell>
                        <TableCell>{row.price.toLocaleString()}</TableCell>
                      </TableRow>
                   
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

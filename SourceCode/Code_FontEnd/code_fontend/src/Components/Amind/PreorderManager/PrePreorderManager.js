//PrePreorderManager
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
import "../../User/AccountPage/AccountPage.css";
import { updateStatusOrder } from "../../../Service/OrderService/OrderService";
import { useOrderManager, usePreorder, useUserProfile } from "../../../Store";
import { toast, ToastContainer } from "react-toastify";
import {
  PreorderPagingMember,
  PreorderPagingMemberTracking,
  PreorderPagingMemberWithStatus,
  updateStatusPreorder,
} from "../../../Service/PreorderService/PreorderService";
import { getProductID } from "../../../Service/ProductService/ProductService";
import { toHaveAttribute } from "@testing-library/jest-dom/matchers";
export default function PrePreorderManager({ listPreorder, page }) {
  console.log("lenght", listPreorder.items);
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
  const {
    listPreorder,
    setListPreOrder,
    setlistCurrentPreOrder,
    listCurrentPreOrder,
  } = usePreorder();
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
    try {
      const resData = await updateStatusPreorder(orderID, 1);
      if (resData.status === 200) {
        const resDataPre = await PreorderPagingMemberWithStatus(1, page, 6);
        if (resDataPre) {
          setlistCurrentPreOrder(resDataPre.data);
        } else {
          setlistCurrentPreOrder({});
        }
        toast.success("comfirms success",{
            autoClose:1000,
        })
      } else {
        toast.error("Weak netword try again",{
            autoClose:1500,
        })
      }
    } catch (error) {
        console.log("error fetdata pre admin",error)
    }
  };
  console.log("item", row);

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
        <TableCell>{status}</TableCell>
        <TableCell>
          {status === "chờ sử lý và vận chuyển" && (
            <button
              onClick={() => handleComplete(row.preorderId)}
              className="tracking-button-order-user-complete"
            >
              Confirm
            </button>
          )}
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
                      <TableCell>1</TableCell>
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

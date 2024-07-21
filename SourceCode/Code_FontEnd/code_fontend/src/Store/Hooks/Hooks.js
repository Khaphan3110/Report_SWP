import {
  CreateContext,
  CategoriesContext,
  ProductContext,
  UserContext,
  AdminContext,
  StaffManagerContext,
  MemberManagerContext,
  OrderManagerContext,
  PromotionManagerContext,
  PreorderContext,
} from "../ContextConfig/Context";
import { useContext } from "react";

export const useStore = () => {
  const [state, dispatch] = useContext(CreateContext);
  return [state, dispatch];
};

export const useCateGories = () => {
  const {
    getAllCategoreisNopaginate,
    listCategories,
    setListCategoreis,
    FunImportCateGories,
    getAllCategoreis,
  } = useContext(CategoriesContext);
  return {
    getAllCategoreisNopaginate,
    listCategories,
    setListCategoreis,
    FunImportCateGories,
    getAllCategoreis,
  };
};

export const useProduct = () => {
  const {
    listProduct,
    setListProduct,
    getAllProductToContext,
    importProductList,
    getAllProduct,
  } = useContext(ProductContext);
  return {
    listProduct,
    setListProduct,
    getAllProductToContext,
    importProductList,
    getAllProduct,
  };
};

export const useUserProfile = () => {
  const {
    logOut,
    userProfile,
    setUserProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  } = useContext(UserContext);
  return {
    logOut,
    userProfile,
    setUserProfile,
    addCurrentAddress,
    getAllAdressByToken,
    updateUserToken,
    getUserProfileByToken,
  };
};

export const useAdminProfile = () => {
  const {
    StaffProfile,
    setStaffProfile,
    updateAdminToken,
    getAdminProfile,
    logoutAdmin,
  } = useContext(AdminContext);
  return {
    StaffProfile,
    setStaffProfile,
    updateAdminToken,
    getAdminProfile,
    logoutAdmin,
  };
};

export const useStaffManager = () => {
  const { listStaff, setListStaff, getStaffPinagine } =
    useContext(StaffManagerContext);
  return { listStaff, setListStaff, getStaffPinagine };
};

export const useOrderManager = () => {
  const { listOrder, setListOrder, getOrderPagin,listHistoryOrder,setListHistoryOrder,listCurrentOrder,setlistCurrentOrder,addOrderAgain,orderAgain, setOrderAgain } =
    useContext(OrderManagerContext);
  return { listOrder, setListOrder, getOrderPagin,listHistoryOrder,setListHistoryOrder,listCurrentOrder,setlistCurrentOrder,addOrderAgain,orderAgain, setOrderAgain };
};

export const useMemberManager = () => {
  const { listMember, setlistMember,getMemberPagingController } = useContext(MemberManagerContext);
  return { listMember, setlistMember,getMemberPagingController };
};

export const usePromotionManger = () => {
  const { listPromotion, setListPromotion, getAllPromotion } = useContext(
    PromotionManagerContext
  );
  return { listPromotion, setListPromotion, getAllPromotion };
};

export const usePreorder = () => {
  const {
    Preorder,
    addProductToPreorder,
    clearProductPreorder,
    addPromotion,
    calculateTotal,
    listPreorder,
    setListPreOrder,
    listPreorderHistory,setlistPreorderHistory,listCurrentPreOrder,setlistCurrentPreOrder,addPreorderAgain,preOrderAgain, setPreorderAgain
  } = useContext(PreorderContext);
  return {
    Preorder,
    addProductToPreorder,
    clearProductPreorder,
    addPromotion,
    calculateTotal,
    listPreorder,
    setListPreOrder,
    listPreorderHistory,setlistPreorderHistory,listCurrentPreOrder,setlistCurrentPreOrder,addPreorderAgain,preOrderAgain, setPreorderAgain
  };
};

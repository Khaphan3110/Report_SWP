import {
  CreateContext,
  CategoriesContext,
  ProductContext,
  UserContext,
  AdminContext,
  StaffManagerContext,
  MemberManagerContext,
  OrderManagerContext,
} from "../ContextConfig/Context";
import { useContext } from "react";

export const useStore = () => {
  const [state, dispatch] = useContext(CreateContext);
  return [state, dispatch];
};

export const useCateGories = () => {
  const {
    listCategories,
    setListCategoreis,
    FunImportCateGories,
    getAllCategoreis,
  } = useContext(CategoriesContext);
  return {
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
    addImageToProduct,
  } = useContext(ProductContext);
  return {
    listProduct,
    setListProduct,
    getAllProductToContext,
    importProductList,
    addImageToProduct,
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
  const { listStaff, setListStaff,getStaffPinagine } = useContext(StaffManagerContext);
  return { listStaff, setListStaff,getStaffPinagine };
};

export const useOrderManager = () => {
  const { listOrder, setListOrder } = useContext(OrderManagerContext);
  return { listOrder, setListOrder };
};

export const useMemberManager = () => {
  const { listMember, setlistMember } = useContext(MemberManagerContext);
  return { listMember, setlistMember };
};
import {
  CreateContext,
  CategoriesContext,
  ProductContext,
  UserContext,
  AdminContext,
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

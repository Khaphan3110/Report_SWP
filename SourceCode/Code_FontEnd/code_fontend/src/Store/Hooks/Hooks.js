import {
  CreateContext,
  CategoriesContext,
  ProductContext,
  UserContext,
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

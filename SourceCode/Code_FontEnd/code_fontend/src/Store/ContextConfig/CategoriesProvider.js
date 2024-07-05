import { useEffect, useState } from "react";
import { CategoriesContext } from "./Context";
import {
  cateGetAll,
  importCateGories,
} from "../../Service/CateService/CateService";
function CategoriesProvider({ children }) {
  const [listCategories, setListCategoreis] = useState({
    items: [],
    pageCount: 0,
  });
  const [errorNumber, seterrorNumber] = useState(0);

  const FunImportCateGories = async (listcateImport) => {
    try {
      const res = await importCateGories(listcateImport);
      if (res) {
        return res.status;
      }
    } catch (error) {
      console.log("lõi ở import cate", error);
    }
  };

  const getAllCategoreis = async (pageIndex, pageSize) => {
    try {
      const res = await cateGetAll(pageIndex, pageSize);
      if (res && res.status == 200) {
        setListCategoreis({
          items: res.data.items,
          pageCount: res.data.pageCount,
        });
      }
      return res.status;
    } catch (error) {
      console.log("lỗi ở get all cate!", error);
    }
  };



  return (
    <CategoriesContext.Provider
      value={{
        listCategories,
        setListCategoreis,
        FunImportCateGories,
        getAllCategoreis,
        errorNumber,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;

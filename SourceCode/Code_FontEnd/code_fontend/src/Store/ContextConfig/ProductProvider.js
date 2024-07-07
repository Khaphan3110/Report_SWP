import { useEffect, useState } from "react";
import {
  getProductByPinagine,
  importProduct,
  productGetAll,
} from "../../Service/ProductService/ProductService";
import { ProductContext } from "./Context";
import { imageGetAll } from "../../Service/ProductService/imageService";

function ProductProvider({ children }) {
  const [listProduct, setListProduct] = useState({
    items: [],
    pageCount: 0,
  });


  const getAllProductToContext = async (pageIndex, pageSize) => {
    try {
      const resProduct = await getProductByPinagine(pageIndex, pageSize);

      if (resProduct && (resProduct.status === 200 || resProduct.status === 201) && resProduct.data) {
        const items = resProduct.data.items || [];

        const productsWithImages = await Promise.all(
          items.map(async (product) => {
            try {
              const resImage = await imageGetAll(product.productId);
              return {
                ...product,
                images: resImage.data || [], // Ensure images is an array
              };
            } catch (imageError) {
              console.error(`Error fetching images for product ${product.productId}`, imageError);
              return {
                ...product,
                images: [], // Default to an empty array if there's an error
              };
            }
          })
        );

        setListProduct({
          items: productsWithImages,
          pageCount: resProduct.data.pageCount || 0,
        });
      } else {
        console.error("Unexpected response structure", resProduct);
        setListProduct({
          items: [],
          pageCount: 0,
        });
      }
    } catch (error) {
      console.log("Error in fetching all products", error);
      setListProduct({
        items: [],
        pageCount: 0,
      });
    }
  };

};

  const importProductList = async (listProduct) => {
    try {
      const res = await importProduct(listProduct);
      if (res || res.status === 200 || res.status === 201) {
        return res.status;
      }
    } catch (error) {
      console.log("loi import ", error);
    }
  };

  const getAllProduct = async () => {
    try {
      const res = await productGetAll();
      if(res){
        return res
      }
    } catch (error) {
      console.log("lỗi get all no paginate",error)
    }
  };

  // useEffect(() => {
  //     getAllProductToContext();
  // },[listProduct])
  return (
    <ProductContext.Provider
      value={{
        listProduct,
        setListProduct,
        getAllProductToContext,
        importProductList,
        getAllProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;

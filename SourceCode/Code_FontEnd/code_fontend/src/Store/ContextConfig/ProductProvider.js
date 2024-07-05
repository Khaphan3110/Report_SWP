import { useEffect, useState } from "react";
import { getProductByPinagine, importProduct, productGetAll } from "../../Service/ProductService/ProductService";
import { ProductContext } from "./Context";
import { imageGetAll } from "../../Service/ProductService/imageService";

function ProductProvider ({children}){
    
    const [listProduct, setListProduct] = useState(null);

    const getAllProductToContext = async (pageIndex, pageSize) => {
        try {
          const resProduct = await getProductByPinagine(pageIndex, pageSize);
          if (resProduct && (resProduct.status === 200 || resProduct.status === 201)) {
            const productsWithImages = await Promise.all(resProduct.data.items.map(async (product) => {
              const resImage = await imageGetAll(product.productId); // Assuming imageGetAll fetches images by product ID
              return {
                ...product,
                images: resImage.data // Adjust this based on your API response structure
              };
            }));
            
            setListProduct(productsWithImages);
          }
        } catch (error) {
          console.log("Error in fetching all products", error);
        }
      };

    const importProductList = async ( listProduct ) => {
        try {
            const res = await importProduct(listProduct);
            if( res || (res.status === 200 || res.status === 201)){
                return res.status;
            }
        } catch (error) {
            console.log("loi import ",error)
        }
    }

    const addImageToProduct = async () => {
        try {
            
        } catch (error) {
            
        }
    }

    // useEffect(() => {
    //     getAllProductToContext();
    // },[listProduct])
    return (
        <ProductContext.Provider value={{listProduct, setListProduct,getAllProductToContext,importProductList,addImageToProduct}}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider ;

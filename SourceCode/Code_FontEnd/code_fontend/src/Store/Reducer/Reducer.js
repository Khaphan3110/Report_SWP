import { GetAllPromotion } from "../../Service/PromotionService/PromotionService";
import {
  ADD_LISTTO_CART,
  REMOVE_ITEM_CART,
  CLEAR_CART,
  INCREATE_QUANTITY_CART,
  DECREASE_QUANTITY_CART,
  ADD_TO_CART_WITH_MULTIPLE_QUANTITY,
  ADD_PROMOTION_VALUES,
} from "./Constant";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
  promotion: JSON.parse(localStorage.getItem("promotion")) || {
    promotions: "PR0724003",
    promotionValues: 1,
  },
  total: JSON.parse(localStorage.getItem("total")) || 0,
  statusAddTocart: JSON.parse(localStorage.getItem("statusAddTocart")) || false,
};

function calculateTotal(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity * (1 - 1 / 100),
    0
  );
}

function reducer(state, action) {
  switch (action.type) {
    case ADD_PROMOTION_VALUES: {
      const { promotionID, promotionValues } = action.payload;
      const totalWithPromotion = state.total * (1 - promotionValues / 100); // Example: Assuming promotionValues is a discount percentage
      const promotion = {
        promotions: promotionID,
        promotionValues: promotionValues,
      };
      localStorage.setItem("total", JSON.stringify(totalWithPromotion));
      localStorage.setItem("promotion", JSON.stringify(promotionID));
      return { ...state, total: totalWithPromotion, promotion: promotion };
    }
    case INCREATE_QUANTITY_CART: {
      const { productid, quantity } = action.payload;

      // Update the quantity of the specified product
      const updatedCartIncrease = state.cartItems
        .map((item) => {
          if (item.productId === productid) {
            // Calculate new quantity
            const newQuantity = item.quantity + quantity;
            // Ensure quantity is not less than 1
            return newQuantity < 1
              ? null // Mark this item for removal
              : { ...item, quantity: newQuantity };
          }
          return item;
        })
        // Remove items marked as null (i.e., those with quantity less than 1)
        .filter((item) => item !== null);

      // Recalculate total
      const newTotalIncrease = calculateTotal(updatedCartIncrease);

      // Update local storage
      localStorage.setItem("cart", JSON.stringify(updatedCartIncrease));
      localStorage.setItem("total", JSON.stringify(newTotalIncrease));
      localStorage.setItem("statusAddTocart", JSON.stringify(true));

      return { cartItems: updatedCartIncrease, total: newTotalIncrease };
    }
    case DECREASE_QUANTITY_CART: {
      const { productId, qty } = action.payload;
      const updatedCartDecrease = state.cartItems.map((item) => {
        if (item.productId === productId) {
          // Ensure quantity does not go below 1
          const newQuantity = Math.max(item.quantity - qty, 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      const newTotalDecrease = calculateTotal(updatedCartDecrease);
      localStorage.setItem("cart", JSON.stringify(updatedCartDecrease));
      localStorage.setItem("total", JSON.stringify(newTotalDecrease));
      localStorage.setItem("statusAddTocart", JSON.stringify(true));
      return { cartItems: updatedCartDecrease, total: newTotalDecrease };
    }

    case ADD_LISTTO_CART:
      const { productadd, quantityadd } = action.payload;
      const existingProduct = state.cartItems.find(
        (item) => item.productId === productadd.productId
      );
      const updatedCartAdd = existingProduct
        ? state.cartItems.map((item) =>
            item.productId === productadd.productId
              ? { ...item, quantity: item.quantity + quantityadd }
              : item
          )
        : [...state.cartItems, { ...productadd, quantity: quantityadd }];
      const newTotalAdd = calculateTotal(updatedCartAdd);
      localStorage.setItem("cart", JSON.stringify(updatedCartAdd));
      localStorage.setItem("total", JSON.stringify(newTotalAdd));
      localStorage.setItem("statusAddTocart", JSON.stringify(true));
      return { cartItems: updatedCartAdd, total: newTotalAdd };

    case REMOVE_ITEM_CART:
      const productDelete = action.payload;
      const updatedCartRemove = state.cartItems.filter(
        (item) => item.productId !== productDelete.productId
      );
      const newTotalRemove = calculateTotal(updatedCartRemove);
      localStorage.setItem("cart", JSON.stringify(updatedCartRemove));
      localStorage.setItem("total", JSON.stringify(newTotalRemove));
      return { cartItems: updatedCartRemove, total: newTotalRemove };

    case CLEAR_CART:
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      return {
        cartItems: [],
        total: 0,
      };
    default:
      throw new Error("invalid action reducer");
  }
}

export { initialState };
export default reducer;

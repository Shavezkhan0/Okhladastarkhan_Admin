import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(
        (item) =>
          item.id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem = {
          id: action.payload._id,
          quantity:1,
          price: action.payload.price || 30,
          name: action.payload.name || "tshirt",
          size: action.payload.size || "XL",
          variant: action.payload.variant || "black",
        };
        state.cart.push(newItem);
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          state.cart = state.cart.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

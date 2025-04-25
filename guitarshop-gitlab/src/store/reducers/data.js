import {
  createReducer,
} from "@reduxjs/toolkit";

import {
  addProductToBasket,
  removeProductFromBasket,
  hideBasketNotificationModal,
  changeProductQuantity,
  setPromoCode,
} from "../actions/data";
import {
  getMockGuitars,
} from "../../mocks";
import {
  INCREMENT_STEP,
  ProductQuantityValue,
} from "../../const";

const initialState = {
  products: [
    ...getMockGuitars(),
  ],
  productsInBasket: [],
  isShowBasketNotificationModal: false,
  promoCode: ``,
};

export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(addProductToBasket, (state, action) => {
    const indexInBasket = state.productsInBasket.findIndex((item) => item.id === action.payload);

    if (indexInBasket < 0) {
      const product = state.products.find((item) => item.id === action.payload);

      state.productsInBasket = [
        ...state.productsInBasket,
        {
          ...product,
          quantity: ProductQuantityValue.MIN,
        },
      ];
    } else {
      const product = state.productsInBasket[indexInBasket];

      state.productsInBasket = [
        ...state.productsInBasket.slice(0, indexInBasket),
        {
          ...product,
          quantity: product.quantity + INCREMENT_STEP,
        },
        ...state.productsInBasket.slice(indexInBasket + 1),
      ];
    }

    state.isShowBasketNotificationModal = true;
  });

  builder.addCase(removeProductFromBasket, (state, action) => {
    const index = state.productsInBasket.findIndex((item) => item.id === action.payload);

    state.productsInBasket = [
      ...state.productsInBasket.slice(0, index),
      ...state.productsInBasket.slice(index + 1),
    ];
  });

  builder.addCase(hideBasketNotificationModal, (state) => {
    state.isShowBasketNotificationModal = false;
  });

  builder.addCase(changeProductQuantity, (state, action) => {
    const {
      id,
      quantity,
    } = action.payload;

    const index = state.productsInBasket.findIndex((item) => item.id === id);

    state.productsInBasket = [
      ...state.productsInBasket.slice(0, index),
      {
        ...state.productsInBasket[index],
        quantity,
      },
      ...state.productsInBasket.slice(index + 1),
    ];
  });

  builder.addCase(setPromoCode, (state, action) => {
    state.promoCode = action.payload;
  });
});

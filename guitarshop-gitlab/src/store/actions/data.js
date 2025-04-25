import {
  createAction,
} from "@reduxjs/toolkit";

import {
  StoreNameSpace,
} from "../../const";

const ActionType = {
  ADD_PRODUCT_TO_BASKET: `${StoreNameSpace.DATA}/addProductToBasket`,
  REMOVE_PRODUCT_FROM_BASKET: `${StoreNameSpace.DATA}/removeProductFromBasket`,
  HIDE_BASKET_NOTIFICATION_MODAL: `${StoreNameSpace.DATA}/hideBasketNotificationModal`,
  CHANGE_PRODUCT_QUANTITY: `${StoreNameSpace.DATA}/changeProductQuantity`,
  SET_PROMO_CODE: `${StoreNameSpace.DATA}/setPromoCode`,
};

export const addProductToBasket = createAction(ActionType.ADD_PRODUCT_TO_BASKET, (productID) => ({
  payload: productID,
}));

export const removeProductFromBasket = createAction(ActionType.REMOVE_PRODUCT_FROM_BASKET, (productID) => ({
  payload: productID,
}));

export const hideBasketNotificationModal = createAction(ActionType.HIDE_BASKET_NOTIFICATION_MODAL);

export const changeProductQuantity = createAction(ActionType.CHANGE_PRODUCT_QUANTITY, (data) => ({
  payload: data,
}));

export const setPromoCode = createAction(ActionType.SET_PROMO_CODE, (promoCode) => ({
  payload: promoCode,
}));

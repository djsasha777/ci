import {
  createSelector,
} from "@reduxjs/toolkit";

import {
  GuitarType,
  PRODUCTS_ON_PAGE_MAX_QUANTITY,
  StoreNameSpace,
  StringsInGuitarType,
} from "../const";
import {
  filterStrings,
  getDiscount,
  getSortFunction,
  getValueInRange,
} from "../utils";

const stringsArray = [
  ...new Set(Object.values(StringsInGuitarType).reduce((a, b) => a.concat(b)).sort((a, b) => a - b)),
];

const getProducts = (state) => state[StoreNameSpace.DATA].products;
const getProductsInBasket = (state) => state[StoreNameSpace.DATA].productsInBasket;
const getPromoCode = (state) => state[StoreNameSpace.DATA].promoCode;
const getCurrentPageNumber = (state) => state[StoreNameSpace.PAGE].currentPageNumber;
const getCurrentSortType = (state) => state[StoreNameSpace.PAGE].currentSortType;
const getCurrentSortDirection = (state) => state[StoreNameSpace.PAGE].currentSortDirection;
const getMinPriceFilter = (state) => state[StoreNameSpace.PAGE].minPriceFilter;
const getMaxPriceFilter = (state) => state[StoreNameSpace.PAGE].maxPriceFilter;
const getGuitarTypeFilter = (state) => state[StoreNameSpace.PAGE].guitarTypeFilter;
const getGuitarStringsFilter = (state) => state[StoreNameSpace.PAGE].guitarStringsFilter;
const getBasketAction = (state) => state[StoreNameSpace.PAGE].basketAction;

const getCurrentProducts = createSelector([
  getProducts,
  getCurrentSortType,
  getCurrentSortDirection,
  getMinPriceFilter,
  getMaxPriceFilter,
  getGuitarTypeFilter,
  getGuitarStringsFilter,
], (products, currentSortType, currentSortDirection, minPriceFilter, maxPriceFilter, guitarTypeFilter, guitarStringsFilter) =>
  products.filter(({
    price,
    type,
    strings,
  }) =>
    (getValueInRange(price, minPriceFilter, maxPriceFilter) === price) &&
    (guitarTypeFilter.length ? guitarTypeFilter.includes(type) : true) &&
    (guitarStringsFilter.length ? guitarStringsFilter.includes(strings) : true))
    .sort(getSortFunction(currentSortType, currentSortDirection)));

export const getProductsForCatalog = createSelector([
  getCurrentProducts,
  getCurrentPageNumber,
], (currentProducts, currentPageNumber) => {
  const sliceToIndex = currentPageNumber * PRODUCTS_ON_PAGE_MAX_QUANTITY;
  const sliceFromIndex = sliceToIndex - PRODUCTS_ON_PAGE_MAX_QUANTITY;
  const productsForCatalog = currentProducts.slice(sliceFromIndex, sliceToIndex).map(({
    id,
    name,
    popularity,
    price,
    rating,
    image: {
      forCatalog: href,
      description,
    },
  }) => ({
    id,
    name,
    popularity,
    price,
    rating,
    image: {
      href,
      description,
    },
  }));

  return {
    productsForCatalog,
  };
});

export const getMaxPageNumber = createSelector([
  getCurrentProducts,
], (products) => ({
  maxPageNumber: Math.ceil(products.length / PRODUCTS_ON_PAGE_MAX_QUANTITY),
}));

export const getPriceRange = createSelector([
  getProducts,
], (products) => {
  const prices = products.map((item) => item.price);
  const minPrice = prices.reduce((a, b) => a < b ? a : b);
  const maxPrice = prices.reduce((a, b) => a > b ? a : b);

  return {
    priceRange: {
      min: minPrice,
      max: maxPrice,
    },
  };
});

export const getGuitarTypeFilterParameters = createSelector([
  getGuitarTypeFilter,
], (guitarTypeFilter) => ({
  guitarTypeFilterParameters: Object.values(GuitarType).map((item) => ({
    guitarType: item,
    checked: guitarTypeFilter.includes(item),
  })),
}));

export const getStringsFilterParameters = createSelector([
  getGuitarTypeFilter,
  getGuitarStringsFilter,
], (guitarTypeFilter, guitarStringsFilter) => {
  const availableStrings = guitarTypeFilter.length ?
    filterStrings(stringsArray, guitarTypeFilter) :
    stringsArray;

  const stringsFilterParameters = stringsArray.map((item) => ({
    item,
    checked: guitarStringsFilter.includes(item),
    disabled: !availableStrings.includes(item),
  }));

  return {
    stringsFilterParameters,
  };
});

export const getBasketActionProduct = createSelector([
  getProducts,
  getBasketAction,
], (products, basketAction) => {
  const {
    id,
    article,
    name,
    type,
    strings,
    price,
    image: {
      forBasket: href,
      description,
    },
  } = products.find((item) => item.id === basketAction.productID);

  return {
    basketActionProduct: {
      id,
      article,
      name,
      type,
      strings,
      price,
      image: {
        href,
        description,
      },
    },
  };
});

export const getTotalPrice = createSelector([
  getProductsInBasket,
  getPromoCode,
], (productsInBasket, promoCode) => {
  let totalPrice = productsInBasket.length ?
    productsInBasket.map((item) => item.price * item.quantity).reduce((a, b) => a + b) :
    0;

  if (promoCode) {
    totalPrice = getDiscount(totalPrice, promoCode);
  }

  return {
    totalPrice,
  };
});

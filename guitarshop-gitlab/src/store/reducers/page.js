import {
  createReducer,
} from "@reduxjs/toolkit";

import {
  changeCatalogPage,
  changeMinPriceFilter,
  changeMaxPriceFilter,
  changeSortDirection,
  changeSortType,
  changeGuitarTypeFilter,
  changeStringsFilter,
  changeBasketAction,
} from "../actions/page";
import {
  CATALOG_PAGE_MIN_NUMBER,
  SortDirection,
  SortType,
} from "../../const";
import {
  filterStrings,
} from "../../utils";

const initialState = {
  currentPageNumber: CATALOG_PAGE_MIN_NUMBER,
  currentSortType: null,
  currentSortDirection: null,
  minPriceFilter: null,
  maxPriceFilter: null,
  guitarTypeFilter: [],
  guitarStringsFilter: [],
  basketAction: {
    productID: null,
    type: null,
  },
};

export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCatalogPage, (state, action) => {
    state.currentPageNumber = action.payload;
  });

  builder.addCase(changeSortType, (state, action) => {
    state.currentSortType = action.payload;

    if (!state.currentSortDirection) {
      state.currentSortDirection = SortDirection.ASCENDING;
    }
  });

  builder.addCase(changeSortDirection, (state, action) => {
    state.currentSortDirection = action.payload;

    if (!state.currentSortType) {
      state.currentSortType = SortType.PRICE;
    }
  });

  builder.addCase(changeMinPriceFilter, (state, action) => {
    state.minPriceFilter = action.payload;
  });

  builder.addCase(changeMaxPriceFilter, (state, action) => {
    state.maxPriceFilter = action.payload;
  });

  builder.addCase(changeGuitarTypeFilter, (state, action) => {
    const {
      guitarType,
      isAdd,
    } = action.payload;

    if (isAdd) {
      state.guitarTypeFilter = [
        ...state.guitarTypeFilter,
        guitarType,
      ];
    } else {
      const index = state.guitarTypeFilter.findIndex((item) => item === guitarType);

      state.guitarTypeFilter = [
        ...state.guitarTypeFilter.slice(0, index),
        ...state.guitarTypeFilter.slice(index + 1),
      ];
    }

    state.guitarStringsFilter = state.guitarTypeFilter.length ?
      filterStrings(state.guitarStringsFilter, state.guitarTypeFilter) :
      state.guitarStringsFilter;
  });

  builder.addCase(changeStringsFilter, (state, action) => {
    const {
      strings,
      isAdd,
    } = action.payload;

    if (isAdd) {
      state.guitarStringsFilter = [
        ...state.guitarStringsFilter,
        strings,
      ];

      return;
    }

    const index = state.guitarStringsFilter.findIndex((item) => item === strings);

    state.guitarStringsFilter = [
      ...state.guitarStringsFilter.slice(0, index),
      ...state.guitarStringsFilter.slice(index + 1),
    ];
  });

  builder.addCase(changeBasketAction, (state, action) => {
    if (!action.payload) {
      state.basketAction = {
        type: initialState.basketAction.type,
        productID: initialState.basketAction.productID,
      };

      return;
    }

    const {
      productID,
      type,
    } = action.payload;

    state.basketAction = {
      type,
      productID,
    };
  });
});

export const INCREMENT_STEP = 1;

export const CATALOG_PAGE_MIN_NUMBER = 1;

export const PRODUCTS_ON_PAGE_MAX_QUANTITY = 9;

export const RATING_STAR_WIDTH = 20;

export const PROMO_CODE_MAX_LENGTH = 14;

export const ProductQuantityValue = {
  MIN: 1,
  MAX: 99,
};

export const AppRoute = {
  ROOT: `/`,
  BASKET: `/basket`,
};

export const StoreNameSpace = {
  DATA: `data`,
  BASKET: `basket`,
  PAGE: `page`,
};

export const SortType = {
  PRICE: `price`,
  POPULARITY: `popularity`,
};

export const SortDirection = {
  ASCENDING: `ascending`,
  DESCENDING: `descending`,
};

export const GuitarType = {
  ACOUSTIC: `acoustic`,
  ELECTRIC: `electric`,
  UKULELE: `ukulele`,
};

export const BasketActionType = {
  ADD: `add`,
  REMOVE: `remove`,
};

export const guitarTypeCyrillicMap = {
  electric: `Электрогитара`,
  acoustic: `Акустическая гитара`,
  ukulele: `Укулеле`,
};

export const StringsInGuitarType = {
  [GuitarType.ACOUSTIC]: [
    6,
    7,
    12,
  ],
  [GuitarType.ELECTRIC]: [
    4,
    6,
    7,
  ],
  [GuitarType.UKULELE]: [
    4,
  ],
};

export const PromoCode = {
  GITARAHIT: `GITARAHIT`,
  SUPERGITARA: `SUPERGITARA`,
  GITARA2020: `GITARA2020`,
};

export const PromoCodeParameter = {
  [PromoCode.GITARAHIT]: {
    DISCOUNT_IN_PROPORTION: 0.1,
  },
  [PromoCode.SUPERGITARA]: {
    DISCOUNT_IN_RUBLE: 700,
  },
  [PromoCode.GITARA2020]: {
    DISCOUNT_IN_RUBLE: 3000,
    DISCOUNT_IN_PROPORTION_MAX_VALUE: 0.3,
  },
};

import {
  PromoCode,
  PromoCodeParameter,
  SortDirection,
  StringsInGuitarType,
} from "./const";

const ZEROES_IN_THOUSAND = 3;

export const formatPrice = (value) =>
  `${value}`.split(``).map((item, i, arr) =>
    (arr.length - i) % ZEROES_IN_THOUSAND ? item : ` ${item}`).join(``).trim();

export const getSortFunction = (sortType, sortDirection) => {
  switch (sortDirection) {
    case SortDirection.ASCENDING:
      return (a, b) => {
        if (a[sortType] > b[sortType]) {
          return 1;
        }

        if (a[sortType] < b[sortType]) {
          return -1;
        }

        return 0;
      };

    case SortDirection.DESCENDING:
      return (a, b) => {
        if (a[sortType] > b[sortType]) {
          return -1;
        }

        if (a[sortType] < b[sortType]) {
          return 1;
        }

        return 0;
      };

    default:
      return () => 0;
  }
};

export const removeNonDigits = (value) => value.replace(/\D/g, ``);

export const getValueInRange = (value, minValue, maxValue) => {
  if (value === null) {
    return null;
  }

  if (minValue && value < minValue) {
    return minValue;
  }

  if (maxValue && value > maxValue) {
    return maxValue;
  }

  return value;
};

export const filterStrings = (stringsArr, typesArr) =>
  stringsArr.filter((stringsItem) =>
    typesArr.some((typesItem) =>
      StringsInGuitarType[typesItem].includes(stringsItem)));

export const checkPromoCode = (promoCode) => Object.values(PromoCode).includes(promoCode);

export const getDiscount = (price, promoCode) => {
  let discountedPrice;

  switch (promoCode) {
    case PromoCode.GITARAHIT:
      const {
        DISCOUNT_IN_PROPORTION,
      } = PromoCodeParameter[PromoCode.GITARAHIT];

      discountedPrice = price - Math.floor(price * DISCOUNT_IN_PROPORTION);

      break;
    case PromoCode.SUPERGITARA:
      const {
        DISCOUNT_IN_RUBLE,
      } = PromoCodeParameter[PromoCode.SUPERGITARA];

      discountedPrice = price > DISCOUNT_IN_RUBLE ?
        price - DISCOUNT_IN_RUBLE :
        0;

      break;
    case PromoCode.GITARA2020:
      const {
        DISCOUNT_IN_PROPORTION_MAX_VALUE,
        DISCOUNT_IN_RUBLE: DISCOUNT_IN_RUBL,
      } = PromoCodeParameter[PromoCode.GITARA2020];

      const discountInRubleMaxValue = Math.floor(price * DISCOUNT_IN_PROPORTION_MAX_VALUE);

      discountedPrice = price - Math.min(DISCOUNT_IN_RUBL, discountInRubleMaxValue);

      break;
    default:
      discountedPrice = price;

      break;
  }

  return discountedPrice;
};

import React from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  StoreNameSpace,
} from "../../../../../const";
import {
  changeMaxPriceFilter,
  changeMinPriceFilter,
} from "../../../../../store/actions/page";
import {
  getPriceRange,
} from "../../../../../store/selectors";
import {
  formatPrice,
  getValueInRange,
  removeNonDigits,
} from "../../../../../utils";

const FilterPrice = () => {
  const {
    minPriceFilter,
    maxPriceFilter,
    priceRange: {
      min: minPriceRange,
      max: maxPriceRange,
    },
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.PAGE],
    ...getPriceRange(globalState),
  }));

  const dispatch = useDispatch();

  const handleMinPriceInputChange = (evt) => {
    const value = removeNonDigits(evt.target.value);

    if (value.length > `${maxPriceRange}`.length) {
      return;
    }

    if (!value) {
      dispatch(changeMinPriceFilter(null));

      return;
    }

    dispatch(changeMinPriceFilter(Number(value)));
  };

  const handleMinPriceInputBlur = () => {
    const maxValue = maxPriceFilter ? maxPriceFilter : maxPriceRange;
    const value = getValueInRange(minPriceFilter, minPriceRange, maxValue);

    dispatch(changeMinPriceFilter(value));
  };

  const handleMaxPriceInputChange = (evt) => {
    const value = removeNonDigits(evt.target.value);

    if (value.length > `${maxPriceRange}`.length) {
      return;
    }

    if (!value) {
      dispatch(changeMaxPriceFilter(null));

      return;
    }

    dispatch(changeMaxPriceFilter(Number(value)));
  };

  const handleMaxPriceInputBlur = () => {
    const minValue = minPriceFilter ? minPriceFilter : minPriceRange;
    const value = getValueInRange(maxPriceFilter, minValue, maxPriceRange);

    dispatch(changeMaxPriceFilter(value));
  };

  return (
    <fieldset className="filter__block filter-price">
      <h3 className="filter__block-heading filter-price__heading">Цена, <span className="filter-price__heading-ruble">₽</span></h3>
      <div className="filter-price__wrapper">
        <p className="filter-price__paragraph">
          <label className="visually-hidden" htmlFor="min-price">От</label>
          <span className="filter-price__input-wrapper">
            <span className="filter-price__input-substrate">
              {minPriceFilter !== null ? formatPrice(minPriceFilter) : ``}
            </span>
            <input className="filter-price__input filter-price__input--min-price" type="number"
              id="min-price" name="min-price" placeholder={formatPrice(minPriceRange)}
              value={minPriceFilter !== null ? minPriceFilter.toString() : ``}
              onChange={handleMinPriceInputChange} onBlur={handleMinPriceInputBlur} />
          </span>
        </p>
        <p className="filter-price__paragraph">
          <label className="visually-hidden" htmlFor="max-price">До</label>
          <span className="filter-price__input-wrapper">
            <span className="filter-price__input-substrate">
              {maxPriceFilter !== null ? formatPrice(maxPriceFilter) : ``}
            </span>
            <input className="filter-price__input filter-price__input--max-price" type="number"
              id="max-price" name="max-price" placeholder={formatPrice(maxPriceRange)}
              value={maxPriceFilter !== null ? maxPriceFilter.toString() : ``}
              onChange={handleMaxPriceInputChange} onBlur={handleMaxPriceInputBlur} />
          </span>
        </p>
      </div>
    </fieldset>
  );
};

export default FilterPrice;

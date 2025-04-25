import React from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  changeSortDirection,
  changeSortType,
} from "../../../../store/actions/page";
import {
  SortDirection,
  SortType,
  StoreNameSpace,
} from "../../../../const";

const sortTypeCyrillicMap = {
  [SortType.PRICE]: `по цене`,
  [SortType.POPULARITY]: `по популярности`,
};

const sortDirectionCyrillicMap = {
  [SortDirection.ASCENDING]: `по возрастанию`,
  [SortDirection.DESCENDING]: `по убыванию`,
};

const Sorting = () => {
  const {
    currentSortType,
    currentSortDirection,
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.PAGE],
  }));

  const dispatch = useDispatch();

  const handleSortingTypeInputChange = (evt) => {
    dispatch(changeSortType(evt.target.value));
  };

  const handleSortingDirectionInputChange = (evt) => {
    dispatch(changeSortDirection(evt.target.value));
  };

  return (
    <section className="catalog__sorting sorting">
      <h2 className="sorting__heading">Сортировать:</h2>
      <fieldset className="sorting__fieldset">
        <ul className="sorting__list sorting__list--type">
          {Object.values(SortType).map((item) => (
            <li key={item} className="sorting__item sorting__item--type">
              <input className="sorting__radio-input visually-hidden" type="radio" name="sort-type"
                id={item} value={item} checked={item === currentSortType} onChange={handleSortingTypeInputChange} />
              <label className="sorting__label sorting__label--type" htmlFor={item}>{sortTypeCyrillicMap[item]}</label>
            </li>
          ))}
        </ul>
        <ul className="sorting__list sorting__list--direction">
          {Object.values(SortDirection).map((item) => (
            <li key={item} className="sorting__item sorting__item--direction">
              <input className="sorting__radio-input visually-hidden" type="radio" name="sort-direction"
                id={item} value={item} checked={item === currentSortDirection} onChange={handleSortingDirectionInputChange} />
              <label className={`sorting__label sorting__label--direction sorting__label--${item}`} htmlFor={item}>
                <span className="visually-hidden">{sortDirectionCyrillicMap[item]}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </section>
  );
};

export default Sorting;

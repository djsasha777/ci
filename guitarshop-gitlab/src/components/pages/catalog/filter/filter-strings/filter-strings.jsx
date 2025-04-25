import React from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  changeStringsFilter,
} from "../../../../../store/actions/page";
import {
  getStringsFilterParameters,
} from "../../../../../store/selectors";

const FilterStrings = () => {
  const {
    stringsFilterParameters,
  } = useSelector((globalState) => ({
    ...getStringsFilterParameters(globalState),
  }));

  const dispatch = useDispatch();

  const handleStringsInputChange = (evt) => {
    const {
      id,
      checked,
    } = evt.target;

    dispatch(changeStringsFilter({
      strings: Number(id),
      isAdd: checked,
    }));
  };

  return (
    <fieldset className="filter__block filter-strings">
      <h3 className="filter__block-heading">Количество струн</h3>
      <ul className="filter-strings__list filter__checkbox-list">
        {stringsFilterParameters.map(({
          item,
          checked,
          disabled,
        }) => (
          <li key={item} className="filter-strings__item filter__checkbox-item">
            <input className="filter-strings__checkbox filter__checkbox-input visually-hidden" type="checkbox" id={item} name={item}
              checked={checked} disabled={disabled} onChange={handleStringsInputChange} />
            <label className="filter-strings__label filter__checkbox-label" htmlFor={item}>{item}</label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

export default FilterStrings;

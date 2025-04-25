import React from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  changeGuitarTypeFilter,
} from "../../../../../store/actions/page";
import {
  getGuitarTypeFilterParameters,
} from "../../../../../store/selectors";
import {
  GuitarType,
} from "../../../../../const";

const guitarTypeCyrillicMap = {
  [GuitarType.ACOUSTIC]: `Акустические гитары`,
  [GuitarType.ELECTRIC]: `Электрогитары`,
  [GuitarType.UKULELE]: `Укулеле`,
};

const FilterType = () => {
  const {
    guitarTypeFilterParameters,
  } = useSelector((globalState) => ({
    ...getGuitarTypeFilterParameters(globalState),
  }));

  const dispatch = useDispatch();

  const handleTypeInputChange = (evt) => {
    const {
      id,
      checked,
    } = evt.target;

    dispatch(changeGuitarTypeFilter({
      guitarType: id,
      isAdd: checked,
    }));
  };

  return (
    <fieldset className="filter__block filter-type">
      <h3 className="filter__block-heading">Тип гитар</h3>
      <ul className="filter-type__list filter__checkbox-list">
        {guitarTypeFilterParameters.map(({
          guitarType,
          checked,
        }) => (
          <li key={guitarType} className="filter-type__item filter__checkbox-item">
            <input className="filter-type__checkbox filter__checkbox-input visually-hidden" type="checkbox"
              id={guitarType} name={guitarType} checked={checked} onChange={handleTypeInputChange} />
            <label className="filter-type__label filter__checkbox-label" htmlFor={guitarType}>
              {guitarTypeCyrillicMap[guitarType]}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

export default FilterType;

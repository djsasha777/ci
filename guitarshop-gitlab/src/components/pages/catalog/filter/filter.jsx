import React from "react";

import FilterPrice from "./filter-price/filter-price";
import FilterType from "./filter-type/filter-type";
import FilterStrings from "./filter-strings/filter-strings";

const Filter = () => (
  <section className="catalog__filter filter">
    <h2 className="filter__heading">Фильтр</h2>
    <form className="filter__form" action="https://echo.htmlacademy.ru" method="POST" id="filter-form">
      <FilterPrice />
      <FilterType />
      <FilterStrings />
    </form>
  </section>
);

export default Filter;

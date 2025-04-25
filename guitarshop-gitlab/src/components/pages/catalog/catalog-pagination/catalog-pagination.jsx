import React from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  INCREMENT_STEP,
  CATALOG_PAGE_MIN_NUMBER,
  StoreNameSpace,
} from "../../../../const";
import {
  changeCatalogPage,
} from "../../../../store/actions/page";
import {
  getMaxPageNumber,
} from "../../../../store/selectors";

const CatalogPagination = () => {
  const {
    currentPageNumber,
    maxPageNumber,
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.PAGE],
    ...getMaxPageNumber(globalState),
  }));

  const secondPageNumber = CATALOG_PAGE_MIN_NUMBER + INCREMENT_STEP;
  const penultimatePageNumber = maxPageNumber - INCREMENT_STEP;
  const previousPageNumber = currentPageNumber - INCREMENT_STEP;
  const nextPageNumber = currentPageNumber + INCREMENT_STEP;

  const isShowFirstPageLink = currentPageNumber > CATALOG_PAGE_MIN_NUMBER;
  const isShowLeftPlug = currentPageNumber > secondPageNumber &&
    penultimatePageNumber > secondPageNumber;
  const isShowPreviousPageLink = currentPageNumber === maxPageNumber &&
    maxPageNumber > secondPageNumber;
  const isShowNextPageLink = currentPageNumber === CATALOG_PAGE_MIN_NUMBER &&
    maxPageNumber > secondPageNumber;
  const isShowRightPlug = currentPageNumber < penultimatePageNumber &&
    penultimatePageNumber > secondPageNumber;
  const isShowLastPageLink = currentPageNumber < maxPageNumber;

  const dispatch = useDispatch();

  const handlePaginationListClick = (evt) => {
    if (evt.target.matches(`.catalog-pagination__link:is([href])`)) {
      evt.preventDefault();

      dispatch(changeCatalogPage(Number(evt.target.dataset.number)));
    }
  };

  return (
    <section className="catalog__pagination catalog-pagination">
      <h2 className="visually-hidden">Навигация по страницам каталога</h2>
      {maxPageNumber > CATALOG_PAGE_MIN_NUMBER && (
        <ul className="catalog-pagination__list"
          onClick={handlePaginationListClick}>
          {isShowFirstPageLink && (
            <>
              <li className="catalog-pagination__item">
                <a className="catalog-pagination__link catalog-pagination__link--back" href="#"
                  data-number={previousPageNumber}>Назад</a>
              </li>
              <li className="catalog-pagination__item">
                <a className="catalog-pagination__link" href="#"
                  data-number={CATALOG_PAGE_MIN_NUMBER}>{CATALOG_PAGE_MIN_NUMBER}</a>
              </li>
            </>
          )}
          {isShowLeftPlug && (
            <li className="catalog-pagination__item">
              <a className="catalog-pagination__link">...</a>
            </li>
          )}
          {isShowPreviousPageLink && (
            <li className="catalog-pagination__item">
              <a className="catalog-pagination__link" href="#"
                data-number={previousPageNumber}>{previousPageNumber}</a>
            </li>
          )}
          <li className="catalog-pagination__item">
            <a className="catalog-pagination__link catalog-pagination__link--current"
              title={`Вы находитесь на ${currentPageNumber} странице каталога`}>{currentPageNumber}</a>
          </li>
          {isShowNextPageLink && (
            <li className="catalog-pagination__item">
              <a className="catalog-pagination__link" href="#"
                data-number={nextPageNumber}>{nextPageNumber}</a>
            </li>
          )}
          {isShowRightPlug && (
            <li className="catalog-pagination__item">
              <a className="catalog-pagination__link">...</a>
            </li>
          )}
          {isShowLastPageLink && (
            <>
              <li className="catalog-pagination__item">
                <a className="catalog-pagination__link" href="#"
                  data-number={maxPageNumber}>{maxPageNumber}</a>
              </li>
              <li className="catalog-pagination__item">
                <a className="catalog-pagination__link catalog-pagination__link--further" href="#"
                  data-number={nextPageNumber}>Далее</a>
              </li>
            </>
          )}
        </ul>
      )}
    </section>
  );
};

export default CatalogPagination;

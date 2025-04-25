import React, {
  useEffect,
} from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";

import Header from "../../header/header";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";
import Filter from "./filter/filter";
import Sorting from "./sorting/sorting";
import CatalogProducts from "./catalog-products/catalog-products";
import CatalogPagination from "./catalog-pagination/catalog-pagination";
import Footer from "../../footer/footer";
import BasketActionModal from "../../basket-action-modal/basket-action-modal";
import BasketNotificationModal from "../../basket-notification-modal/basket-notification-modal";

import {
  BasketActionType,
  CATALOG_PAGE_MIN_NUMBER,
  StoreNameSpace,
} from "../../../const";
import {
  changeBasketAction,
  changeCatalogPage,
} from "../../../store/actions/page";
import {
  hideBasketNotificationModal,
} from "../../../store/actions/data";
import {
  getMaxPageNumber,
  getProductsForCatalog,
} from "../../../store/selectors";

const breadcrumbsLinks = [
  {
    text: `Главная`,
    href: `#`,
  },
  {
    text: `Каталог`,
  },
];

const Catalog = () => {
  const {
    basketAction: {
      type: basketActionType,
    },
    currentPageNumber,
    isShowBasketNotificationModal,
    productsForCatalog,
    maxPageNumber,
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.PAGE],
    ...globalState[StoreNameSpace.DATA],
    ...getProductsForCatalog(globalState),
    ...getMaxPageNumber(globalState),
  }));

  const isAddToBasket = basketActionType === BasketActionType.ADD;

  const dispatch = useDispatch();

  const handleBasketActionModalClose = () => {
    dispatch(changeBasketAction(null));
  };

  const handleBasketNotificationModalClose = () => {
    dispatch(hideBasketNotificationModal());
  };

  useEffect(() =>
    currentPageNumber > maxPageNumber &&
    dispatch(changeCatalogPage(CATALOG_PAGE_MIN_NUMBER)));

  return (
    <div className="page page--catalog">
      <Header />
      <main className="page__main main catalog wrapper">
        <h1 className="main__heading catalog__heading">Каталог гитар</h1>
        <Breadcrumbs className="main__breadcrumbs" links={breadcrumbsLinks} />
        <div className="catalog__wrapper">
          <Filter />
          <div className="catalog__main-column-wrapper">
            {productsForCatalog.length ? (
              <>
                <Sorting />
                <CatalogProducts />
                <CatalogPagination />
              </>
            ) : (
              <p className="empty-list-message">
                Подходящих товаров нет{`\n`}
                (╯°益°)╯彡┻━┻{`\n`}
                Попробуйте изменить параметры фильтра
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {isAddToBasket && <BasketActionModal onModalClose={handleBasketActionModalClose} />}
      {isShowBasketNotificationModal && <BasketNotificationModal onModalClose={handleBasketNotificationModalClose} />}
    </div>
  );
};

export default Catalog;

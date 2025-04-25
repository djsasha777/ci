import React from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import Header from "../../header/header";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";
import BasketProducts from "./basket-products/basket-products";
import PromoCode from "./promo-code/promo-code";
import Footer from "../../footer/footer";
import BasketActionModal from "../../basket-action-modal/basket-action-modal";

import {
  AppRoute,
  BasketActionType,
  StoreNameSpace,
} from "../../../const";
import {
  changeBasketAction,
} from "../../../store/actions/page";
import {
  formatPrice,
} from "../../../utils";
import {
  getTotalPrice,
} from "../../../store/selectors";

const breadcrumbsLinks = [
  {
    text: `Главная`,
    href: `#`,
  },
  {
    text: `Каталог`,
    href: AppRoute.ROOT,
  },
  {
    text: `Оформляем`,
  },
];

const Basket = () => {
  const {
    productsInBasket,
    basketAction: {
      type: basketActionType,
    },
    totalPrice,
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.DATA],
    ...globalState[StoreNameSpace.PAGE],
    ...getTotalPrice(globalState),
  }));

  const isRemoveFromBasket = basketActionType === BasketActionType.REMOVE;

  const dispatch = useDispatch();

  const handleBasketActionModalClose = () => {
    dispatch(changeBasketAction(null));
  };

  return (
    <div className="page page--basket">
      <Header />
      <main className="page__main main basket wrapper">
        <h1 className="main__heading basket__heading">Корзина</h1>
        <Breadcrumbs className="main__breadcrumbs" links={breadcrumbsLinks} />
        {productsInBasket.length ? (
          <>
            <BasketProducts />
            <div className="basket__bottom-wrapper">
              <PromoCode />
              <div className="basket__totals-wrapper">
                <p className="basket__total-price">Всего: {formatPrice(totalPrice)} ₽</p>
                <ul className="basket__links-list">
                  <li className="basket__links-item">
                    <a className="basket__link orange-button" href="#">Оформить заказ</a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="empty-list-message">
            Корзина пуста{`\n`}
            ╮(￣ω￣;)╭
          </p>
        )}
      </main>
      <Footer />
      {isRemoveFromBasket && <BasketActionModal onModalClose={handleBasketActionModalClose} />}
    </div>
  );
};

export default Basket;

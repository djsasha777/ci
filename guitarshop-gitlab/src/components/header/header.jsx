import React from "react";
import {
  useSelector,
} from "react-redux";
import {
  Link,
  useLocation,
} from "react-router-dom";

import MainLogo from "../main-logo/main-logo";
import DecorativeGuitar from "../decorative-guitar/decorative-guitar";

import {
  AppRoute,
  StoreNameSpace,
} from "../../const";

const Header = () => {
  const {
    productsInBasket,
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.DATA],
  }));

  const productsInBasketQuantity = productsInBasket.length;

  const path = useLocation().pathname;

  return (
    <header className="page__header header">
      <div className="header__wrapper">
        <nav className="header__nav wrapper">
          <p className="header__logo">
            {path === AppRoute.ROOT ? (
              <a className="header__logo-link" title="Вы находитесь на главной странице">
                <MainLogo className="header__logo-image" />
              </a>
            ) : (
              <Link className="header__logo-link" to={AppRoute.ROOT}>
                <MainLogo className="header__logo-image" />
              </Link>
            )}
          </p>
          <ul className="header__main-nav-list">
            <li className="header__main-nav-item">
              <a className="header__main-nav-link" href="#">Каталог</a>
            </li>
            <li className="header__main-nav-item">
              <a className="header__main-nav-link" href="#">Где купить?</a>
            </li>
            <li className="header__main-nav-item">
              <a className="header__main-nav-link" href="#">О компании</a>
            </li>
            <li className="header__main-nav-item">
              <a className="header__main-nav-link" href="#">Сервис-центры</a>
            </li>
          </ul>
          <ul className="header__user-nav-list">
            <li className="header__user-nav-item">
              <a className="header__user-nav-link header__user-nav-link--location" href="#">
                <span className="visually-hidden">Магазины рядом</span>
              </a>
            </li>
            <li className="header__user-nav-item">
              <a className="header__user-nav-link header__user-nav-link--search" href="#">
                <span className="visually-hidden">Поиск товаров</span>
              </a>
            </li>
            <li className="header__user-nav-item">
              {path === AppRoute.BASKET ? (
                <a className="header__user-nav-link header__user-nav-link--basket" title="Вы находитесь на этой странице">
                  <span className="visually-hidden">Корзина. Количество товаров внутри: </span>
                  <span className={`header__quantity-items-in-basket ${productsInBasketQuantity ? `` : `visually-hidden`}`}>
                    {productsInBasketQuantity}
                  </span>
                </a>
              ) : (
                <Link className="header__user-nav-link header__user-nav-link--basket" to={AppRoute.BASKET}>
                  <span className="visually-hidden">Корзина. Количество товаров внутри: </span>
                  <span className={`header__quantity-items-in-basket ${productsInBasketQuantity ? `` : `visually-hidden`}`}>
                    {productsInBasketQuantity}
                  </span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div className="header__decorative-wrapper">
        <DecorativeGuitar className="header__decorative-guitar" />
      </div>
    </header>
  );
};

export default Header;

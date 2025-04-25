import React from "react";
import {
  useSelector,
} from "react-redux";

import BasketCard from "./basket-card/basket-card";

import {
  StoreNameSpace,
} from "../../../../const";

const BasketProducts = () => {
  const {
    productsInBasket,
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.DATA],
  }));

  return (
    <section className="basket__products basket-products">
      <h2 className="visually-hidden">Перечень товаров</h2>
      <ul className="basket-products__list">
        {productsInBasket.map(({
          id,
          article,
          name,
          type,
          strings,
          price,
          quantity,
          image: {
            forBasket: href,
            description,
          },
        }) => (
          <li className="basket-products__item" key={id}>
            <BasketCard product={{
              id,
              article,
              name,
              type,
              strings,
              price,
              quantity,
              image: {
                href,
                description,
              },
            }} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BasketProducts;

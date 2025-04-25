import React from "react";
import {
  useSelector,
} from "react-redux";

import CatalogCard from "./catalog-card/catalog-card";

import {
  getProductsForCatalog,
} from "../../../../store/selectors";

const CatalogProducts = () => {
  const {
    productsForCatalog,
  } = useSelector((globalState) => ({
    ...getProductsForCatalog(globalState),
  }));

  return (
    <section className="catalog__products catalog-products">
      <h2 className="visually-hidden">Перечень товаров</h2>
      <ul className="catalog-products__list">
        {productsForCatalog.map((item) => (
          <li className="catalog-products__item" key={item.id}>
            <CatalogCard product={item} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CatalogProducts;

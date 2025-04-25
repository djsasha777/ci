import React from "react";

const FooterCatalog = () => (
  <section className="footer__catalog footer-catalog">
    <h2 className="footer-catalog__heading footer__block-heading">Каталог</h2>
    <ul className="footer-catalog__list">
      <li className="footer-catalog__item">
        <a className="footer-catalog__link" href="#">Акустические гитары</a>
      </li>
      <li className="footer-catalog__item">
        <a className="footer-catalog__link" href="#">Классические гитары</a>
      </li>
      <li className="footer-catalog__item">
        <a className="footer-catalog__link" href="#">Электрогитары</a>
      </li>
      <li className="footer-catalog__item">
        <a className="footer-catalog__link" href="#">Бас-гитары</a>
      </li>
      <li className="footer-catalog__item">
        <a className="footer-catalog__link" href="#">Укулеле</a>
      </li>
    </ul>
  </section>
);

export default FooterCatalog;

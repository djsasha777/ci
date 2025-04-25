import React from "react";

const FooterInfo = () => (
  <section className="footer__info footer-info">
    <h2 className="footer-info__heading footer__block-heading">Информация</h2>
    <ul className="footer-info__list">
      <li className="footer-info__item">
        <a className="footer-info__link" href="#">Где купить?</a>
      </li>
      <li className="footer-info__item">
        <a className="footer-info__link" href="#">Блог</a>
      </li>
      <li className="footer-info__item">
        <a className="footer-info__link" href="#">Вопрос - ответ</a>
      </li>
      <li className="footer-info__item">
        <a className="footer-info__link" href="#">Возврат</a>
      </li>
      <li className="footer-info__item">
        <a className="footer-info__link" href="#">Сервис-центры</a>
      </li>
    </ul>
  </section>
);

export default FooterInfo;

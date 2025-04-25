import React from "react";

const FooterContacts = () => (
  <section className="footer__contacts footer-contacts">
    <h2 className="footer-contacts__heading footer__block-heading">Контакты</h2>
    <ul className="footer-contacts__list">
      <li className="footer-contacts__item">
        <p className="footer-contacts__address">
          г. Санкт-Петербург, м. Невский проспект, ул. Казанская 6.
        </p>
      </li>
      <li className="footer-contacts__item">
        <a className="footer-contacts__phone" href="tel:+78125005050">8-812-500-50-50</a>
      </li>
      <li className="footer-contacts__item">
        <p className="footer-contacts__opening-hours">
          Режим работы:{`\n`}
          <span className="footer-contacts__opening-hours-wrapper">с 11:00 до 20:00,</span>{`\n`}
          без выходных.
        </p>
      </li>
    </ul>
  </section>
);

export default FooterContacts;

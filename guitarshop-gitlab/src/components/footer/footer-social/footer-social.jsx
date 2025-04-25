import React from "react";

const FooterSocial = () => (
  <section className="footer__social footer-social">
    <h2 className="visually-hidden">Социальные сети</h2>
    <ul className="footer-social__list">
      <li className="footer-social__item">
        <a className="footer-social__link footer-social__link--facebook" href="#">
          <span className="visually-hidden">Facebook</span>
        </a>
      </li>
      <li className="footer-social__item">
        <a className="footer-social__link footer-social__link--instagram" href="#">
          <span className="visually-hidden">Instagram</span>
        </a>
      </li>
      <li className="footer-social__item">
        <a className="footer-social__link footer-social__link--twitter" href="#">
          <span className="visually-hidden">Twitter</span>
        </a>
      </li>
    </ul>
  </section>
);

export default FooterSocial;

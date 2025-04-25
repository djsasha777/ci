import React from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import DecorativeGuitar from "../decorative-guitar/decorative-guitar";
import MainLogo from "../main-logo/main-logo";
import FooterSocial from "./footer-social/footer-social";
import FooterAboutUs from "./footer-about-us/footer-about-us";
import FooterCatalog from "./footer-catalog/footer-catalog";
import FooterInfo from "./footer-info/footer-info";
import FooterContacts from "./footer-contacts/footer-contacts";

import {
  AppRoute,
} from "../../const";

const Footer = () => {
  const path = useLocation().pathname;

  return (
    <footer className="page__footer footer">
      <div className="footer__decorative-wrapper">
        <DecorativeGuitar className="footer__decorative-guitar" />
      </div>
      <div className="footer__wrapper">
        <div className="footer__nav wrapper">
          <p className="footer__logo">
            {path === AppRoute.ROOT ? (
              <a className="footer__logo-link" title="Вы находитесь на главной странице">
                <MainLogo className="footer__logo-image" />
              </a>
            ) : (
              <Link className="footer__logo-link" to={AppRoute.ROOT}>
                <MainLogo className="footer__logo-image" />
              </Link>
            )}
          </p>
          <FooterSocial />
          <FooterAboutUs />
          <FooterCatalog />
          <FooterInfo />
          <FooterContacts />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

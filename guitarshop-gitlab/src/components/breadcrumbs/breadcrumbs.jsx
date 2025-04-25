import React from "react";
import {
  Link,
} from "react-router-dom";
import PropTypes from "prop-types";

const Breadcrumbs = ({
  className,
  links,
}) => (
  <section className={`main__breadcrumbs breadcrumbs ${className}`}>
    <h2 className="visually-hidden">«Хлебные крошки»</h2>
    <ul className="breadcrumbs__list">
      {links.map(({
        text,
        href,
      }) => (
        <li key={text} className="breadcrumbs__item">
          {href ? (
            <>
              {href === `#` ? (
                <a className="breadcrumbs__link" href={href}>{text}</a>
              ) : (
                <Link className="breadcrumbs__link" to={href}>{text}</Link>
              )}
            </>
          ) : (
            <span className="breadcrumbs__link" title="Вы находитесь на этой странице">{text}</span>
          )}
        </li>
      ))}
    </ul>
  </section>
);

Breadcrumbs.propTypes = {
  className: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.exact({
    text: PropTypes.string.isRequired,
    href: PropTypes.string,
  })).isRequired,
};

export default Breadcrumbs;

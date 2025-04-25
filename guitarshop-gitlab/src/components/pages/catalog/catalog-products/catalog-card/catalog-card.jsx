import React from "react";
import {
  useDispatch,
} from "react-redux";
import PropTypes from "prop-types";

import {
  formatPrice,
} from "../../../../../utils";
import {
  changeBasketAction,
} from "../../../../../store/actions/page";
import {
  BasketActionType,
  RATING_STAR_WIDTH,
} from "../../../../../const";

const CatalogCard = ({
  product: {
    id,
    name,
    popularity,
    price,
    rating,
    image: {
      href: imageHref,
      description: imageDescription,
    },
  },
}) => {
  const dispatch = useDispatch();

  const handleLinkBuyClick = (evt) => {
    evt.preventDefault();

    dispatch(changeBasketAction({
      type: BasketActionType.ADD,
      productID: id,
    }));
  };

  return (
    <article className="catalog__product-card catalog-card">
      <div className="catalog-card__content-wrapper catalog-card__content-wrapper--heading-and-price">
        <h3 className="catalog-card__heading">{name}</h3>
        <p className="catalog-card__price">{formatPrice(price)} ₽</p>
      </div>
      <div className="catalog-card__content-wrapper catalog-card__content-wrapper--rating-and-popularity">
        <div className="catalog-card__rating-stars">
          <div className="catalog-card__active-rating-stars" style={{
            width: `${rating * RATING_STAR_WIDTH}%`,
          }} />
        </div>
        <p className="catalog-card__popularity">{popularity}</p>
      </div>
      <div className="catalog-card__content-wrapper catalog-card__content-wrapper--image">
        <img className="catalog-card__image" width="68" height="190"
          src={imageHref} alt={imageDescription} />
      </div>
      <ul className="catalog-card__links-list">
        <li className="catalog-card__links-item">
          <a className="catalog-card__link catalog-card__link--more grey-button" href="#">Подробнее</a>
        </li>
        <li className="catalog-card__links-item">
          <a className="catalog-card__link catalog-card__link--buy orange-button" href="#" onClick={handleLinkBuyClick} >Купить</a>
        </li>
      </ul>
    </article>
  );
};

CatalogCard.propTypes = {
  product: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    popularity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    image: PropTypes.exact({
      href: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CatalogCard;

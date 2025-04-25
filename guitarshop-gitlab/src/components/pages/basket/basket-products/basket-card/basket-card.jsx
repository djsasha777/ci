import React from "react";
import {
  useDispatch,
} from "react-redux";
import PropTypes from "prop-types";

import {
  formatPrice,
} from "../../../../../utils";
import {
  BasketActionType,
  guitarTypeCyrillicMap,
  INCREMENT_STEP,
  ProductQuantityValue,
} from "../../../../../const";
import {
  changeBasketAction,
} from "../../../../../store/actions/page";
import {
  changeProductQuantity,
} from "../../../../../store/actions/data";

const BasketCard = ({
  product: {
    id,
    article,
    name,
    type,
    strings,
    price,
    quantity,
    image: {
      href: imageHref,
      description: imageDescription,
    },
  },
}) => {
  const dispatch = useDispatch();

  const handleRemoveLinkClick = (evt) => {
    evt.preventDefault();

    dispatch(changeBasketAction({
      type: BasketActionType.REMOVE,
      productID: id,
    }));
  };

  const handleDecreaseButtonClick = () => {
    const updatedQuantity = quantity - INCREMENT_STEP;

    if (updatedQuantity) {
      dispatch(changeProductQuantity({
        id,
        quantity: updatedQuantity,
      }));

      return;
    }

    dispatch(changeBasketAction({
      type: BasketActionType.REMOVE,
      productID: id,
    }));
  };

  const handleIncreaseButtonClick = () => {
    const updatedQuantity = quantity + INCREMENT_STEP;

    if (`${updatedQuantity}`.length > `${ProductQuantityValue.MAX}`.length) {
      return;
    }

    dispatch(changeProductQuantity({
      id,
      quantity: updatedQuantity,
    }));
  };

  const handleQuantityInputChange = (evt) => {
    const updatedQuantity = evt.target.value;

    if (updatedQuantity.length > `${ProductQuantityValue.MAX}`.length) {
      return;
    }

    dispatch(changeProductQuantity({
      id,
      quantity: Number(updatedQuantity),
    }));
  };

  const handleQuantityInputBlur = () =>
    quantity < ProductQuantityValue.MIN &&
    dispatch(changeProductQuantity({
      id,
      quantity: ProductQuantityValue.MIN,
    }));

  return (
    <section className="basket__product-card basket-card">
      <div className="basket-card__content-wrapper basket-card__content-wrapper--heading-article-specifications">
        <h3 className="basket-card__heading">{guitarTypeCyrillicMap[type]} {name}</h3>
        <p className="basket-card__article">Артикул: {article}</p>
        <p className="basket-card__specifications">{guitarTypeCyrillicMap[type]}, {strings} струнная</p>
      </div>
      <div className="basket-card__content-wrapper basket-card__content-wrapper--image">
        <img className="basket-card__image" width="48" height="124"
          src={imageHref} alt={imageDescription} />
      </div>
      <div className="basket-card__content-wrapper basket-card__content-wrapper--price-quantity-total">
        <p className="basket-card__price">{formatPrice(price)} ₽</p>
        <div className="basket-card__quantity-wrapper">
          <button className="basket-card__change-quantity-button basket-card__change-quantity-button--decrease" type="button"
            onClick={handleDecreaseButtonClick}>
            <span className="visually-hidden">Уменьшить количество товара</span>
          </button>
          <label className="visually-hidden" htmlFor="quantity">Введите количество товара</label>
          <input className="basket-card__quantity-input" type="number" id="quantity" name="quantity"
            value={quantity.toString()} onChange={handleQuantityInputChange} onBlur={handleQuantityInputBlur} />
          <button className="basket-card__change-quantity-button basket-card__change-quantity-button--increase" type="button"
            onClick={handleIncreaseButtonClick}>
            <span className="visually-hidden">Увеличить количество товара</span>
          </button>
        </div>
        <p className="basket-card__total">{formatPrice(price * quantity)} ₽</p>
      </div>
      <div className="basket-card__content-wrapper basket-card__content-wrapper--remove-from-basket-link">
        <a className="basket-card__remove-from-basket-link close-button" href="#"
          onClick={handleRemoveLinkClick}>
          <span className="visually-hidden">Удалить товар из корзины</span>
        </a>
      </div>
    </section>
  );
};

BasketCard.propTypes = {
  product: PropTypes.exact({
    id: PropTypes.string.isRequired,
    article: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    strings: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.exact({
      href: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default BasketCard;

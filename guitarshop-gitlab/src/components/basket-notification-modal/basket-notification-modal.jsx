import React, {
  useEffect,
  useRef,
} from "react";
import {
  Link,
} from "react-router-dom";
import PropTypes from "prop-types";

import withOverlay from "../../hocs/with-overlay/with-overlay";

import {
  AppRoute,
} from "../../const";

const BasketNotificationModal = ({
  onModalClose,
}) => {
  const basketLinkRef = useRef();
  const closeButtonRef = useRef();

  const handleBasketLinkClick = () => {
    onModalClose();
  };

  const handleStayHereLinkClick = (evt) => {
    evt.preventDefault();

    onModalClose();
  };

  const handleCloseButtonClick = () => {
    onModalClose();
  };

  const handleBasketLinkShiftTabKeydown = (evt) => {
    if (evt.shiftKey && evt.key === `Tab`) {
      evt.preventDefault();

      closeButtonRef.current.focus();
    }
  };

  const handleCloseButtonTabKeydown = (evt) => {
    if (!evt.shiftKey && evt.key === `Tab`) {
      evt.preventDefault();

      basketLinkRef.current.focus();
    }
  };

  useEffect(() => {
    basketLinkRef.current.focus();
  });

  return (
    <section className="basket-notification-modal">
      <h2 className="basket-notification-modal__heading">Товар успешно добавлен в корзину</h2>
      <ul className="basket-notification-modal__links-list">
        <li className="basket-notification-modal__links-item">
          <Link className="basket-notification-modal__link orange-button" to={AppRoute.BASKET}
            ref={basketLinkRef} onClick={handleBasketLinkClick} onKeyDown={handleBasketLinkShiftTabKeydown}>Перейти в корзину</Link>
        </li>
        <li className="basket-notification-modal__links-item">
          <a className="basket-notification-modal__link white-button" href="#"
            onClick={handleStayHereLinkClick}>Продолжить покупки</a>
        </li>
      </ul>
      <button className="basket-notification-modal__close-button close-button" type="button"
        ref={closeButtonRef} onClick={handleCloseButtonClick} onKeyDown={handleCloseButtonTabKeydown}>
        <span className="visually-hidden">Закрыть</span>
      </button>
    </section>
  );
};

BasketNotificationModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
};

export default withOverlay(BasketNotificationModal);

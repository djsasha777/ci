import React, {
  useEffect,
  useRef,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import PropTypes from "prop-types";

import withOverlay from "../../hocs/with-overlay/with-overlay";

import {
  formatPrice,
} from "../../utils";
import {
  BasketActionType,
  guitarTypeCyrillicMap,
  StoreNameSpace,
} from "../../const";
import {
  addProductToBasket,
  removeProductFromBasket,
} from "../../store/actions/data";
import {
  getBasketActionProduct,
} from "../../store/selectors";

const BasketActionModal = ({
  onModalClose,
}) => {
  const {
    basketAction: {
      type: basketActionType,
    },
    basketActionProduct: {
      id,
      article,
      name,
      type,
      strings,
      price,
      image: {
        href: imageHref,
        description: imageDescription,
      },
    },
  } = useSelector((globalState) => ({
    ...globalState[StoreNameSpace.PAGE],
    ...getBasketActionProduct(globalState),
  }));

  const isRemoveProduct = basketActionType === BasketActionType.REMOVE;

  const removeLinkRef = useRef();
  const addLinkRef = useRef();
  const closeButtonRef = useRef();

  const dispatch = useDispatch();

  const handleCloseButtonClick = () => {
    onModalClose();
  };

  const handleAddLinkClick = (evt) => {
    evt.preventDefault();

    dispatch(addProductToBasket(id));

    onModalClose();
  };

  const handleRemoveLinkClick = (evt) => {
    evt.preventDefault();

    dispatch(removeProductFromBasket(id));

    onModalClose();
  };

  const handleStayHereLinkClick = (evt) => {
    evt.preventDefault();

    onModalClose();
  };

  const handleFirstLinkShiftTabKeydown = (evt) => {
    if (evt.shiftKey && evt.key === `Tab`) {
      evt.preventDefault();

      closeButtonRef.current.focus();
    }
  };

  const handleCloseButtonTabKeydown = (evt) => {
    if (!evt.shiftKey && evt.key === `Tab`) {
      evt.preventDefault();

      if (isRemoveProduct) {
        removeLinkRef.current.focus();

        return;
      }

      addLinkRef.current.focus();
    }
  };

  useEffect(() => {
    if (isRemoveProduct) {
      removeLinkRef.current.focus();

      return;
    }

    addLinkRef.current.focus();
  });

  return (
    <section className="basket-action-modal">
      <h2 className="basket-action-modal__heading">{isRemoveProduct ? `Удалить этот товар? ` : `Добавить товар в корзину?`}</h2>
      <div className="basket-action-modal__content-wrapper">
        <ul className="basket-action-modal__product-info-list">
          <li className="basket-action-modal__product-info-item basket-action-modal__product-info-item--product-name">Гитара {name}</li>
          <li className="basket-action-modal__product-info-item basket-action-modal__product-info-item--article">Артикул: {article}</li>
          <li className="basket-action-modal__product-info-item basket-action-modal__product-info-item--specifications">{guitarTypeCyrillicMap[type]}, {strings} струнная</li>
          <li className="basket-action-modal__product-info-item basket-action-modal__product-info-item--price">Цена: {formatPrice(price)} ₽</li>
        </ul>
        <div className="basket-action-modal__image-wrapper">
          <img className="basket-action-modal__image" width="48" height="124"
            src={imageHref} alt={imageDescription} />
        </div>
        <ul className="basket-action-modal__links-list">
          {isRemoveProduct ? (
            <>
              <li className="basket-action-modal__links-item">
                <a className="basket-action-modal__link orange-button" href="#"
                  ref={removeLinkRef} onClick={handleRemoveLinkClick} onKeyDown={handleFirstLinkShiftTabKeydown}>Удалить товар</a>
              </li>
              <li className="basket-action-modal__links-item">
                <a className="basket-action-modal__link white-button" href="#"
                  onClick={handleStayHereLinkClick}>Продолжить покупки</a>
              </li>
            </>
          ) : (
            <li className="basket-action-modal__links-item">
              <a className="basket-action-modal__link orange-button" href="#"
                ref={addLinkRef} onClick={handleAddLinkClick} onKeyDown={handleFirstLinkShiftTabKeydown}>Добавить в корзину</a>
            </li>
          )}
        </ul>
      </div>
      <button className="basket-action-modal__close-button close-button" type="button"
        ref={closeButtonRef} onClick={handleCloseButtonClick} onKeyDown={handleCloseButtonTabKeydown}>
        <span className="visually-hidden">Закрыть</span>
      </button>
    </section>
  );
};

BasketActionModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
};

export default withOverlay(BasketActionModal);

import React, {
  useState,
  useRef,
} from "react";
import {
  useDispatch,
} from "react-redux";

import {
  PROMO_CODE_MAX_LENGTH,
} from "../../../../const";
import {
  setPromoCode,
} from "../../../../store/actions/data";
import {
  checkPromoCode,
} from "../../../../utils";

const PromoCode = () => {
  const [
    state,
    setState,
  ] = useState({
    promoCode: ``,
  });

  const promoCodeInputWrapperRef = useRef();

  const dispatch = useDispatch();

  const handleFormSubmit = (evt) => {
    evt.preventDefault();

    if (!state.promoCode.length) {
      return;
    }

    if (checkPromoCode(state.promoCode)) {
      promoCodeInputWrapperRef.current.classList.remove(`promo-code__invalid`);

      dispatch(setPromoCode(state.promoCode));
    } else {
      promoCodeInputWrapperRef.current.classList.add(`promo-code__invalid`);
    }
  };

  const handleInputChange = (evt) => {
    setState((prevState) => ({
      ...prevState,
      promoCode: evt.target.value.trim().slice(0, PROMO_CODE_MAX_LENGTH).toUpperCase(),
    }));
  };

  return (
    <form className="basket__promo-code promo-code" action="https://echo.htmlacademy.ru" method="POST" id="promo-code-form"
      onSubmit={handleFormSubmit}>
      <h2 className="promo-code__heading">Промокод на скидку</h2>
      <p className="promo-code__paragraph">
        <label className="promo-code__label" htmlFor="promo-code">Введите свой промокод, если он у вас есть.</label>
        <span className="promo-code__content-wrapper"
          ref={promoCodeInputWrapperRef}>
          <input className="promo-code__input" type="text" name="promo-code" id="promo-code"
            value={state.promoCode} onChange={handleInputChange} />
          <button className="promo-code__form-submit-button grey-button" type="submit">Применить купон</button>
        </span>
      </p>
    </form>
  );
};

export default PromoCode;

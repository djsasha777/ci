import React, {
  useEffect,
} from "react";
import PropTypes from "prop-types";

const withOverlay = (Component) => {
  const WithOverlayComponent = ({
    onModalClose,
    ...props
  }) => {
    const handleOverlayMouseDown = (evt) => {
      if (evt.target.matches(`.overlay`)) {
        onModalClose();
      }
    };

    const handleEscKeydown = (evt) => {
      if (evt.key === `Escape`) {
        onModalClose();
      }
    };

    useEffect(() => {
      document.body.style.overflow = `hidden`;

      return () => {
        document.body.style.overflow = ``;
      };
    });

    return (
      <div className="overlay wrapper" onMouseDown={handleOverlayMouseDown} onKeyDown={handleEscKeydown}>
        <Component {...props} onModalClose={onModalClose} />
      </div>
    );
  };

  WithOverlayComponent.propTypes = {
    onModalClose: PropTypes.func.isRequired,
  };

  return WithOverlayComponent;
};

export default withOverlay;

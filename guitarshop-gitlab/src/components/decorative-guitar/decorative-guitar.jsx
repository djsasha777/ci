import React from "react";
import PropTypes from "prop-types";

const DecorativeGuitar = ({
  className,
}) => (
  <div className={`decorative-guitar ${className}`} style={{
    backgroundImage: `url(img/guitar-background.png)`
  }} />
);

DecorativeGuitar.propTypes = {
  className: PropTypes.string.isRequired,
};

export default DecorativeGuitar;

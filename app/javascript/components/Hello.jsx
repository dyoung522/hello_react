import * as React from "react";
import PropTypes from "prop-types";

const Hello = ({ greet }) => {
  return (
    <div className="flex justify-center">
      <div className="text-center items-center">
        <p className="py-16 text-2xl text-red-500">Hello {greet || "World"}!</p>
      </div>
    </div>
  );
};

Hello.propTypes = {
  greet: PropTypes.string,
};

export default Hello;

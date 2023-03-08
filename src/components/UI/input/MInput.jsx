import React, { useEffect } from "react";
import classes from "./MInput.module.css";

const MInput = ({ setvalue, placeholder, value, style, type }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className={style ? classes.mInputError : classes.mInput}
      onChange={(e) => setvalue(e.target.value)}
    />
  );
};

export default MInput;

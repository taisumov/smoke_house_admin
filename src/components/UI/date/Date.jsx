import React from "react";
import classes from "./Date.module.css";

const Date = ({ setvalue, placeholder, value, style }) => {
  return (
    <input
      type="date"
      className={style ? classes.mInputError : classes.mInput}
      maxlength="100"
      value={value}
      onChange={(e) => setvalue(e.target.value)}
    />
  );
};

export default Date;

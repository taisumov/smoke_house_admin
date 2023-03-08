import React, { useState } from "react";
import classes from "./MTextarea.module.css";

const MTextarea = ({ value, setvalue, placeholder }) => {
  const [characters, setCharacters] = useState(0);
  return (
    <div className={classes.textArea}>
      <div className={classes.value}>{characters}/300</div>
      <textarea
        cols="30px"
        placeholder={placeholder}
        className={classes.mTextarea}
        value={value}
        maxlength="300"
        onChange={(e) => {
          setCharacters(e.target.value.length);
          setvalue(e.target.value);
        }}
      />
    </div>
  );
};

export default MTextarea;

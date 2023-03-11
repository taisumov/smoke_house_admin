import React, { useEffect, useState } from "react";
import style from "./MCheckbox.module.css";
import check from "./check.svg";

const MCheckbox = ({ setInterview, interview }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [activeClass, setActiveClass] = useState(style.mark);

  useEffect(() => {
    if (interview) {
      setActiveClass(style.active);
      //setInterview(true);
    } else {
      setActiveClass(style.mark);
      //setInterview(false);
    }
  }, [interview]);

  return (
    <div
      className={style.mCheckmark}
      onClick={() => {
        setInterview(!interview);
      }}
    >
      <div className={activeClass}>
        <img src={check} alt="" className={style.img} />
      </div>
    </div>
  );
};

export default MCheckbox;

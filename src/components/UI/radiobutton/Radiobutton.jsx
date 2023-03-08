import React, { useEffect, useState } from "react";
import style from "../radiobutton/Radiobutton.module.css";

const Radiobutton = ({ index, active, condition }) => {
  const [vision, setVision] = useState();
  const [activeClass, setActiveClass] = useState(style.point);

  useEffect(() => {
    setVision(condition);
  }, [condition]);

  useEffect(() => {
    if (vision) {
      setActiveClass(style.active);
    } else {
      setActiveClass(style.point);
    }
  }, [vision]);

  return (
    <div
      className={style.radiobuttonContainer}
      onClick={() => {
        setVision(!vision);
        active(index);
      }}
    >
      <div className={activeClass}></div>
    </div>
  );
};

export default Radiobutton;

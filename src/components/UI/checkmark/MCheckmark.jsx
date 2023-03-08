import React, { useEffect, useState } from "react";
import style from "./MCheckmark.module.css";

const MCheckmark = ({ id, add, del, deleteList }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [activeClass, setActiveClass] = useState(style.mark);

  useEffect(() => {
    deleteList.indexOf(id) != -1 ? setIsChecked(true) : setIsChecked(false);
  });

  useEffect(() => {
    deleteList.indexOf(id) != -1 ? setIsChecked(true) : setIsChecked(false);
  }, [id]);

  useEffect(() => {
    if (isChecked) {
      setActiveClass(style.active);
      console.log("active");
      add(id);
    } else {
      setActiveClass(style.mark);
      console.log("dis");
      del(id);
    }
  }, [isChecked]);

  return (
    <div
      className={style.mCheckmark}
      onClick={() => {
        setIsChecked(!isChecked);
      }}
    >
      <div className={activeClass}></div>
    </div>
  );
};

export default MCheckmark;

import React, { useMemo, useState, useEffect } from "react";
import classes from "./Mmodal.module.css";
import close from "./image/close.svg";

const Mmodal = ({ children, vision, setVision }) => {
  const rootClasses = [classes.Mmodal];
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVision(vision);
  }, []);

  if (vision) {
    rootClasses.push(classes.active);
  }

  return (
    <div className={rootClasses.join(" ")} onClick={() => setVision(!vision)}>
      <div
        className={classes.MmodalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.closeButton} onClick={() => setVision(false)}>
          <img src={close} alt="" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Mmodal;

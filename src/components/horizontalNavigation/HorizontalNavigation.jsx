import React, { useState } from "react";
import style from "../horizontalNavigation/HorizontalNavigation.module.css";
import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";

const HorizontalNavigation = ({ page }) => {
  const [activePage, setActivePage] = useState(0);
  return (
    <div className={style.navigationContainer}>
      {(page ?? ["undefined"]).map((element, index) => (
        <div
          key={index}
          className={style.navigationElementBox}
          onClick={(e) => setActivePage(index)}
        >
          <CustomLink
            setActive={setActivePage}
            index={index}
            to={element[1]}
            className={style.text}
          >
            {element[0]}
          </CustomLink>
          <div
            className={index == activePage ? style.lineActive : style.line}
          ></div>
        </div>
      ))}
    </div>
  );
};

function CustomLink({ children, to, index, setActive, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  if (match) {
    setActive(index);
  }

  return (
    <div>
      <Link to={to} {...props}>
        {children}
      </Link>
    </div>
  );
}

export default HorizontalNavigation;

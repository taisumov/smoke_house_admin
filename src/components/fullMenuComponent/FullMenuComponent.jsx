import React, { useEffect, useState } from "react";
import HorizontalNavigation from "../horizontalNavigation/HorizontalNavigation";
import Menu from "../menu/Menu";

import style from "../fullMenuComponent/FullMenuComponent.module.css";

import { Outlet, Navigate } from "react-router-dom";

const FullMenuComponent = () => {
  const [navigationElements, setNavigationElements] = useState();
  const [data, setData] = useState("123"); //удалить потом

  return (
    <div className={style.pageBlock}>
      <Menu setNavigationElements={setNavigationElements} />
      <div className={style.container}>
        <HorizontalNavigation page={navigationElements} />
        <Outlet />
      </div>
    </div>
  );
};

export default FullMenuComponent;

import React, { useState, useEffect, useLayoutEffect } from "react";
import style from "./Menu.module.css";
import logo from "./image/logo.svg";
import IconMain from "./image/house-fill.svg";
import IconMainD from "./image/house-fill-dark.svg";
import iconPoster from "./image/card-image.svg";
import iconPosterD from "./image/card-image-dark.svg";
import iconPlaces from "./image/tv-fill.svg";
import iconPlacesD from "./image/tv-fill-dark.svg";
import iconArchive from "./image/archive-fill.svg";
import iconArchiveD from "./image/archive-fill-dark.svg";
import iconProject from "./image/motherboard-fill.svg";
import iconProjectD from "./image/motherboard-fill-dark.svg";
import iconSending from "./image/envelope-plus-fill.svg";
import iconSendingD from "./image/envelope-plus-fill-dark.svg";

import {
  Link,
  LinkProps,
  useMatch,
  useResolvedPath,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Menu = ({ setNavigationElements }) => {
  let navigate = useNavigate();
  const [menuElement, setMenuElement] = useState([
    [
      "Главная",
      IconMain,
      IconMainD,
      true,
      [
        ["Шапка", "header"],
        ["Акции", "sales"],
        ["Преимущества", "advantage"],
        ["Видео", "video"],
        ["Форма заказа", "orderForm"],
        ["Подвал", "footer"],
      ],
      "/",
    ],
    [
      "О нас",
      iconPoster,
      iconPosterD,
      false,
      [
        ["Фото", "aboutUs/photo"],
        ["Причины работать с нами", "aboutUs/workWithUs"],
        ["Мы в СМИ", "aboutUs/review"],
        ["Производство", "aboutUs/production"],
      ],
      "/aboutUs",
    ],
    [
      "Каталог",
      iconPlaces,
      iconPlacesD,
      false,
      [
        ["Коптильни", "catalog/smoke"],
        ["Дымогенераторы", "catalog/smokeGenerators"],
        ["Парогенераторы", "catalog/steamGenerators"],
        ["Сушильные шкафы", "catalog/dryingCabinets"],
        ["Дополнительные товары", "catalog/additional"],
        ["Пароконвектоматы", "catalog/combiSteamer"],
      ],
      "/catalog",
    ],
    [
      "Технология",
      iconArchive,
      iconArchiveD,
      false,
      [["Технология", "technology"]],
      "/technology",
    ],
    [
      "Доставка",
      iconProject,
      iconProjectD,
      false,
      [["Доставка", "delivery"]],
      "/delivery",
    ],
    [
      "Отзывы",
      iconSending,
      iconSendingD,
      false,
      [["Отзывы", "reviews"]],
      "/reviews",
    ],
  ]);
  const [activeElement, setActiveElement] = useState(0);
  let loc = useLocation();

  useEffect(() => {
    let location = loc.pathname;
    menuElement.forEach((element, index) => {
      if (location.includes(element[5])) {
        setActiveElement(index);
      }
    });
    if (location == "/") {
      navigate("../header", { replace: true });
    }
  }, []);

  useLayoutEffect(() => {
    setNavigationElements(menuElement[activeElement][4]);
  }, [activeElement]);

  function click(index, elem) {
    setActiveElement(index);
  }

  return (
    <div className={style.leftMenu}>
      <div className={style.menuLogo}>
        <img src={logo} alt="" />
      </div>
      <div className={style.menuElementBox}>
        {menuElement.map((element, index) => (
          <CustomLink
            index={index}
            setActive={setActiveElement}
            to={"/" + element[4][0][1]}
            key={index}
            className={
              index != activeElement
                ? style.menuElementBox__element
                : style.menuElementBox__element__active
            }
            onClick={() => {
              click(index, element);
            }}
          >
            <img
              className={style.elementIcon}
              src={index == activeElement ? element[2] : element[1]}
              alt=""
            />
            <div className={style.elementText}>{element[0]}</div>
          </CustomLink>
        ))}
      </div>
    </div>
  );
};

function CustomLink({ children, to, index, setActive, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  let loc = useLocation();

  if (loc.pathname.includes(resolved.pathname)) {
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

export default Menu;

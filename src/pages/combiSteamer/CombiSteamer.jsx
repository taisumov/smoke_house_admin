import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MButton from "../../components/UI/button/MButton";
import { host } from "../../http/axios";
import style from "./CombiSteam.module.css";

const CombiSteamer = () => {
  const [catalog, setCatalog] = useState([]);
  const navigate = useNavigate();

  function deleteProduct(id) {
    host
      .delete(`/api/item/delete/${id}`)
      .then((res) => {})
      .catch((err) => {
        console.log(err, "get");
      });
  }

  useEffect(() => {
    //setIsLoading(true);
    host
      .post("/api/item/all/get/category", { category: "Пароконвектоматы" })
      .then((res) => {
        setCatalog(res["data"]);
        //setDescription(res["data"]["text"]);
        //setCards(res["data"]["images"]);
        //setIsLoading(false);
        //setEmails(res["data"]["emails"]);
        //setPhones(res["data"]["phones"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }, []);

  return (
    <div className={style.container}>
      <div className={style.catalog}>
        {catalog.map((product, index) => (
          <div className={style.product}>
            <div className={style.product__image}>
              <img
                className={style.product__image__img}
                src={
                  `${process.env.REACT_APP_HOST}/media/` + product["cover"].src
                }
                alt=""
              />
            </div>
            <div className={style.product__name}>{product.name}</div>
            <div className={style.changeButton}>
              <MButton
                onClick={() => {
                  navigate(
                    `/catalog/edit/${product["slug"]}&${"Пароконвектоматы"}`
                  );
                }}
              >
                Редактировать
              </MButton>
            </div>
            <div className={style.deleteButton}>
              <MButton onClick={() => deleteProduct(product["slug"])}>
                Удалить
              </MButton>
            </div>
          </div>
        ))}
      </div>
      <div className={style.createButton}>
        <MButton
          onClick={() => {
            navigate(`/catalog/create/Пароконвектоматы`);
          }}
        >
          Добавить
        </MButton>
      </div>
    </div>
  );
};

export default CombiSteamer;

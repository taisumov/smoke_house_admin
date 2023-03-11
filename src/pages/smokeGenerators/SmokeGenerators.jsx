import React from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import style from "./SmokeGenerators.module.css";
import { useNavigate } from "react-router-dom";
import { host } from "../../http/axios";
import { useEffect } from "react";

const SmokeGenerators = () => {
  const [catalog, setCatalog] = useState([]);
  const navigate = useNavigate();

  function deleteProduct(id) {
    host
      .delete(`/api/item/delete/${id}`)
      .then((res) => {
        console.log(res["data"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  useEffect(() => {
    //setIsLoading(true);
    host
      .post("/api/item/all/get/category", { category: "Дымогенераторы" })
      .then((res) => {
        console.log(res["data"]);
        setCatalog(res["data"]);
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
                    `/catalog/edit/${product["slug"]}&${"Дымогенераторы"}`
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
            navigate(`/catalog/create/Дымогенераторы`);
          }}
        >
          Добавить
        </MButton>
      </div>
    </div>
  );
};

export default SmokeGenerators;

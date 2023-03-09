import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Mtitle from "../../components/UI/title/title";
import style from "./Sales.module.css";
import { host } from "../../http/axios";
import MCheckbox from "../../components/UI/checkbox/MCheckbox";

const Sales = () => {
  const [sales, setSales] = useState([""]);
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  function postData() {
    host
      .post("/api/promo/add", { text: sales, visible })
      .then((res) => {
        console.log(res);
        setSales(res["data"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  function getData() {
    setIsLoading(true);
    host
      .get("/api/promo")
      .then((res) => {
        console.log(res);
        setSales(res["data"]["sales"]);
        setVisible(res["data"]["visible"]);
      })
      .catch((err) => {
        console.log(err, "get");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
        {isLoading ?
            <div className={style.container}>
                <div className={style.sales}>
                    {sales.map((sale, index) => (
                        <div className={style.saleContainer}>
                            <div className={style.controlBlock}>
                                <div className={style.title}>
                                    <Mtitle>Акция {index + 1}</Mtitle>
                                </div>
                                <div
                                    className={style.closeButton}
                                    onClick={() => {
                                        setSales(sales.filter((sale, ind) => ind != index));
                                    }}
                                >
                                    ╳
                                </div>
                            </div>

                            <PostEditor
                                text={sales[index]}
                                setText={(value) => {
                                    setSales(sales.map((el, ind) => (ind === index ? value : el)));
                                }}
                                sales={sales}
                            />
                        </div>
                    ))}
                </div>

                <div className={style.addButton}>
                    <MButton
                        onClick={() => {
                            setSales([...sales, ""]);
                        }}
                    >
                        Добавить акцию
                    </MButton>
                </div>
                <div className={style.uploadButton}>
                    <div className={style.checkboxContainer}>
                        <span className={style.checkboxContainer__text}>Отображать блок</span>
                        <MCheckbox interview={visible} setInterview={setVisible}></MCheckbox>
                    </div>
                    <MButton
                        onClick={(e) => {
                            e.preventDefault();
                            console.log(sales);
                            postData();
                        }}
                    >
                        Сохранить
                    </MButton>
                </div>
            </div>
            :
            <></>
        }
    </div>
  );
};

export default Sales;

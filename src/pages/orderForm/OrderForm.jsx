import React from "react";
import Mtitle from "../../components/UI/title/title";
import Input from "../../components/UI/input/MInput";
import style from "./OrderForm.module.css";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import { useEffect } from "react";
import { host } from "../../http/axios";
import MCheckbox from "../../components/UI/checkbox/MCheckbox";

const OrderForm = () => {
  const [inputForm, setInputForm] = useState([""]);
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    host
      .get("/api/forms/get")
      .then((res) => {
        console.log(res["data"]["names"]);
        setInputForm(res["data"]["names"]);
        setEmail(res["data"]["email"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }, []);

  function postData() {
    let data = inputForm.map((el) => {
      if (el) {
        return { name: el };
      }
    });
    data = [...data, { name: email, is_email: true }, { visible: visible }];
    host
      .post("/api/forms/upload", data)
      .then((res) => {})
      .catch((err) => {
        console.log(err, "get");
      });
  }

  return (
    <div className={style.container}>
      <div className={style.inputsBlock}>
        {inputForm.map((form, index) => (
          <div className={style.inputContainer}>
            <div className={style.titleBlock}>
              <Mtitle>Название поля {index + 1}</Mtitle>
              <div
                className={style.deleteButton}
                onClick={(e) => {
                  setInputForm(inputForm.filter((inputs, ind) => ind != index));
                }}
              >
                ╳
              </div>
            </div>

            <div className={style.input}>
              <Input
                value={inputForm[index]}
                setvalue={(value) => {
                  setInputForm(
                    inputForm.map((el, ind) => (ind === index ? value : el))
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={style.addButton}>
        <MButton
          onClick={(e) => {
            setInputForm([...inputForm, ""]);
          }}
        >
          Добавить поле
        </MButton>
      </div>
      <div className={style.emailInput}>
        <Mtitle>Почта для отправки заказа</Mtitle>
        <div className={style.input}>
          <Input value={email} setvalue={setEmail} />
        </div>
      </div>
      <div className={style.saveButton}>
        <div className={style.checkboxContainer}>
          <span className={style.checkboxContainer__text}>Отображать блок</span>
          <MCheckbox interview={visible} setInterview={setVisible}></MCheckbox>
        </div>
        <MButton
          onClick={(e) => {
            postData();
          }}
        >
          Сохранить
        </MButton>
      </div>
    </div>
  );
};

export default OrderForm;

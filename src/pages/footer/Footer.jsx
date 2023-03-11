import React from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import MInput from "../../components/UI/input/MInput";
import Mtitle from "../../components/UI/title/title";
import style from "./Footer.module.css";
import { useEffect } from "react";
import { host } from "../../http/axios";

const Footer = () => {
  const [phones, setPhones] = useState([{}, {}]);
  const [emails, setEmails] = useState([{}]);
  //const [data, setData] = useState([{}]);

  useEffect(() => {
    host
      .get("/api/footer")
      .then((res) => {
        console.log(res["data"]);
        setEmails(res["data"]["emails"]);
        setPhones(res["data"]["phones"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }, []);

  function postData() {
    let data = [];
    phones.map((el) => {
      data.push({ ...el, type: "number" });
    });
    emails.map((el) => {
      data.push({ ...el, type: "email" });
    });
    host
      .post("/api/footer", data)
      .then((res) => {
        alert(
          res.status === 200
            ? "Сохранение прошло успешно! Обновите страницу для обновления информации."
            : "Ошибка при сохранении! Обновите страницу и попробуйте снова."
        );
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  return (
    <div className={style.container}>
      <div className={style.phoneBlock}>
        <Mtitle style={{ fontSize: "24px" }}>Блок с номерами телефонов</Mtitle>
        {phones.map((phone, index) => (
          <div className={style.phone}>
            <div className={style.name}>
              <Mtitle>Название отдела</Mtitle>
              <div className={style.input}>
                <MInput
                  value={phones[index]["name"]}
                  setvalue={(value) => {
                    setPhones(
                      phones.map((val, ind) =>
                        index === ind ? { ...phones[index], name: value } : val
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div className={style.tel}>
              <Mtitle>Номер телефона</Mtitle>
              <div className={style.input}>
                <MInput
                  value={phones[index]["value"]}
                  setvalue={(value) => {
                    setPhones(
                      phones.map((val, ind) =>
                        index === ind ? { ...phones[index], value: value } : val
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div
              className={style.closeButton}
              onClick={() =>
                setPhones(phones.filter((ph, ind) => ind != index))
              }
            >
              ╳
            </div>
          </div>
        ))}
        <div className={style.addButton}>
          <MButton
            onClick={(e) => {
              setPhones([...phones, {}]);
            }}
          >
            Добавить
          </MButton>
        </div>
      </div>
      <div className={style.emailBlock}>
        <Mtitle style={{ fontSize: "24px" }}>Блок с эмейлами</Mtitle>
        {emails.map((email, index) => (
          <div className={style.phone}>
            <div className={style.name}>
              <Mtitle>Название отдела</Mtitle>
              <div className={style.input}>
                <MInput
                  value={emails[index]["name"]}
                  setvalue={(value) => {
                    setEmails(
                      emails.map((val, ind) =>
                        index === ind ? { ...emails[index], name: value } : val
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div className={style.tel}>
              <Mtitle>Email</Mtitle>
              <div className={style.input}>
                <MInput
                  value={emails[index]["value"]}
                  setvalue={(value) => {
                    setEmails(
                      emails.map((val, ind) =>
                        index === ind ? { ...emails[index], value: value } : val
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div
              className={style.closeButton}
              onClick={() =>
                setEmails(emails.filter((em, ind) => ind != index))
              }
            >
              ╳
            </div>
          </div>
        ))}
        <div className={style.addButton}>
          <MButton
            onClick={(e) => {
              setEmails([...emails, {}]);
            }}
          >
            Добавить{" "}
          </MButton>
        </div>
      </div>
      <div className={style.saveButton}>
        <MButton onClick={() => postData()}>Сохранить</MButton>
      </div>
    </div>
  );
};

export default Footer;

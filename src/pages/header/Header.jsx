import React from "react";
import Image from "../../components/UI/Image/Image";
import Title from "../../components/UI/title/title";
import Button from "../../components/UI/button/MButton";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import style from "./Header.module.css";
import { useState } from "react";
import { host } from "../../http/axios";
import { useEffect } from "react";
import MCheckbox from "../../components/UI/checkbox/MCheckbox";

const Header = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([undefined]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    updateData();
  }, []);

  function updateData() {
    let a = [];
    setIsLoading(true);
    host
      .get("/api/header")
      .then((res) => {
        console.log(res["data"]);
        a = res["data"];
        setTitle(a["title"]);
        setDescription(a["description"]);
        setImage([a["image"]]);
        setVisible(a["visible"]);
      })
      .catch((err) => {
        console.log(err, "get");
      })
      .finally(() => setIsLoading(false));
  }

  async function postImage() {
    let finalId = [];
    let files = [];

    image.map((id) => {
      console.log(typeof id, "id");
      if (id) {
        if (typeof id != "object") {
          finalId.push(id);
        } else {
          let dataArray = new FormData();
          dataArray.append("file", id);
          files.push(dataArray);
        }
      }
    });

    await Promise.all(
      files.map((file) => {
        console.log(`${process.env["REACT_APP_HOST"]}/api/media/upload`);
        console.log(file);
        console.log(`Bearer ${sessionStorage.getItem("jwt")}`);
        return host
          .post(`${process.env["REACT_APP_HOST"]}/api/media/upload`, file, {
            headers: {
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            finalId.push(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
    ).then(() => console.log(finalId));

    return finalId;
  }

  async function postData() {
    setUpdate((prev) => true);
    await postImage().then((imageIds) => {
      host
        .post("/api/header/", {
          title,
          description,
          image: imageIds[0],
          visible,
        })
        .then((res) => {
          console.log(res, "post");
          alert(
            res.status === 200
              ? "Сохранение прошло успешно! Обновите страницу для обновления информации."
              : "Ошибка при сохранении! Обновите страницу и попробуйте снова."
          );
        })
        .catch((err) => {
          console.log(err, "post");
        });
    });
  }

  return (
    <div>
      {!isLoading ? (
        <>
          <div className={style.headerBlock}>
            <Title>Фото</Title>
            <Image
              id={image[0]}
              setID={(value) =>
                setImage(image.map((el, ind) => (ind === 0 ? value : el)))
              }
              update={update}
            />
          </div>
          <div className={style.headerBlock}>
            <Title>Заголовок</Title>
            <PostEditor text={title} setText={setTitle} />
          </div>
          <div className={style.headerBlock}>
            <Title>Основной текст</Title>
            <PostEditor text={description} setText={setDescription} />
          </div>
          <div className={style.button}>
            <div className={style.checkboxContainer}>
              <span className={style.checkboxContainer__text}>
                Отображать блок
              </span>
              <MCheckbox
                interview={visible}
                setInterview={setVisible}
              ></MCheckbox>
            </div>
            <Button
              onClick={() => {
                console.log({ title: title, description: description });
                postData();
              }}
            >
              Отправить
            </Button>
          </div>
        </>
      ) : (
        <div>Загрузка</div>
      )}
    </div>
  );
};

export default Header;

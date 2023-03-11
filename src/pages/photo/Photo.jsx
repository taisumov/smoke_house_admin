import React from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Mtitle from "../../components/UI/title/title";
import style from "./Photo.module.css";
import { useEffect } from "react";
import { host } from "../../http/axios";
import Image from "../../components/UI/Image/Image";

const Photo = () => {
  const [cards, setCards] = useState([undefined, undefined]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    host
      .get("/api/about")
      .then((res) => {
        console.log(res["data"]);
        setDescription(res["data"]["text"]);
        setCards(res["data"]["images"]);
        setIsLoading(false);
        //setEmails(res["data"]["emails"]);
        //setPhones(res["data"]["phones"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }, []);

  async function postImage() {
    let finalId = [];
    let files = [];

    cards.map((id, index) => {
      if (id) {
        console.log(id, "o");
        if (typeof id != "object") {
          finalId[index] = id;
        } else {
          finalId[index] = undefined;
          let dataArray = new FormData();
          dataArray.append("file", id);
          files.push({ dataArray, index });
        }
      }
    });
    console.log(finalId, "id");
    let data = [...cards];
    console.log(data, "idd");
    await Promise.all(
      files.map((file) => {
        console.log(`${process.env["REACT_APP_HOST"]}/api/media/upload`);
        console.log(file);
        console.log(data[file.index]);
        console.log(`Bearer ${sessionStorage.getItem("jwt")}`);
        return host
          .post(
            `${process.env["REACT_APP_HOST"]}/api/media/upload`,
            file.dataArray,
            {
              headers: {
                "Content-type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            data[file.index] = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      })
    );
    console.log(data, "1");
    // setCards((prev) => data);

    return data;
  }

  async function postData() {
    setUpdate(true);
    let imageIds = await postImage();

    let data = [];

    data = imageIds.map((el) => {
      console.log(el);
      return { src: el };
    });
    data.push({ src: description, is_src_text: true });
    console.log(data);
    host
      .post("/api/about", data)
      .then((res) => {
        console.log(res);
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
      <>
        {cards.map((card, index) => (
          <div className={style.photoContainer}>
            <div className={style.imageAreaContainer}>
              <Mtitle>Блок {index + 1}</Mtitle>
              <Image
                id={card}
                setID={(value) =>
                  setCards(cards.map((el, ind) => (ind == index ? value : el)))
                }
                update={update}
              />
              {/* <ImageArea
                id={card}
                setImage={(value) => {
                  setCards(
                    cards.map((val, ind) => (index === ind ? value : val))
                  );
                }}
              /> */}
            </div>
          </div>
        ))}
      </>
      {!isLoading ? (
        <div className={style.editorBlock}>
          <PostEditor text={description} setText={setDescription} />
        </div>
      ) : (
        <div>Загрузка</div>
      )}

      <div className={style.saveButton}>
        <MButton
          onClick={() => {
            postData();
          }}
        >
          Сохранить
        </MButton>
      </div>
    </div>
  );
};

export default Photo;

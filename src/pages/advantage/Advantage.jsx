import React, { useLayoutEffect } from "react";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Title from "../../components/UI/title/title";
import style from "./Advantage.module.css";
import Button from "../../components/UI/button/MButton";
import { useState } from "react";
import { useEffect } from "react";
import { host } from "../../http/axios";
import MCheckbox from "../../components/UI/checkbox/MCheckbox";
import { useBeforeunload } from "react-beforeunload";
import Image from "../../components/UI/Image/Image";

const Advantage = () => {
  const [advantage, setAdvantage] = useState([]);

  const [visible, setVisible] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    await host
      .get("/api/advantages")
      .then((res) => {
        setAdvantage(res["data"]["advantages"]);
        setVisible(res["data"]["visible"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  async function postImage() {
    let finalId = [];
    let files = [];

    advantage.map((id, index) => {
      if (id?.main_photo) {
        if (typeof id.main_photo != "object") {
          finalId[index] = id.main_photo;
        } else {
          finalId[index] = undefined;
          let dataArray = new FormData();
          dataArray.append("file", id.main_photo);
          files.push({ dataArray, index });
        }
      }
    });

    let data = [...advantage];
    await Promise.all(
      files.map((file) => {
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
            data[file.index]["main_photo"] = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      })
    ).then(() => {
      setAdvantage(data);
    });

    return finalId;
  }

  async function postData() {
    setUpdate((prev) => (prev = true));
    await postImage().then((imageIds) => {
      host
        .post("/api/advantages", { advantage, visible })
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
    });
  }

  return (
    <div>
      <>
        {advantage.map((el, index) => (
          <div className={style.advantageContainer}>
            <Title style={{ fontSize: "28px" }}>Преимущество {index + 1}</Title>
            <div className={style.imgContainer}>
              <div className={style.imgBlock}>
                <Title>Основное фото</Title>
                {/* <ImageArea
                  id={el["main_photo"]}
                  setImage={(value) => {
                    setAdvantage(
                      advantage.map((val, ind) =>
                        index === ind
                          ? { ...advantage[index], main_photo: value }
                          : val
                      )
                    );
                  }}
                /> */}
                <Image
                  id={advantage[index]?.main_photo}
                  setID={(value) =>
                    setAdvantage(
                      advantage.map((el, ind) =>
                        ind === index ? { ...el, main_photo: value } : el
                      )
                    )
                  }
                  update={update}
                />
              </div>
            </div>
            <div className={style.editorContainer}>
              <div className={style.editorBlock}>
                <Title>Заголовок</Title>
                <PostEditor
                  text={el["title"]}
                  setText={(value) => {
                    setAdvantage(
                      advantage.map((val, ind) =>
                        index === ind
                          ? { ...advantage[index], title: value }
                          : val
                      )
                    );
                  }}
                />
              </div>
              <div className={style.editorBlock}>
                <Title>Основной текст</Title>
                <PostEditor
                  text={el["description"]}
                  setText={(value) => {
                    setAdvantage(
                      advantage.map((val, ind) =>
                        index === ind
                          ? { ...advantage[index], description: value }
                          : val
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </>
      <div className={style.buttonContainer}>
        <div className={style.checkboxContainer}>
          <span className={style.checkboxContainer__text}>Отображать блок</span>
          <MCheckbox interview={visible} setInterview={setVisible}></MCheckbox>
        </div>
        <Button onClick={() => postData()}>Сохранить</Button>
      </div>
    </div>
  );
};

export default Advantage;

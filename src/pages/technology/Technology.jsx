import React from "react";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Title from "../../components/UI/title/title";
import style from "./Technology.module.css";
import Button from "../../components/UI/button/MButton";
import MInput from "../../components/UI/input/MInput";
import { useState } from "react";
import { host } from "../../http/axios";
import { useEffect } from "react";
import Image from "../../components/UI/Image/Image";

const Technology = () => {
  const [data, setData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    host
      .get("/api/tech")
      .then((res) => {
        console.log(res["data"]["techs"]);
        setData(res["data"]["techs"]);
        //setData(res["data"]);
        //setEmails(res["data"]["emails"]);
        //setPhones(res["data"]["phones"]);
      })
      .catch((err) => {
        console.log(err, "get");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function postImage() {
    let finalId = [];
    let files = [];

    data.map((id, index) => {
      if (id.src) {
        console.log(id.src, "o");
        if (typeof id.src != "object") {
          finalId[index] = id.src;
        } else {
          finalId[index] = undefined;
          let dataArray = new FormData();
          dataArray.append("file", id.src);
          files.push({ dataArray, index });
        }
      }
    });
    console.log(finalId, "id");
    let dataExtra = [...data];
    console.log(data, "idd");
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
            dataExtra[file.index]["src"] = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      })
    );
    console.log(dataExtra, "1");
    // setCards((prev) => data);

    return data;
  }

  async function postData() {
    setUpdate(true);
    let imageIds = await postImage();

    host
      .post("/api/tech", imageIds)
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
    <div>
      {!isLoading ? (
        <>
          {data.map((el, index) => (
            <div className={style.advantageContainer} key={index}>
              <Title style={{ fontSize: "28px" }}>Технология {index + 1}</Title>
              <div className={style.imgContainer}>
                <div className={style.imgBlock}>
                  <Title>Фото</Title>
                  <Image
                    id={el.src}
                    setID={(value) =>
                      setData(
                        data.map((el, ind) =>
                          ind == index ? { ...data[index], src: value } : el
                        )
                      )
                    }
                    update={update}
                  />
                  {/* <ImageArea
                    id={data[index]["src"]}
                    setImage={(value) => {
                      setData(
                        data.map((val, ind) =>
                          index === ind ? { ...data[index], src: value } : val
                        )
                      );
                    }}
                  /> */}
                </div>

                <div className={style.videoBlock}>
                  <Title>Ссылка на видео</Title>
                  <MInput
                    value={data[index]["link"]}
                    setvalue={(value) => {
                      setData(
                        data.map((val, ind) =>
                          index === ind ? { ...data[index], link: value } : val
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <div className={style.editorContainer}>
                <div className={style.editorBlock}>
                  <Title>Заголовок</Title>
                  <PostEditor
                    text={data[index]["title"]}
                    setText={(value) => {
                      setData(
                        data.map((val, ind) =>
                          index === ind ? { ...data[index], title: value } : val
                        )
                      );
                    }}
                  />
                </div>
                <div className={style.editorBlock}>
                  <Title>Основной текст</Title>
                  <PostEditor
                    text={data[index]["description"]}
                    setText={(value) => {
                      setData(
                        data.map((val, ind) =>
                          index === ind
                            ? { ...data[index], description: value }
                            : val
                        )
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className={style.buttonContainer}>
            <Button onClick={() => postData()}>Сохранить</Button>
          </div>
        </>
      ) : (
        <div>Загрузка</div>
      )}
    </div>
  );
};

export default Technology;

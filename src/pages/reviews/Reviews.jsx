import React from "react";
import style from "./Reviews.module.css";
import MButton from "../../components/UI/button/MButton";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import MInput from "../../components/UI/input/MInput";
import Mtitle from "../../components/UI/title/title";
import { useState } from "react";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import { host } from "../../http/axios";
import { useEffect } from "react";
import Image from "../../components/UI/Image/Image";

const Reviews = () => {
  const [images, setImages] = useState([
    { src: undefined, id: undefined },
    { src: undefined, id: undefined },
  ]);
  const [video, setVideo] = useState(["", ""]);
  const [text, setText] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [counter, setCounter] = useState(0);
  const [delList, setDelList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    host
      .get("/api/feedback")
      .then((res) => {
        console.log(res["data"]);
        setImages(
          res["data"]["photo"].map((el, index) => {
            return { src: el, id: index };
          })
        );
        setCounter(res["data"]["photo"].length);
        setVideo(res["data"]["video"]);
        setText(res["data"]["text"]);
        //setCards(res["data"]);
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

    images.map((id, index) => {
      if (id.src) {
        console.log(id, "o");
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
    let data = [...images];
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
            data[file.index].src = res.data;
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

  async function deleteImage() {
    await Promise.all(
      delList.map((el) => {
        return host
          .post(
            `${process.env["REACT_APP_HOST"]}/api/media/delete`,
            JSON.stringify({ img: el }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log("delete success");
          })
          .catch((err) => {
            console.log(err);
          });
      })
    );
  }

  async function postData() {
    setUpdate(true);
    let imageIds = await postImage();
    await deleteImage();
    console.log(images);
    let data = [];
    imageIds.map((img) => {
      data.push({ content: img.src, type: "photo" });
    });
    video.map((vid) => {
      data.push({ content: vid, type: "video" });
    });
    text.map((txt) => {
      data.push({ content: txt, type: "text" });
    });

    host
      .post("/api/feedback", data)
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
      {!isLoading ? (
        <>
          <div className={style.imageContainer}>
            <Mtitle style={{ fontSize: "24px" }}>Отзывы картинками</Mtitle>
            <div className={style.images}>
              {images.map((image, index) => (
                <div className={style.image} key={image.id}>
                  <Image
                    id={image.src}
                    setID={(value) =>
                      setImages(
                        images.map((el, ind) =>
                          ind == index ? { ...images[index], src: value } : el
                        )
                      )
                    }
                    update={update}
                  />
                  {/* <ImageArea
                    id={image}
                    setImage={(value) => {
                      setImages(
                        images.map((val, ind) => (index === ind ? value : val))
                      );
                    }}
                  /> */}
                  <div className={style.deleteButton}>
                    <MButton
                      onClick={() => {
                        console.log(images[index], "1111");
                        if (typeof images[index].src != "object")
                          if (images[index].src.indexOf("/") === -1) {
                            console.log("delete");
                            setDelList([...delList, images[index].src]);
                          }

                        setImages(images.filter((im, ind) => ind != index));
                      }}
                    >
                      Удалить
                    </MButton>
                  </div>
                </div>
              ))}
            </div>
            <div className={style.addButton}>
              <MButton
                onClick={() => {
                  setCounter((prev) => counter + 1);
                  setImages([...images, { src: undefined, id: counter }]);
                }}
              >
                Добавить
              </MButton>
            </div>
          </div>
          <div className={style.videoContainer}>
            <Mtitle style={{ fontSize: "24px" }}>Видео отзывы</Mtitle>
            <div className={style.videoBox}>
              {video.map((vid, index) => (
                <div className={style.video} key={index}>
                  <div className={style.link}>
                    <MInput
                      value={video[index]}
                      setvalue={(value) => {
                        setVideo(
                          video.map((val, ind) => (index === ind ? value : val))
                        );
                      }}
                    />
                  </div>
                  <div
                    className={style.delete}
                    onClick={() => {
                      setVideo(video.filter((vid, ind) => ind != index));
                    }}
                  >
                    ╳
                  </div>
                </div>
              ))}
            </div>
            <div className={style.addButton}>
              <MButton
                onClick={() => {
                  setVideo([...video, ""]);
                }}
              >
                Добавить
              </MButton>
            </div>
          </div>
          <div className={style.textContainer}>
            <Mtitle style={{ fontSize: "24px" }}>Текстовые отзывы</Mtitle>
            <div className={style.videoBox}>
              {text.map((txt, index) => (
                <div className={style.video} key={index}>
                  <div className={style.link}>
                    <PostEditor
                      text={text[index]}
                      setText={(value) => {
                        setText(
                          text.map((el, ind) => (ind === index ? value : el))
                        );
                      }}
                      sales={text}
                    />
                  </div>
                  <div
                    className={style.delete}
                    onClick={() => {
                      setText(text.filter((vid, ind) => ind != index));
                    }}
                  >
                    ╳
                  </div>
                </div>
              ))}
            </div>
            <div className={style.addButton}>
              <MButton
                onClick={() => {
                  setText([...text, ""]);
                }}
              >
                Добавить
              </MButton>
            </div>
          </div>
          <div className={style.saveButton}>
            <MButton onClick={() => postData()}>Сохранить</MButton>
          </div>
        </>
      ) : (
        <div>Загрузка</div>
      )}
    </div>
  );
};

export default Reviews;

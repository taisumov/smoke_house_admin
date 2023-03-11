import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import MInput from "../../components/UI/input/MInput";
import Mtitle from "../../components/UI/title/title";
import style from "./Review.module.css";
import { host } from "../../http/axios";
import Image from "../../components/UI/Image/Image";

const Review = () => {
  const [video, setVideo] = useState([{ src: "" }, { src: "" }]);
  const [picture, setPicture] = useState([{}, {}]);
  const [update, setUpdate] = useState(false);
  const [counter, setCounter] = useState(0);
  const [delList, setDelList] = useState([]);

  useEffect(() => {
    host
      .get("/api/massmedia")
      .then((res) => {
        console.log(res["data"]);
        setPicture(
          res["data"]["photo"].map((el, index) => {
            return { ...el, id: index };
          })
        );
        setCounter(res["data"]["photo"].length);
        if (res["data"]["video"].length) setVideo(res["data"]["video"]);
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

    picture.map((id, index) => {
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
    let data = [...picture];
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
            data[file.index]["src"] = res.data;
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
    let data = [];
    await deleteImage();
    imageIds.map((pic) => {
      data.push({ ...pic, type: "photo" });
    });
    video.map((vid) => {
      data.push({ ...vid, type: "video" });
    });
    console.log(data);
    host
      .post("/api/massmedia", data)
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
      <div className={style.imageContainer}>
        <Mtitle style={{ fontSize: "24px" }}>Загрузка картинок</Mtitle>
        <div className={style.images}>
          {picture.map((image, index) => (
            <div className={style.image} key={image.id}>
              <Image
                id={image.src}
                setID={(value) =>
                  setPicture(
                    picture.map((el, ind) =>
                      ind == index ? { ...picture[index], src: value } : el
                    )
                  )
                }
                update={update}
              />
              {/* <ImageArea
                id={image["src"]}
                setImage={(value) => {
                  setPicture(
                    picture.map((val, ind) =>
                      index === ind ? { ...picture[index], src: value } : val
                    )
                  );
                }}
              /> */}
              <div className={style.deleteButton}>
                <div className={style.description}>
                  <MInput
                    placeholder={"Подпись"}
                    value={image["title"]}
                    setvalue={(value) => {
                      setPicture(
                        picture.map((val, ind) =>
                          index === ind
                            ? { ...picture[index], title: value }
                            : val
                        )
                      );
                    }}
                  />
                </div>
                <MButton
                  onClick={() => {
                    if (typeof picture[index].src != "object")
                      if (picture[index].src.indexOf("/") === -1) {
                        console.log("delete");
                        setDelList([...delList, picture[index].src]);
                      }
                    setPicture((prev) =>
                      picture.filter((sale, ind) => ind != index)
                    );
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
              setPicture([...picture, { src: undefined, id: counter }]);
            }}
          >
            Добавить
          </MButton>
        </div>
      </div>
      <div className={style.videoContainer}>
        <Mtitle style={{ fontSize: "24px" }}>Загрузка видео</Mtitle>
        <div className={style.videoBox}>
          {video.map((vid, index) => (
            <div className={style.video}>
              <div className={style.link}>
                <MInput
                  value={vid["src"]}
                  setvalue={(value) => {
                    setVideo(
                      video.map((val, ind) =>
                        index === ind ? { ...video[index], src: value } : val
                      )
                    );
                  }}
                />
              </div>
              {/* <div
                className={style.delete}
                onClick={() => {
                  setVideo(video.filter((vid, ind) => ind != index));
                }}
              >
                ╳
              </div> */}
            </div>
          ))}
        </div>
        {/* <div className={style.addButton}>
          <MButton
            onClick={() => {
              setVideo([...video, ""]);
            }}
          >
            Добавить
          </MButton>
        </div> */}
        <div className={style.saveButton}>
          <MButton onClick={() => postData()}>Сохранить</MButton>
        </div>
      </div>
    </div>
  );
};

export default Review;

import React from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import MInput from "../../components/UI/input/MInput";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Mtitle from "../../components/UI/title/title";
import style from "./WorkWithUs.module.css";
import { host } from "../../http/axios";
import { useEffect } from "react";
import Image from "../../components/UI/Image/Image";

const WorkWithUs = () => {
  const [dataJSON, setDataJSON] = useState([{}, {}, {}, {}, {}, {}]);
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    host
      .get("/api/reasons")
      .then((res) => {
        console.log(res["data"]);
        setDataJSON(res["data"]);
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

    dataJSON.map((id, index) => {
      if (id.img) {
        console.log(id.img, "o");
        if (typeof id.img != "object") {
          finalId[index] = id.img;
        } else {
          finalId[index] = undefined;
          let dataArray = new FormData();
          dataArray.append("file", id.img);
          files.push({ dataArray, index });
        }
      }
    });
    console.log(finalId, "id");
    let data = [...dataJSON];
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
            data[file.index]["img"] = res.data;
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
    console.log(imageIds);
    host
      .post("/api/reasons", imageIds)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  return (
    <div className={style.container}>
      {!isLoading ? (
        <>
          {dataJSON.map((el, index) => (
            <>
              <div className={style.cardsContainer}>
                <Mtitle style={{ fontSize: "30px" }}>Блок {index + 1}</Mtitle>
                <div className={style.titleContainer}>
                  <div className={style.title}>
                    <Mtitle>Заголовок</Mtitle>
                    <MInput
                      value={dataJSON[index]["title"]}
                      setvalue={(value) => {
                        setDataJSON(
                          dataJSON.map((val, ind) =>
                            index === ind
                              ? { ...dataJSON[index], title: value }
                              : val
                          )
                        );
                      }}
                    />
                  </div>
                  <div className={style.color}>
                    <Mtitle>Цвет</Mtitle>
                    <MInput
                      value={dataJSON[index]["color"]}
                      setvalue={(value) => {
                        setDataJSON(
                          dataJSON.map((val, ind) =>
                            index === ind
                              ? { ...dataJSON[index], color: value }
                              : val
                          )
                        );
                      }}
                    />
                  </div>
                </div>
                <div className={style.imageContainer}>
                  <div className={style.image}>
                    <Image
                      id={el.img}
                      setID={(value) =>
                        setDataJSON(
                          dataJSON.map((el, ind) =>
                            ind == index
                              ? { ...dataJSON[index], img: value }
                              : el
                          )
                        )
                      }
                      update={update}
                    />
                    {/* <ImageArea
                      id={data[index]["img"]}
                      setImage={(value) => {
                        setData(
                          data.map((val, ind) =>
                            index === ind ? { ...data[index], img: value } : val
                          )
                        );
                      }}
                    /> */}
                  </div>
                  <div className={style.editor}>
                    <Mtitle>Описание</Mtitle>
                    <PostEditor
                      text={dataJSON[index]["description"]}
                      setText={(value) => {
                        setDataJSON(
                          dataJSON.map((val, ind) =>
                            index === ind
                              ? { ...dataJSON[index], description: value }
                              : val
                          )
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          ))}
        </>
      ) : (
        <div>Загрузка</div>
      )}
      <div className={style.saveButton}>
        <MButton onClick={() => postData()}>Сохранить</MButton>
      </div>
    </div>
  );
};

export default WorkWithUs;

import React from "react";
import { useState } from "react";
import MButton from "../../components/UI/button/MButton";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Mtitle from "../../components/UI/title/title";
import style from "./Production.module.css";
import { host } from "../../http/axios";
import { useEffect } from "react";
import Image from "../../components/UI/Image/Image";

const Production = () => {
  const [cards, setCards] = useState([{}, {}]);
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    host
      .get("/api/prodinfo")
      .then((res) => {
        console.log(res);
        setCards(res["data"]);
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

    cards.map((id, index) => {
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

  async function postData() {
    setUpdate(true);
    let imageIds = await postImage();
    console.log(imageIds, "111");

    host
      .post("/api/prodinfo", imageIds)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  return (
    <>
      <div className={style.container}>
        {!isLoading ? (
          <>
            {cards.map((card, index) => (
              <div className={style.photoContainer} key={index}>
                <div className={style.imageAreaContainer}>
                  <Mtitle>Блок {index + 1}</Mtitle>
                  <Image
                    id={card.src}
                    setID={(value) =>
                      setCards(
                        cards.map((el, ind) =>
                          ind == index ? { ...cards[index], src: value } : el
                        )
                      )
                    }
                    update={update}
                  />
                  {/* <ImageArea
                  id={cards[index]["src"]}
                  setImage={(value) => {
                    setCards(
                      cards.map((val, ind) =>
                        index === ind ? { ...cards[index], src: value } : val
                      )
                    );
                  }}
                /> */}
                </div>

                {/* <div className={style.editorBlock}>
                <PostEditor
                  text={card["title"]}
                  setText={(value) => {
                    setCards(
                      cards.map((val, ind) =>
                        index === ind ? { ...cards[index], title: value } : val
                      )
                    );
                  }}
                />
              </div> */}
              </div>
            ))}
          </>
        ) : (
          <div>Загрузка</div>
        )}
      </div>
      <div className={style.saveButton}>
        <MButton
          onClick={() => {
            postData();
          }}
        >
          Сохранить
        </MButton>
      </div>
    </>
  );
};

export default Production;

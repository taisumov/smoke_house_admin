import React from "react";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Title from "../../components/UI/title/title";
import style from "./Delivery.module.css";
import Button from "../../components/UI/button/MButton";
import MInput from "../../components/UI/input/MInput";
import { host } from "../../http/axios";
import { useState } from "react";
import { useEffect } from "react";

const Item = ({ state, setState, index }) => {
  return (
    <>
      <Title style={{ fontSize: "28px" }}>Блок {index + 1}</Title>
      <div className={style.editorBlock}>
        <Title>Заголовок</Title>
        <PostEditor
          text={state[index]["header"]}
          setText={(value) => {
            setState(
              state.map((val, ind) =>
                index === ind ? { ...state[index], header: value } : val
              )
            );
          }}
        />
      </div>
      {state[index].type === "text" && (
        <div className={style.editorBlock}>
          <Title>Основной текст</Title>
          <PostEditor
            text={state[index]["value"]}
            setText={(value) => {
              setState(
                state.map((val, ind) =>
                  index === ind
                    ? { ...state[index], value: value, type: "text" }
                    : val
                )
              );
            }}
          />
        </div>
      )}
      {(state[index].type === "image" || state[index].type === "video") && (
        <div className={style.advantageContainer}>
          {(state[index].type === "image" || state[index].value == "") && (
            <>
              <div className={style.imgContainer}>
                <div className={style.imgBlock}>
                  <Title>Фото</Title>
                  <ImageArea
                    id={state[index]["value"]}
                    setImage={(value) => {
                      setState(
                        state.map((val, ind) =>
                          index === ind
                            ? { ...state[index], value: value, type: "image" }
                            : val
                        )
                      );
                    }}
                  />
                </div>
              </div>
            </>
          )}
          {(state[index].type === "video" || state[index].value == "") && (
            <>
              <div className={style.videoBlock}>
                <Title>Ссылка на видео</Title>
                <MInput
                  value={state[index]["value"]}
                  setvalue={(value) => {
                    setState(
                      state.map((val, ind) =>
                        index === ind
                          ? { ...state[index], value: value, type: "video" }
                          : val
                      )
                    );
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

const Delivery = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    host
      .get("/api/delivery")
      .then((res) => {
        console.log(res["data"]);
        setDataArray(res["data"]);
      })
      .catch((err) => {
        console.log(err, "get");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function postData() {
    host
      .post("/api/delivery", dataArray)
      .then((res) => {
        console.log(res["data"]);
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
          {dataArray.map((item, index) => (
            <Item state={dataArray} setState={setDataArray} index={index} />
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

export default Delivery;

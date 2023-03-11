import React from "react";
import style from "./Video.module.css";
import Input from "../../components/UI/input/MInput";
import Mtitle from "../../components/UI/title/title";
import Button from "../../components/UI/button/MButton";
import { useState } from "react";
import { useEffect } from "react";
import { host } from "../../http/axios";
import MCheckbox from "../../components/UI/checkbox/MCheckbox";

const Video = () => {
  const [videoLink, setVideoLink] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    host
      .get("/api/video/main")
      .then((res) => {
        setVideoLink(res?.data.video);
        setVisible(res?.data.visible);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }, []);

  function postData() {
    host
      .post("/api/video/main", { src: videoLink, visible })
      .then((res) => {
        alert(res.status === 200
            ? 'Сохранение прошло успешно! Обновите страницу для обновления информации.'
            : 'Ошибка при сохранении! Обновите страницу и попробуйте снова.')
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }

  return (
    <div>
      <div className={style.videoContainer}>
        <Mtitle>Видео</Mtitle>
        <div className={style.videoBlock}>
          <Input value={videoLink} setvalue={setVideoLink} />
        </div>
        <div className={style.buttonContainer}>
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
              postData();
            }}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Video;

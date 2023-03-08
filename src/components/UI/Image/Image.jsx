import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "../imageArea/ImageArea.module.css";
import iconLoad from "./image/load.svg";
import iconDelete from "./image/iconDelete.svg";
import load from "./image/isLoading.png";
import { useAuth } from "../../../hooks/useAuth";
import { host } from "../../../http/axios";

const Image = ({ width, height, id, setID, update }) => {
  const [deleteStyle, setDeleteStyle] = useState(style.hover);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [file, setFile] = useState();
  const [uploadImage, setUploadImage] = useState(undefined);
  const [del, setDel] = useState(false);
  const [uploadFlag, setUploadFlag] = useState(true);

  useEffect(() => {
    console.log(id);
    if (typeof id != "object" && uploadFlag && id) {
      setUploadFlag(false);
      console.log("lox");
      getImage(id);
    }
  }, [id]);

  useEffect(() => {
    if (update) {
      console.log(del);
      if (del && typeof del != "object") {
        delPost(del);
      }
    }
  }, [update]);

  async function delPost(delId) {
    console.log({ img: delId }, "delete");
    await host
      .post(
        `${process.env["REACT_APP_HOST"]}/api/media/delete`,
        JSON.stringify({ img: delId }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function selectFile(event) {
    if (!uploadImage) {
      event.preventDefault();
      let file_input = document.createElement("input");
      file_input.addEventListener(
        "change",
        (e) => {
          // setFile(file_input.files);
          setUploadImage(URL.createObjectURL(file_input.files[0]));
          console.log(URL.createObjectURL(file_input.files[0]), "1111");
          setID(file_input.files[0]);
          console.log(URL.createObjectURL(file_input.files[0]));
        },
        false
      );
      file_input.type = "file";
      file_input.click();
    }
  }

  function dragStart(e) {
    e.preventDefault();
    setDrag(true);
  }

  function dragLeave(e) {
    e.preventDefault();
    setDrag(false);
  }

  function getImage(id) {
    setUploadImage(`${process.env["REACT_APP_HOST"]}/media/${id}`);
  }

  function deleteImage() {
    if (id) {
      setDel(id);
    }
    setUploadImage(undefined);
    setID(undefined);
    setFile(undefined);
  }

  function onDropFile(e) {
    e.preventDefault();
    let files = [...e.dataTransfer.files];
    setUploadImage(URL.createObjectURL(files[0]));
    setID(files[0]);
    setDrag(false);
  }

  function onMouseEnterHandle(e) {
    file || uploadImage
      ? setDeleteStyle(style.hoverActive)
      : setDeleteStyle(style.hover);
  }

  function onMouseLeaveHandle(e) {
    file || uploadImage
      ? setDeleteStyle(style.hover)
      : setDeleteStyle(style.hover);
  }

  return (
    <div>
      <div
        style={
          deleteStyle == style.hoverActive
            ? {
                outline: "3px solid #37414a",
                border: "none",
                width: width,
                height: height,
              }
            : { width: width, height: height }
        }
        className={style.ImageContainer}
        onClick={(e) => selectFile(e)}
        onMouseEnter={(e) => onMouseEnterHandle(e)}
        onMouseLeave={(e) => onMouseLeaveHandle(e)}
      >
        {file != undefined || uploadImage ? (
          <>
            <div className={deleteStyle}>
              <img
                className={style.deleteButton}
                src={iconDelete}
                alt=""
                onClick={(e) => deleteImage()}
              />
            </div>
            {~fileType.indexOf("image") ? (
              <img
                className={style.image}
                src={uploadImage || URL.createObjectURL(file[0]) || iconLoad}
              />
            ) : (
              <video
                loop
                className={style.image}
                src={URL.createObjectURL(file[0]) || uploadImage || iconLoad}
                autoplay="autoplay"
                muted
              />
            )}
          </>
        ) : loading ? (
          <div className={style.loading}>
            <img className={style.imageLoad} src={load} alt="" />
          </div>
        ) : (
          <>
            <div className={deleteStyle}>
              <img
                className={style.deleteButton}
                src={iconDelete}
                alt=""
                onClick={(e) => deleteImage()}
              />
            </div>
            <div
              className={style.iconBox}
              onDragStart={(e) => dragStart(e)}
              onDragLeave={(e) => dragLeave(e)}
              onDragOver={(e) => dragStart(e)}
              onDrop={(e) => onDropFile(e)}
            >
              <img
                className={style.imageIcon}
                src={iconLoad || iconLoad}
                alt=""
              />
            </div>
            {drag ? (
              <div
                onDragStart={(e) => dragStart(e)}
                onDragLeave={(e) => dragLeave(e)}
                onDragOver={(e) => dragStart(e)}
                onDrop={(e) => onDropFile(e)}
                className={style.text}
              >
                Отпустите файл
              </div>
            ) : (
              <div
                onDragStart={(e) => dragStart(e)}
                onDragLeave={(e) => dragLeave(e)}
                onDragOver={(e) => dragStart(e)}
                onDrop={(e) => onDropFile(e)}
                className={style.text}
              >
                Загрузите или перетащите
                <br />
                файл
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Image;

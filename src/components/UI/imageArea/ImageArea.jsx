import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "../imageArea/ImageArea.module.css";
import iconLoad from "./image/load.svg";
import iconDelete from "./image/iconDelete.svg";
import load from "./image/isLoading.png";
import { useAuth } from "../../../hooks/useAuth";
import { host } from "../../../http/axios";

const ImageArea = ({
  width,
  height,
  contentID,
  image,
  id,
  setImage,
  setDelMedia,
}) => {
  const [drag, setDrag] = useState(false);
  const [uploadImage, setUploadImage] = useState(undefined);
  const [fileId, setFileId] = useState();
  const [deleteStyle, setDeleteStyle] = useState(style.hover);
  const [fileType, setFileType] = useState("image");
  const [loading, setLoading] = useState(false);
  const { gwt, signout } = useAuth();

  useEffect(() => {
    if (id) {
      setUploadImage(`${process.env["REACT_APP_HOST"]}/media/${id}`);
    }
  }, [id]);

  useEffect(() => {
    if (image != undefined) {
      setUploadImage(image);
      setFileId(`${process.env["REACT_APP_HOST"]}/media/${id}`);
    } else {
      setFileId(id);

      if (id != undefined) {
        //getImage(id);
      }
    }
  }, [image]);

  function selectFile(event) {
    if (uploadImage == undefined) {
      event.preventDefault();
      let file_input = document.createElement("input");
      file_input.addEventListener(
        "change",
        (e) => uploadFile(e, file_input),
        false
      );
      file_input.type = "file";
      file_input.click();
    }
  }

  function uploadFile(e, file_input) {
    let dataArray = new FormData();
    for (let i = 0; i < file_input.files.length; i++) {
      dataArray.append("file", file_input.files[i]);
    }
    postImage(dataArray);
  }

  function dragStart(e) {
    e.preventDefault();
    setDrag(true);
  }

  function dragLeave(e) {
    e.preventDefault();
    setDrag(false);
  }



  function postImage(file) {
    setLoading(true);
    host
      .post(`${process.env["REACT_APP_HOST"]}/api/media/upload`, file, {})
      .then((res) => {
        setUploadImage(`${process.env["REACT_APP_HOST"]}/media/${res["data"]}`);
        setImage(res["data"]);
        setFileId(res.data.id);

        setLoading(false);
        return res.data.id;
      })
      .then((id) => {
        //contentID(id);
        //getImage(id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteImage() {
    if (setDelMedia) {
      setDelMedia(fileId);
    }
    host
      .post(`${process.env["REACT_APP_HOST"]}/api/media/delete`, {
        img: uploadImage.split("/").at(-1),
      })
      .then((res) => {
        setUploadImage(undefined);
        setLoading(false);
        setImage("");
        //contentID(undefined);
        setDeleteStyle(style.hover);
      })
      .catch((err) => {
        console.log(err);
        setUploadImage(undefined);
        setLoading(false);
        setImage("");
        //contentID(undefined);
        setDeleteStyle(style.hover);
      });
  }

  function onDropFile(e) {
    e.preventDefault();
    let files = [...e.dataTransfer.files];
    let dataArray = new FormData();
    [...files].map((file) => dataArray.append("file", file));
    postImage(dataArray);
    setDrag(false);
  }

  function onMouseEnterHandle(e) {
    uploadImage != undefined
      ? setDeleteStyle(style.hoverActive)
      : console.log();
  }

  function onMouseLeaveHandle(e) {
    uploadImage != undefined ? setDeleteStyle(style.hover) : console.log();
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
        {uploadImage != undefined ? (
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
              <img className={style.image} src={uploadImage || iconLoad} />
            ) : (
              <video
                loop
                className={style.image}
                src={uploadImage || iconLoad}
                autoplay="autoplay"
              />
            )}
            {/* <iframe className={style.image} src={uploadImage || iconLoad} scrolling="no" width="246px" height="162px"><link type="text/css" rel="Stylesheet" href="../imageArea/ImageArea.module.css" /></iframe> */}
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
                src={uploadImage || iconLoad}
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
                ?????????????????? ????????
              </div>
            ) : (
              <div
                onDragStart={(e) => dragStart(e)}
                onDragLeave={(e) => dragLeave(e)}
                onDragOver={(e) => dragStart(e)}
                onDrop={(e) => onDropFile(e)}
                className={style.text}
              >
                ?????????????????? ?????? ????????????????????
                <br />
                ????????
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageArea;

import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const PostEditor = ({ text, setText, ...props }) => {
  const title = useRef(0);

  useEffect(() => {
    title.current.innerHTML = text || "";
  }, []);

  useEffect(() => {
    title.current.innerHTML = text || "";
  }, [props.sales?.length]);

  return (
    <div>
      <div>
        <button
          title="Жирный"
          onClick={() => {
            document.execCommand("bold", false, null);
          }}
        >
          B
        </button>
        <button
          title="Курсив"
          onClick={() => {
            document.execCommand("italic", false, null);
          }}
        >
          I
        </button>
        <button
          title="Зачеркнутый"
          onClick={() => {
            document.execCommand("underline", false, null);
          }}
        >
          ⍛
        </button>
        <span>Цвет</span>{" "}
        <input
          onChange={(e) => {
            document.execCommand("styleWithCSS", false, true);
            document.execCommand("foreColor", false, e.target.value);
            document.execCommand("styleWithCSS", false, false);
          }}
          class="toolbar-color"
          type="color"
          value="#ff0000"
        ></input>
        <button
          href="#"
          class="toolbar-undo fas fa-undo"
          title="Отмена"
          onClick={() => {
            document.execCommand("undo", false, null);
          }}
        >
          {"<-"}
        </button>
        <button
          href="#"
          class="toolbar-redo fas fa-redo"
          title="Повтор"
          onClick={() => {
            document.execCommand("redo", false, null);
          }}
        >
          {"->"}
        </button>
        <button
          href="#"
          class="toolbar-a fas fa-link"
          title="Ссылка"
          onClick={() => {
            let url = prompt("Введите URL", "");
            document.execCommand("CreateLink", false, url);
          }}
        >
          Ссылка
        </button>
        <button
          href="#"
          class="toolbar-unlink fas fa-unlink"
          title="Удаление ссылки"
          onClick={() => {
            document.execCommand("unlink", false, null);
          }}
        >
          Удалить ссылку
        </button>
        <div
          className="editor"
          contentEditable="true"
          ref={title}
          style={{
            textAlign: "left",
            minHeight: "150px",
            borderWidth: "1px solid #ddd",
            padding: "10px",
            borderRadius: "2px",
            boxShadow: "1px 1px 2px #ddd",
            backgroundColor: "#fff",
            border: "2px solid black",
          }}
          onInput={(e) => {
            // document.execCommand("styleWithCSS", true);
            // document.execCommand("fontName", false, "GothamPro");
            // e.target.innerHTML = e.target.innerHTML.replace(
            //   "font-size: 14px;",
            //   ""
            // );
            // e.target.innerHTML = e.target.innerHTML.replace(
            //   "font-size: x-large",
            //   ""
            // );
            // e.target.innerHTML = e.target.innerHTML.replace(
            //   `style=\"font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify; ;\"`,
            //   ""
            // );

            e.target.focus();
            setText(e.target.innerHTML);
          }}
        ></div>
      </div>
    </div>
  );
};

export default PostEditor;

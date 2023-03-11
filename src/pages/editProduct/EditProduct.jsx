import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import MButton from "../../components/UI/button/MButton";
import ImageArea from "../../components/UI/imageArea/ImageArea";
import MInput from "../../components/UI/input/MInput";
import PostEditor from "../../components/UI/postEditor/PostEditor";
import Mtitle from "../../components/UI/title/title";
import Select from "../../components/UI/select/Select";
import style from "./EditProduct.module.css";
import { host } from "../../http/axios";
import { useParams } from "react-router-dom";
import MCheckbox from "../../components/UI/checkbox/MCheckbox";
import Image from "../../components/UI/Image/Image";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [video, setVideo] = useState("");
  const [images, setImages] = useState([{ src: undefined, id: undefined }]);
  const [characteristics, setCharacteristics] = useState([
    {
      name: "",
      char: ["", "", ""],
    },
  ]);
  const [features, setFeatures] = useState([""]);
  const [material, setMaterial] = useState("");
  const [equipment, setEquipment] = useState([""]);
  const [additionalProduct, setAdditionalProduct] = useState([]);
  const [additionalProductList, setAdditionalProductList] = useState([]);
  const [optionsProduct, setOptionsProduct] = useState([]);
  const [price, setPrice] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [update, setUpdate] = useState(false);
  const [delList, setDelList] = useState([]);

  let categoryName = useParams();

  useEffect(() => {
    // setIsLoading(true);
    console.log(categoryName);
    host
      .get("/api/item/all/get/short")
      .then((res) => {
        console.log(res["data"]);
        setOptionsProduct(res["data"].map((item) => item["name"]));
        setAdditionalProductList(res["data"]);
      })
      .catch((err) => {
        console.log(err, "get");
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    console.log(categoryName);
    host
      .get(`/api/item/get/${categoryName.id}`)
      .then((res) => {
        console.log(res["data"]);
        setName(res["data"]["name"]);
        setImages(
          res["data"]["images"].map((id, index) => {
            return { src: id["src"], id: index };
          })
        );
        setCounter(res["data"]["images"].length);
        setVideo(res["data"]["video"]);
        setCharacteristics(
          res["data"]["params"].map((par) => ({
            name: par.name,
            char: [par.first_opt, par.second_opt, par.third_opt],
          }))
        );
        setMaterial(res["data"]["material"]);
        setFeatures(
          res["data"]["features"].map((feature) => ({
            feature: feature["header"],
            description: feature["main_text"],
            circle: feature["circle_text"],
          }))
        );
        setPrice(res["data"]["price"]);
        setVisible(res["data"]["visible"]);
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
    let parameters = [];

    characteristics.map((ch) => {
      parameters.push({
        name: ch["name"],
        first_opt: ch["char"][0],
        second_opt: ch["char"][1],
        third_opt: ch["char"][2],
      });
    });

    let feat = [];
    features.map((ch) => {
      feat.push({
        header: ch["feature"],
        main_text: ch["description"],
        circle_text: ch["circle"],
      });
    });

    let itemsSlug = [];

    additionalProduct.map((selectProd) => {
      additionalProductList.map((oneOfAllProd) => {
        if (selectProd == oneOfAllProd["name"]) {
          itemsSlug.push(oneOfAllProd["slug"]);
        }
      });
    });

    console.log([...new Set(itemsSlug)]);

    let data = {
      category: categoryName["category"],
      name: name,
      images: imageIds.map((el) => el.src),
      video: video,
      parameters: parameters,
      material: material,
      features: feat,
      extra_slugs: itemsSlug,
      price: price,
      checkSlug: categoryName.id,
      visible: visible,
    };
    console.log(data);

    host
      .post("/api/item/edit", data)
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
    <>
      {!isLoading ? (
        <div className={style.container}>
          <div className={style.name}>
            <Mtitle>Название товара</Mtitle>
            <div className={style.nameInput}>
              <MInput value={name} setvalue={setName} />
            </div>
          </div>
          <div className={style.img}>
            <div className={style.imagesContainer}>
              <Mtitle style={{ fontSize: "24px" }}>Изображения товара</Mtitle>
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
                          images.map((val, ind) =>
                            index === ind ? value : val
                          )
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
          </div>
          <div className={style.video}>
            <Mtitle>Сcылка на видео</Mtitle>
            <div className={style.videoLink}>
              <MInput value={video} setvalue={setVideo} />
            </div>
          </div>
          <div className={style.characteristics}>
            <Mtitle style={{ fontSize: "24px" }}>Характеристики</Mtitle>
            <div className={style.characteristic}>
              {characteristics.map((char, index) => (
                <>
                  <div className={style.characteristicName}>
                    <div className={style.nameChar}>
                      <MInput
                        placeholder={"Введите название характеристики"}
                        value={characteristics[index]["name"]}
                        setvalue={(value) => {
                          setCharacteristics(
                            characteristics.map((val, ind) =>
                              index === ind
                                ? { ...characteristics[index], name: value }
                                : val
                            )
                          );
                        }}
                      />
                    </div>

                    <span
                      className={style.close}
                      onClick={(el) => {
                        console.log("first");
                        setCharacteristics(
                          characteristics.filter((ch, ind) => ind != index)
                        );
                      }}
                    >
                      ╳
                    </span>
                  </div>
                  <div className={style.characteristicsArray}>
                    {characteristics[index].char.map((el, ind) => (
                      <div className={style.char}>
                        <MInput
                          placeholder={"Характеристика"}
                          value={el}
                          setvalue={(value) => {
                            setCharacteristics(
                              characteristics.map((val, ii) =>
                                index === ii
                                  ? {
                                      ...characteristics[index],
                                      char: characteristics[index].char.map(
                                        (vall, indexx) =>
                                          ind === indexx ? value : vall
                                      ),
                                    }
                                  : val
                              )
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
            <div className={style.addButton}>
              <MButton
                onClick={() => {
                  setCharacteristics([
                    ...characteristics,
                    {
                      name: "",
                      char: ["", "", ""],
                    },
                  ]);
                }}
              >
                Добавить
              </MButton>
            </div>
          </div>
          <div className={style.materialContainer}>
            <Mtitle>Материалы изготовления</Mtitle>
            <div className={style.textContainer}>
              <PostEditor text={material} setText={setMaterial} />
            </div>
          </div>
          <div className={style.featureContainer}>
            <Mtitle style={{ fontSize: "24px" }}>Особенности</Mtitle>
            <div className={style.features}>
              {features.map((char, index) => (
                <div className={style.feature}>
                  <div className={style.featureHeader}>
                    <div className={style.featureName}>
                      <MInput
                        placeholder={"Название особенности"}
                        value={features[index]["feature"]}
                        setvalue={(value) => {
                          setFeatures(
                            features.map((val, ind) =>
                              index === ind
                                ? { ...features[index], feature: value }
                                : val
                            )
                          );
                        }}
                      />
                    </div>
                    <div
                      className={style.close}
                      onClick={(el) => {
                        console.log("first");
                        setFeatures(features.filter((ch, ind) => ind != index));
                      }}
                    >
                      ╳
                    </div>
                  </div>
                  <div className={style.featureDescription}>
                    <PostEditor
                      text={features[index]["description"]}
                      setText={(value) => {
                        setFeatures(
                          features.map((val, ind) =>
                            index === ind
                              ? { ...features[index], description: value }
                              : val
                          )
                        );
                      }}
                      // sales={features}
                    />
                  </div>
                  <div className={style.textInCircle}>
                    <div className={style.textInCircle__description}>
                      Введите текст, который будет отображаться в кружке, если
                      необходимо
                    </div>
                    <div className={style.textInCircle__input}>
                      <MInput
                        value={features[index]["circle"]}
                        setvalue={(value) => {
                          setFeatures(
                            features.map((val, ind) =>
                              index === ind
                                ? { ...features[index], circle: value }
                                : val
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={style.addButton}>
              <MButton
                onClick={() => {
                  setFeatures([...features, ""]);
                }}
              >
                Добавить
              </MButton>
            </div>
          </div>
          <div className={style.equipmentContainer}>
            <Mtitle>Комплектация</Mtitle>
            <div className={style.equipment}>
              {equipment.map((equip, index) => (
                <div className={style.equipContainer}>
                  <div className={style.equip}>
                    <MInput
                      value={equipment[index]}
                      setvalue={(value) => {
                        setEquipment(
                          equipment.map((el, ind) =>
                            ind === index ? value : el
                          )
                        );
                      }}
                    />
                  </div>
                  <div
                    className={style.close}
                    onClick={(el) => {
                      setEquipment(equipment.filter((eq, ind) => ind != index));
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
                  setEquipment([...equipment, ""]);
                }}
              >
                Добавить
              </MButton>
            </div>
            <Mtitle>Дополнительные товары</Mtitle>
            <Select
              options={optionsProduct}
              value={additionalProduct}
              setValue={setAdditionalProduct}
              placeholder={"Введите название товара"}
            />
          </div>

          <div className={style.price}>
            <div className={style.titleBox}>
              <Mtitle style={{ fontSize: "24px" }}>Цена</Mtitle>
            </div>

            <MInput value={price} setvalue={setPrice} />
          </div>

          <div className={style.saveButton}>
            <div className={style.checkboxContainer}>
              <span className={style.checkboxContainer__text}>
                Отображать товар
              </span>
              <MCheckbox
                interview={visible}
                setInterview={setVisible}
              ></MCheckbox>
            </div>
            <MButton
              style={{ width: "150px" }}
              onClick={() => {
                postData();
              }}
            >
              Сохранить
            </MButton>
          </div>
        </div>
      ) : (
        <div>Загрузка</div>
      )}
    </>
  );
};

export default EditProduct;

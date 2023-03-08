import React, { useEffect, useState } from "react";
import style from "./Select.module.css";
import Arrow from "./image/Arrow.svg";
import MInput from "../input/MInput";
import MButton from "../button/MButton";

const Select = ({ value, setValue, options, placeholder }) => {
  const [filter, setFilter] = useState("");
  const [additionProduct, setAdditionProduct] = useState("");

  useEffect(() => {
    setFilter(additionProduct);
  }, [additionProduct]);

  return (
    <div className={style.selectContainer}>
      <div className={style.select}>
        <div className={style.inputContainer}>
          <MInput
            value={additionProduct}
            setvalue={setAdditionProduct}
            placeholder={placeholder}
          />
          <div className={style.optionsContainer}>
            {options
              .filter((el) => {
                if (filter != undefined) {
                  return el.indexOf(filter) != -1;
                } else {
                  return el;
                }
              })
              .map((el) => (
                <div
                  className={style.option}
                  onClick={() => {
                    setAdditionProduct(el);
                    setValue([...value, el]);
                  }}
                >
                  {el}
                </div>
              ))}
          </div>
        </div>

        <div className={style.addedList}>
          {value.map((val, index) => (
            <div className={style.selectOptionContainer}>
              <div className={style.selectOption}>{val}</div>
              <div
                className={style.deleteButton}
                onClick={() => {
                  setValue(value.filter((e, ind) => ind != index));
                }}
              >
                ╳
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Select;

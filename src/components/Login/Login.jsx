import React, { useState } from "react";
import Input from "../UI/input/MInput";
import Checkbox from "../UI/checkbox/MCheckbox";
import Button from "../UI/button/MButton";
import style from "./Login.module.css";
import background from "./background.svg";
import logo from "./logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({ login: false, password: false });

  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();

  const fromPage = location.state?.from?.pathname || "/";

  function postData(e) {
    e.preventDefault();
    let err = { login: false, password: false };
    if (login.length == 0) {
      err.login = true;
      //setErrors({ ...errors, login: true });
    } else {
      err.login = false;
      //setErrors({ ...errors, login: false });
    }
    if (password.length == 0) {
      err.password = true;
      //setErrors({ ...errors, password: true });
    } else {
      err.password = false;
      //setErrors({ ...errors, password: false });
    }
    setErrors(err);
    if (login.length != 0 && password.length != 0) {
      setError(false);

      signin(login, password, () => navigate(fromPage, { replace: true }));
      setError(true);
    } else {
      setError(true);
    }
  }

  return (
    <div className={style.container}>
      <div className={style.leftSide}>
        <div className={style.logo}>
          <img src={logo} alt="" className={style.img} />
        </div>
        <div className={style.authContainer}>
          <form>
            <div className={style.authContainer__title}>Авторизуйтесь</div>
            <div className={style.inputContainer}>
              <div className={style.inputContainer__title}>Логин</div>
              <div className={style.inputContainer__input}>
                <Input
                  placeholder="Введите имя аккаунта"
                  setvalue={setLogin}
                  value={login}
                  style={errors.login}
                />
              </div>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputContainer__title}>Пароль</div>
              <div className={style.inputContainer__input}>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  setvalue={setPassword}
                  value={password}
                  style={errors.password}
                />
              </div>
            </div>

            <div className={error ? style.errorText : style.errorTextDisable}>
              Проверьте введенные данные!
            </div>
            <div className={style.buttonContainer}>
              <Button style={{ height: "50px" }} onClick={(e) => postData(e)}>
                Войти
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className={style.rightSide}></div>
    </div>
  );
};

export default Login;

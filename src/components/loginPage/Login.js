import React, { useState, useCallback, useEffect } from "react";
import config from "../../config.json";
import axios from "axios";
import "./CSS/plans.css";
import { Toast, Frame } from "@shopify/polaris";
import { AuthContext } from "../../ContextApi/AuthContext";
import companyLogo from "./CSS/rocket.webp"
import { useContext } from "react";

function Login() {
    const {login}  = useContext(AuthContext)
    const [username, setUserNameValue] = useState("");
    const [password, setPasswordValue] = useState("");
    const [systemInfo, setSystemInfo] = useState({})

    const [activeToggle, setActiveToggle] = useState(false); //Error Toast Polaris
    const [toggleMessage, setToggleMessage] = useState("");
    const toggleActive_ = useCallback(() => setActiveToggle((activeToggle) => !activeToggle), []);
    const toastValidationError = activeToggle ? <Toast content={toggleMessage} error onDismiss={toggleActive_} duration={4500} /> : null;

    const onChangeName = async (newValue) => {
        setUserNameValue(newValue);
    };
    const onChangePassword = async (newValue) => {
        setPasswordValue(newValue.target.value);
    };
    const ValidateUser = () => {
        if (username == "" || username == null) {
            setActiveToggle(true);
            setToggleMessage("User name is required");
            return false
        }
        if (password == "" || password == null) {
            alert(21)
            setActiveToggle(true);
            setToggleMessage("password is required");
            return false
        }

        if (username != "" && username != null && password != "" && password != null) {
            axios.post(config.APIURL + "/admin/AuthenticateUser", { username: username, password: password, systemInfo: systemInfo })
                .then((response) => {
                    if (response.data.status == "error") {
                        setActiveToggle(true);
                        setToggleMessage(response.data.message);
                    } else if (response.data.status == "success") {
                        login(response.data)
                    }
                    else {
                        setActiveToggle(true);
                        setToggleMessage("something went wrong");
                    }
                })
                .catch((error) => {
                    setActiveToggle(true);
                    setToggleMessage(error.message);
                });
        }
    };


    var handleKeyPress = (event) => {
        if (event.key === "Enter") {
            ValidateUser();
        }
    };

    const getSystemInfo = async () => {
        const response = await axios.get('https://geolocation-db.com/json/e5e47150-bc2c-11ed-9b49-492949f4ff3d')
        setSystemInfo(response.data ?? {})
    }

    useEffect(() => {
        getSystemInfo()
    }, [])
  return (
    <Frame>
    <div>
        <div className="login__div">
            <div className="bg__layer">
                <h1 className="display-4">{config.APP_NAME}</h1>
                <div className="card">
                    <div className="card-body">
                        <div className="app__logo">
                            <img src={companyLogo} height="80px" alt="Logo" />
                        </div>

                        <div className="login__input">
                            <span className="fa fa-user"></span>
                            <input type="text" className="username__input" value={username} placeholder="Username" onChange={(event) => onChangeName(event.target.value)} autoComplete={''} />
                        </div>
                        <div className="login__input">
                            <span className="fa fa-lock"></span>
                            <input
                                className="password__input"
                                label="Password"
                                value={password}
                                onChange={(event) => onChangePassword(event)}
                                type="password"
                                placeholder="Password"
                                onKeyPress={(event) => handleKeyPress(event)}
                            />
                        </div>
                        <button type="submit" className="login__btn" onClick={() => ValidateUser()}>
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {toastValidationError}
    </div>
</Frame>
  )
}

export default Login
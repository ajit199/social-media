
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { CircularProgress } from "@mui/material";
import "./login.css";
import { AuthContext } from "../context/AuthContext";
export function Login() {
    let email = useRef();
    let password = useRef();
    let { user, isFetching, error, dispatch } = useContext(AuthContext);
    function handleSubmit(event) {
        event.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch)
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social App</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Social App.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleSubmit}>
                        <input placeholder="Email" required type={"email"} className="loginInput" ref={email} />
                        <input placeholder="Password" required minLength={6} type={"password"} className="loginInput" ref={password} />
                        <button className="loginButton" disabled={isFetching}>{isFetching ? <CircularProgress color="inherit" size={"25px"} /> : "Log In"}</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRegisterButton">
                            {isFetching ? <CircularProgress color="inherit" size={"25px"} /> : "Create a New Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
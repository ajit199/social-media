import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./register.css";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
export function Register() {
    let navigate = useNavigate();
    let username = useRef();
    let email = useRef();
    let password = useRef();
    let confirmPassword = useRef();
    // let { user, isFetching, error, navigate } = useContext(AuthContext);
    async function handleSubmit(event) {
        event.preventDefault();
        if (confirmPassword.current.value !== password.current.value) {
            confirmPassword.current.setCustomValidity("Confirm password should be same as password!")
            return;
        }
        let user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
        }

        try {
            await axios.post("/auth/register", user);
            navigate("/login", { replace: true })
        } catch (error) {
            console.log(error)
        }
        // console.log("Hello World")
        // loginCall({ email: email.current.value, password: password.current.value }, dispatch)
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
                        <input placeholder="Username" type={"text"} required className="loginInput" ref={username} />
                        <input placeholder="Email" required type={"email"} className="loginInput" ref={email} />
                        <input placeholder="Password" minLength={6} required type={"password"} className="loginInput" ref={password} />
                        <input placeholder="Confirm Password" required type={"password"} className="loginInput" ref={confirmPassword} />
                        <button className="loginButton">Sign Up</button>
                        {/* <Link to="/login"> */}
                        <button className="loginRegisterButton">
                            Log into Account
                        </button>
                        {/* </Link> */}
                    </form>
                </div>
            </div>
        </div>
    )
}
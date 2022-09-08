import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { Login } from "../components/login/Login";
import { Register } from "../components/register/Register";
import { Home } from "../pages/home/Home";
import { Messanger } from "../pages/messanger/Messanger";
import { Profile } from "../pages/profile/Profile";

export function MainRoutes() {
    let { user } = useContext(AuthContext);
    return (
        <>
            <Routes>
                <Route index path="/" element={user ? <Home /> : <Register />} />
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to={"/"} replace /> : <Register />} />
                <Route path="/messanger" element={<Messanger />} />
                {/* !user ? <Navigate to={"/"} replace /> : */}
                <Route path="profile/:username" element={<Profile />} />
            </Routes>
        </>
    )
}
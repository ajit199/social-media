import { Feed } from "../../components/feed/Feed";
import { Leftbar } from "../../components/leftbar/Leftbar";
import { Rightbar } from "../../components/rightbar/Rightbar";
import { Topbar } from "../../components/topbar/Topbar";
import axios from "axios";
import { useState, useEffect } from "react";
import "./profile.css";
import { useParams } from "react-router-dom";
export function Profile() {
    let publicUrl = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    let { username } = useParams();
    // console.log(username);
    useEffect(() => {
        axios(`/users?username=${username}`)
            .then(res => setUser(res.data))
            .catch(error => console.log(error));
    }, [username])
    return (
        <>
            <Topbar />
            <div className="profile">
                <Leftbar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={user.coverPicture || publicUrl + "person/no-cover.png"} alt="userCoverImg" className="profileCoverImg" />
                            <img src={user.profilePicture || publicUrl + "person/no-avatar.png"} alt="userProfileImg" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName" style={{ textTransform: "capitalize" }}>{user.username}</h4>
                            <span className="profileInfoDesc">Hello World</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </>
    )
}
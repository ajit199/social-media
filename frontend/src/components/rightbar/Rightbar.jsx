
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./rightbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import { FOLLOW, UNFOLLOW } from "../context/ActionTypes";
export function Rightbar({ user }) {
    let publicUrl = process.env.REACT_APP_PUBLIC_FOLDER;
    let [friends, setFriends] = useState([]);
    let { user: currentUser, dispatch } = useContext(AuthContext);
    let [isFollow, setIsFollow] = useState(currentUser.followings.includes(user?._id));

    // useEffect(() => {
    //     setIsFollow(currentUser.followings.includes(user?._id));
    // }, [currentUser, user._id])
    useEffect(() => {
        if (user) {
            axios("/users/friends/" + currentUser._id)
                .then(response => {
                    setFriends(response.data)
                })
                .catch(error => console.log(error));
        }
    }, [user])
    function HomeRightBar() {
        return (
            <>
                <div className="birthdayContainer">
                    <img crossOrigin="anonymous" src={publicUrl + "gift.png"} alt="giftImg" className="birthdayImg" />
                    <span className="birthdayText"><b>Shobhit</b> and <b>2 other friends</b> have a birthday today</span>
                </div>
                <img src={publicUrl + "ad.png"} alt="addImage" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {/* {friends.map(friend => {
                        return ( */}
                    <li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img src={publicUrl + "person/2.jpeg"} alt="onlinefriends" className="rightbarProfileImg" />
                            <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">Rahul</span>
                    </li>

                </ul>
            </>
        )
    }

    async function handleFollow() {
        try {
            if (isFollow) {
                await axios.put(`/users/${user._id}/unfollow`, { userId: currentUser._id });
                dispatch({ type: UNFOLLOW, payload: user._id });
            } else {
                await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id });
                dispatch({ type: FOLLOW, payload: user._id });

            }
        } catch (error) {
            console.log(error);
        }
        setIsFollow(!isFollow);
    }

    function ProfileRightBar() {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleFollow}>
                        {isFollow ? "Unfollow" : "Follow"}
                        {isFollow ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightbarUserTitle">User information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city || "Delhi"}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from || "Lucknow"}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship || "Single"}</span>
                    </div>
                </div>
                <h4 className="rightbarUserTitle">User Friends</h4>
                <div className="rightbarFollowings">
                    {friends.map(friend => {
                        return (
                            <Link to={"/profile/" + friend.username} key={friend._id} style={{ textDecoration: "none", color: "gray" }}>
                                <div className="rightbarFollowing">
                                    <img src={friend.profilePicture ? publicUrl + friend.profilePicture : publicUrl + "person/no-avatar.png"} alt="userfriends" className="rightbarFollowingImg" />
                                    <span className="rightbarFollowingName">{friend.username}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightBar /> : <HomeRightBar />}
            </div>
        </div>
    )
}
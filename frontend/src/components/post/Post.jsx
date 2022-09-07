
import "./post.css";
import { MoreVert } from "@mui/icons-material"
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export function Post({ post }) {
    // const []
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({});
    let { user: currentUser } = useContext(AuthContext);
    function likeHandler() {
        try {
            axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
        } catch (error) {
        }
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    }
    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes])
    useEffect(() => {
        axios(`/users?userId=${post.userId}`)
            .then(res => setUser(res.data))
            .catch(error => console.log(error));
    }, [post.userId])
    let publicUrl = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`profile/${user.username}`}>
                            <img className="postProfileImg" src={user.profilePicture || publicUrl + "person/no-avatar.png"} alt="profilePic" />
                        </Link>
                        <span className="postUsername" style={{ textTransform: "capitalize" }}>{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post.desc}</span>
                    {/* publicUrl + "posts/1.jpeg" */}
                    <img crossOrigin="anonymous" src={post.img ? publicUrl + post.img : publicUrl + "person/no-banner.png"} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img crossOrigin="anonymous" src={publicUrl + "like.png"} alt="likebtn" onClick={likeHandler} className="likeIcon" />
                        <img crossOrigin="anonymous" src={publicUrl + "heart.png"} alt="heartbtn" onClick={likeHandler} className="likeIcon" />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <div className="postCommentText">
                            9 comments
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
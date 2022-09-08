import "./post.css";
import { MoreVert } from "@mui/icons-material";
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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
    const [showComments, setShowComments] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    let { user: currentUser } = useContext(AuthContext);
    function likeHandler() {
        try {
            axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
        } catch (error) {
        }
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    }

    function getComments(postId) {
        setShowComments(post._id);
        axios.get("/posts/comments/" + postId)
            .then(res => {
                setComments(res.data)
            })
    }

    function handleComment(event, postId) {
        if (event.key === "Enter") {
            let commentData = {
                userId: currentUser._id,
                postId,
                text: comment,
            }
            setComment("");
            axios.post("/posts/comment", commentData)
                .then((res) => {
                    setComments((prevState) => [...prevState, res.data]);
                }).catch(error => console.log(error));
        }
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
                            <img className="postProfileImg" src={user.profilePicture ? publicUrl + user.profilePicture : publicUrl + "person/no-avatar.png"} alt="profilePic" />
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
                        <div className="postCommentText" onClick={() => {
                            getComments(post._id);
                        }}>
                            Comment
                        </div>
                    </div>
                </div>
                <div className="postCommentsSection" style={{ display: showComments === post._id ? "block" : "none" }}>
                    <div className="postCommentInput">
                        <Link to={`profile/${currentUser.username}`}>
                            <img className="postProfileImg" src={currentUser.profilePicture ? publicUrl + currentUser.profilePicture : publicUrl + "person/no-avatar.png"} alt="profilePic" />
                        </Link>
                        <input type="text" className="commentInput" value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => {
                            handleComment(e, post._id)
                        }} placeholder="Write a comment..." />
                    </div>
                    <p className="enterMsg">Press Enter to post.</p>
                    <div className="postComments">
                        {
                            comments && comments.map(({ comment, user }) => {
                                return (
                                    <div className="postComment" key={comment._id}>
                                        <Link to={`profile/${user.username}`}>
                                            <img className="postProfileImg" src={user.profilePicture ? publicUrl + user.profilePicture : publicUrl + "person/no-avatar.png"} alt="profilePic" />
                                        </Link>
                                        <div className="postCommentDetails">
                                            <div>
                                                <span className="postCommentUser">{user.username}</span>
                                            </div>
                                            <span className="postCommentMessage">{comment.text}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
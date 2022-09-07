
import { useState, useEffect, useContext } from "react";
import { Post } from "../post/Post";
import { Share } from "../share/Share";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./feed.css";
export function Feed({ username }) {
    let [posts, setPosts] = useState([]);
    let { user } = useContext(AuthContext)
    // console.log(username)
    useEffect(() => {
        username ? axios("/posts/profile/" + username)
            .then(res => {
                setPosts(res.data)
            })
            .catch(error => console.log(error))
            : axios(`/posts/timeline/${user._id}`)
                .then(res => {
                    let posts = res.data.posts.sort((p1, p2) => {
                        return new Date(p2.createdAt) - new Date(p1.createdAt);
                    })
                    setPosts(posts);
                })
                .catch(error => console.log(error));
    }, [username, user._id])
    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share />}
                {posts ? posts.map((post) => {
                    return (
                        <Post key={post._id} post={post} />
                    )
                }) : ""}

            </div>
        </div>
    )
} 
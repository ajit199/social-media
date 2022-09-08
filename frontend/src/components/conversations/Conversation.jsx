import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export function Conversation({ conversation, currentUser }) {
    let [friend, setFriend] = useState({});
    let publicUrl = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(() => {
        let friendId = conversation?.members.find(id => id !== currentUser._id);
        axios("users?userId=" + friendId)
            .then(res => setFriend(res.data))
            .catch(error => console.log(error));
    }, [currentUser, conversation])
    return (
        <div className="conversation">
            <img src={friend?.profilePicture ? publicUrl + friend?.profilePicture : publicUrl + "person/no-avatar.png"} alt="" className="conversationImg" />
            <span className="conversationName" style={{ textTransform: "capitalize" }}>{friend?.username}</span>
        </div>
    )
}
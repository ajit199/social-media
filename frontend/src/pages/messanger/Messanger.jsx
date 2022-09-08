
import { useState, useEffect, useContext, useRef } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { Conversation } from "../../components/conversations/Conversation";
import Topbar from "../../components/topbar/Topbar";
import { Message } from "../../components/message/Message";
import { AuthContext } from "../../components/context/AuthContext";
import "./messanger.css";
import axios from "axios";
import { io } from "socket.io-client";
export function Messanger() {
    let [conversations, setConversations] = useState([])
    let [currentChat, setCurrentChat] = useState(null)
    let [messages, setMessages] = useState([]);
    let [newMessage, setNewMessage] = useState("");
    let [arrivalMessage, setArrivalMessage] = useState(null);
    let [onlineUsers, setOnlineUsers] = useState([]);
    let scrollRef = useRef();
    let { user } = useContext(AuthContext);
    let socket = useRef();
    useEffect(() => {
        socket.current = io("https://social-media-app-backend-web16.herokuapp.com");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)))
        })
    }, [user])
    useEffect(() => {
        axios("/conversations/" + user?._id)
            .then(res => setConversations(res.data))
            .catch(error => console.log(error));
    }, [user])

    useEffect(() => {
        axios("/messages/" + currentChat?._id)
            .then(res => setMessages(res.data));
        axios.post("/conversations", {})
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

    function handleSubmit() {
        // console.log("Hello World");
        let receiverId = currentChat.members.find(member => member !== user._id);
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        })
        let message = {
            sender: user?._id,
            text: newMessage,
            conversationId: currentChat?._id
        }

        axios.post("/messages", message)
            .then(res => {
                setMessages([...messages, res.data]);
                setNewMessage("");
            }).catch(error => console.log(error));
    }

    return (
        <>
            <Topbar />
            <div className="messanger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder="Search for friends" className="chatMenuInput" />
                        <h4 style={{ margin: "9px 0 9px 10px" }}>Conversations</h4>
                        {conversations && conversations.map(conversation => {
                            return (
                                <div onClick={() => {
                                    setCurrentChat(conversation);

                                }} key={conversation._id}>
                                    <Conversation conversation={conversation} currentUser={user} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ?
                            (<>
                                <div className="chatBoxTop">
                                    {messages && messages.map((message) => (
                                        <div key={message._id} ref={scrollRef}>
                                            <Message message={message} own={message?.sender === user?._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea placeholder="write something..." className="chatMessageInput" onKeyDown={(event) => { if (event.key === "Enter") handleSubmit() }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                                </div>
                            </>
                            ) : (<span className="noConversationText">Open a conversation to start a chat.</span>)}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <h4 className="rightbarTitle">Online Friends</h4>
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
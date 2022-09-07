
import { useContext } from "react";
import { useState, useEffect } from "react";
import { ChatOnline } from "../../components/chatOnline/ChatOnline";
import { Conversation } from "../../components/conversations/Conversation";
import { Message } from "../../components/message/Message";
import { AuthContext } from "../../components/context/AuthContext";
import "./messanger.css";
import axios from "axios";
export function Messanger() {
    let [conversations, setConversations] = useState([])
    let [currentChat, setCurrentChat] = useState(null)
    let [messages, setMessages] = useState([])
    let { user } = useContext(AuthContext);
    useEffect(() => {
        axios("/conversations/" + user._id)
            .then(res => setConversations(res.data))
            .catch(error => console.log(error));
    }, [user])

    useEffect(() => {
        axios("/messages/" + currentChat?._id)
            .then(res => setMessages(res.data))
    }, [currentChat])
    return (
        <div className="messanger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input type="text" placeholder="Search for friends" className="chatMenuInput" />
                    {conversations && conversations.map(conversation => {
                        return (
                            <div onClick={() => setCurrentChat(conversation)} key={conversation._id}>
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
                                    <Message key={message?._id} message={message} own={message?.sender === user?._id} />
                                ))}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea placeholder="write something..." className="chatMessageInput"></textarea>
                                <button className="chatSubmitButton">Send</button>
                            </div>
                        </>
                        ) : (<span className="noConversationText">Open a conversation to start a chat.</span>)}
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <ChatOnline />
                    <ChatOnline />
                    <ChatOnline />
                </div>
            </div>
        </div>
    )
}
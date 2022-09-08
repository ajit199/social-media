import './message.css';
import { format } from "timeago.js";
export function Message({ message, own }) {

    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img src='https://images.pexels.com/photos/445109/pexels-photo-445109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='friendImg' className="messageImg" />
                <p className="messageText">{message?.text}</p>
            </div>
            <div className="messageBottom">{format(message?.createdAt)}</div>
        </div>
    )
}
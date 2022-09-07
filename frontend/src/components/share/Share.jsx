import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions, Login, Cancel } from "@mui/icons-material";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
export function Share() {
    let publicUrl = process.env.REACT_APP_PUBLIC_FOLDER;
    let [file, setFile] = useState(null);
    let { user } = useContext(AuthContext);
    let desc = useRef();
    async function handleSubmit(event) {
        event.preventDefault();
        let post = {
            userId: user._id,
            desc: desc.current.value,
        }
        if (file) {
            let fileName = new Date();
            fileName = fileName.getSeconds() + file.name;
            let formData = new FormData();
            formData.append("file", file);
            formData.append("name", fileName);
            post.img = fileName;
            try {
                await axios.post("http://localhost:8000/api/upload", formData);
            } catch (error) {
                console.log(error)
            }
        }
        try {
            await axios.post("/posts", post);
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? user.profilePicture : publicUrl + "person/np-avatar.png"} alt="profilePic" className="shareProfileImg" />
                    <input placeholder={"what's is in your mind " + user.username + "?"} ref={desc} className="shareInput" />
                </div>
                <hr className="shareHr" />

                {file && (<div className="shareImgContainer">
                    <img src={URL.createObjectURL(file)} alt="feedImg" className="shareImg" />
                    <Cancel className="shareCancelImg" onClick={() => {
                        setFile(null)
                        window.location.reload();
                    }} />
                </div>)}

                <form className="shareBottom" onSubmit={handleSubmit}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText" >Photo or Video</span>
                            <input type="file" id="file" style={{ display: "none" }} accept=".jpeg,.png,.jpg" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText" >Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText" >Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                            <span className="shareOptionText" >Feeling</span>
                        </div>
                    </div>
                    <button className="shareButton">Share</button>
                </form>
            </div>
        </div>
    )
}
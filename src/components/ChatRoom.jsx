import '../styles/ChatRoom.css'
import '../styles/Global.css'
import {use, useEffect, useState} from "react";
import {fetchMessagesMessage, sendMessageMessage} from "./formatMessages.jsx";
import { useLocation } from "react-router-dom";
import socket from "./socket.js";

function ChatRoom() {
    const[messages, setMessages] = useState([]);
    const[message, setMessage] = useState("");
    const[resendMessages, setResendMessages] = useState(false);
    const { state } = useLocation();
    const room = state?.room;
    const username = state?.username;

    const sendMessage = ()=> {
        socket.send(sendMessageMessage(username,room,message,Date.now().toString()));
    }
    useEffect(() => {
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "success" && data.message === "send") {
                setMessage("");
                setResendMessages(prev => !prev);
            } else if (data.type === "error") {
                alert(data.message);
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => socket.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        const getMessages = () => {
            socket.send(fetchMessagesMessage(room))
        }
        getMessages();
        const serverMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "info"){
                setMessages(data.message);
            }
        }
        socket.addEventListener("message", serverMessage)
        return () => socket.removeEventListener("message",serverMessage)
    }, [resendMessages]);
    return (
        <div>
            <h1>{room}</h1>
            <h2>Your username: {username}</h2>
            <div className="messages">
                {messages.map((message) => (
                    message &&
                    message.Username === "system"? <div className="systemMessage">({message.Value})</div> :
                        <div className="message">
                            <h5 className="username">{message.Username}</h5>
                            <h4 className="message-content">{message.Value}</h4>
                            <h6 className="date">{new Date(message.TimeStamp).toLocaleString()}</h6>
                        </div>
                ))}
            </div>
            <div className="elementAndInputDiv">
                <input placeholder="Send a message.." value={message} onChange={e => setMessage(e.target.value)}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default ChatRoom
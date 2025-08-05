import {useEffect, useState} from "react";
import {fetchMessagesMessage} from "./formatMessages.jsx";
import { useLocation } from "react-router-dom";
import socket from "./socket.js";

function ChatRoom() {
    const[messages, setMessages] = useState([]);
    const[message, setMessage] = useState("");
    const { state } = useLocation();
    const room = state?.room;
    const username = state?.username;

    const sendMessage = ()=> {
        alert(message + ", " + username)
    }

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
    }, []);
    return (
        <div>
            <h1>{room}</h1>
            {messages.map((message) => (
                message.Username === "system"? <div className="systemMessage">({message.Value})</div> :
                    <div className="message">{message.Username}: {message.Value}</div>
            ))}
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <input placeholder="Send a message.." onChange={e => setMessage(e.target.value)}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default ChatRoom
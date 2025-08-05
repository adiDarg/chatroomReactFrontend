import {useEffect, useState} from "react";
import {fetchMessagesMessage} from "./formatMessages.jsx";
import { useLocation } from "react-router-dom";
import socket from "./socket.js";

function ChatRoom() {
    const[messages, setMessages] = useState([]);
    const { state } = useLocation();
    const room = state?.room;

    useEffect(() => {
        const getMessages = () => {
            socket.send(fetchMessagesMessage(room))
        }
        getMessages();
        const serverMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "info"){
                setMessages(JSON.parse(data.message));
            }
        }
        socket.addEventListener("message", serverMessage)
        return () => socket.removeEventListener("message",serverMessage)
    }, [room]);
    return (
        <div>
            <h1>{room}</h1>
            {messages.map((message, index) => (
                <div key={index} >{message}</div>
            ))}
        </div>
    )
}

export default ChatRoom
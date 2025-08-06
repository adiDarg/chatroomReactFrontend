import {useEffect, useState} from "react";
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

        const eventFunc = (e) => {
            const data = JSON.parse(e.data)
            if (data.type === "success"){
                setMessage("");
                setResendMessages(prev => !prev);
            }
            if (data.type === "error") {
                alert(data.message);
            }
        }
        socket.addEventListener("message", eventFunc)
        return () => socket.removeEventListener("message", eventFunc)
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
    }, [resendMessages]);
    return (
        <div>
            <h1>{room}</h1>
            {messages.map((message) => (
                message.Username === "system"? <div className="systemMessage">({message.Value})</div> :
                    <div className="message">
                        <h5>{message.Username}</h5>
                        <h4>{message.Value}</h4>
                        <h6>{new Date(message.Timestamp).toLocaleDateString()}</h6>
                    </div>
            ))}
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <input placeholder="Send a message.." value={message} onChange={e => setMessage(e.target.value)}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default ChatRoom
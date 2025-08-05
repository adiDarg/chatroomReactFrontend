import {useEffect, useState} from "react";
import socket from "./socket.js";
import {createRoomMessage} from "./formatMessages.jsx";

function CreateRoom(props) {
    const[room,setRoom] = useState("");
    useEffect(() => {
        const eventFunc = (e) => {
            try {
                const data = JSON.parse(e.data)
                if (data.type === "success" && data.message === "create") {
                    props.update(prev => !prev);
                    setRoom("")
                }
                if (data.type === "error"){
                    console.error("Internal sever error: " + data.message)
                }
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
            }
        }
        socket?.addEventListener("message", eventFunc);

        return () => socket?.removeEventListener("message", eventFunc);
    },[props]);
    const createRoom = () => {
        socket.send(createRoomMessage(room));
    }
    return (
        <div>
            <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter chat room name"/>
            <button onClick={createRoom}>Create</button>
        </div>
    )
}

export default CreateRoom
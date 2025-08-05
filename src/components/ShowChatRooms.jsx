import socket from "./socket.js";
import {joinRoomMessage} from "./formatMessages.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function ShowChatRooms(props) {
    const [room,setRoom] = useState("");
    const navigate = useNavigate();

    const joinRoom = (newRoom) => {
        setRoom(newRoom);
    }
    useEffect(() => {
        socket.send(joinRoomMessage(props.username,room));
    }, [room]);
    useEffect(() => {
        const eventFunc = (e) => {
            try {
                const data = JSON.parse(e.data)
                if (data.type === "success" && data.message === "join") {
                    alert(room)
                    navigate("/chatRoom", { state: { room } });
                }
                if (data.type === "error"){
                    console.error("Internal server error: " + data.message)
                }
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
            }
        }
        socket?.addEventListener("message", eventFunc);

        return () => socket?.removeEventListener("message", eventFunc);
    },[navigate, room]);
    return (
        <div>
            {props.rooms.map((room) => (
                (room && <div key={room}>
                    <h4>{room}</h4>
                    <button onClick={() => joinRoom(room)}>Join</button>
                </div>)
            ))}
        </div>
    )
}

export default ShowChatRooms
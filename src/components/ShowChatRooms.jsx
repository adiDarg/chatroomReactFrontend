import "../styles/Rooms.css"
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
        if (room.trim() !== "" && props.username.trim() !== ""){
            socket.send(joinRoomMessage(props.username,room));

            const eventFunc = (e) => {
                try {
                    const data = JSON.parse(e.data)
                    if (data.type === "success" && data.message === "join") {
                        navigate("/chatRoom", {state: {room: room, username: props.username}});
                    }
                    if (data.type === "error") {
                        console.error("Internal server error: " + data.message)
                    }
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err);
                }
            }
            socket?.addEventListener("message", eventFunc);

            return () => socket?.removeEventListener("message", eventFunc);
        }
        if (props.username.trim() === "" && room.trim() !== ""){
            alert("You must have a username to enter a chatroom");
        }
    }, [room]);
    return (
        <div className="rooms">
            {props.rooms.map((room) => (
                (room && <div key={room} className="elementAndInputDiv">
                    <h4 style={{marginRight: "1em",marginLeft: "0"}}>{room}:</h4>
                    <button onClick={() => joinRoom(room)}>Join</button>
                </div>)
            ))}
        </div>
    )
}

export default ShowChatRooms
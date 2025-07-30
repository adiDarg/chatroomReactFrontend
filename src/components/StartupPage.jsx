import {createRoomMessage, getRoomsMessage} from "./formatMessages.jsx";
import {useEffect, useState} from "react";
import socket from "./socket.js";
function StartupPage() {
    const[username, setUsername] = useState("");
    const[rooms,setRooms] = useState([]);
    const[update, setUpdate] = useState(true);
    useEffect(() => {
        const getRooms = () => {
            socket.send(getRoomsMessage());
        }
        const serverMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "info"){
                setRooms(JSON.parse(data.message));
            }
        }
        getRooms();
        socket.addEventListener("message", serverMessage);
        return () => socket.removeEventListener("message", serverMessage);
    },[update])
    return (
        <div>
            <h1>Welcome {username}!</h1>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <h2 style={{marginRight: "1em"}}>Enter username:</h2>
                <input onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
            </div>
            <h3>Available chat rooms:</h3>
            <ShowChatRooms rooms={rooms}/>
            <h3>Create chat room:</h3>
            <CreateRoom rooms={rooms} update={setUpdate}/>
        </div>
    )
}

function ShowChatRooms(props) {
    return (
        <div>
            {props.rooms.map((room) => (
                (room && <div key={room}>
                     <h4>{room}</h4>
                    <button>Join</button>
                </div>)
            ))}
        </div>
    )
}
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
export default StartupPage
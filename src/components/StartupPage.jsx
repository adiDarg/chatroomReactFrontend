import {getRoomsMessage} from "./formatMessages.jsx";
import {useEffect, useState} from "react";
import socket from "./socket.js";
import ShowChatRooms from "./ShowChatRooms.jsx";
import CreateRoom from "./CreateRoom.jsx";
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
                setRooms(data.message);
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
            <ShowChatRooms rooms={rooms} username={username}/>
            <h3>Create chat room:</h3>
            <CreateRoom rooms={rooms} update={setUpdate}/>
        </div>
    )
}

export default StartupPage
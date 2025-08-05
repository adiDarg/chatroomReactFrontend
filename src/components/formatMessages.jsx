function getJSON(type,username,room,value,timeStamp){
    const message = {
        Type: type,
        Username: username,
        Room: room,
        Value: value,
        Timestamp: timeStamp
    }
    return JSON.stringify(message)
}

function getRoomsMessage(){
    return getJSON("getRooms","","","","")
}
function joinRoomMessage(username,room){
    return getJSON("join",username,room,"",Date.now().toString())
}
function createRoomMessage(room){
    return getJSON("create","",room,"","")
}
function fetchMessagesMessage(room){
    return getJSON("fetch","",room,"","")
}

export {getRoomsMessage,joinRoomMessage,createRoomMessage,fetchMessagesMessage};
function getJSON(type,username,room,value){
    const message = {
        Type: type,
        Username: username,
        Room: room,
        Value: value,
        Timestamp: new Date(Date.now()).toISOString(),
    }
    return JSON.stringify(message)
}
function sendMessageMessage(username,room,value){
    return getJSON("send",username,room,value);
}

function getRoomsMessage(){
    return getJSON("getRooms","","","")
}
function joinRoomMessage(username,room){
    return getJSON("join",username,room,"")
}
function createRoomMessage(room){
    return getJSON("create","",room,"")
}
function fetchMessagesMessage(room){
    return getJSON("fetch","",room,"")
}

export {getRoomsMessage,joinRoomMessage,createRoomMessage,fetchMessagesMessage,sendMessageMessage};
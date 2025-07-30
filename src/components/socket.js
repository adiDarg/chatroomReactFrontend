
const port = 8080

const socket = new WebSocket("ws://localhost:" + port + "/ws");

export default socket;
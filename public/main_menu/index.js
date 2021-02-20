const inputCodeField =  document.querySelector("#inputCodeField");
const joinRoomButton = document.querySelector("#joinRoomButton");
const createRoomButton = document.querySelector("#createRoomButton");

let Communication = new ServerCommunication(null);

createRoomButton.addEventListener("click", () => {
    inputCodeField.value = Communication.createServer();
})

joinRoomButton.addEventListener("click", () => {
    window.location.pathname = "/room/" + inputCodeField.value;
})
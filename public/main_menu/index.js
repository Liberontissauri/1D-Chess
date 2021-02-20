const inputCodeField =  document.querySelector("#inputCodeField");
const joinRoomButton = document.querySelector("#joinRoomButton");
const createRoomButton = document.querySelector("#createRoomButton");
const switchTeamButton = document.querySelector("#whiteTeamSwitchButton");

let current_team = "white";

let Communication = new ServerCommunication(null);

createRoomButton.addEventListener("click", () => {
    inputCodeField.value = Communication.createServer();
})

joinRoomButton.addEventListener("click", () => {
    window.location.pathname = `/room/${current_team}/${inputCodeField.value}`;
})

switchTeamButton.addEventListener("click", () => {
    if(current_team == "white") {
        current_team = "black";
        switchTeamButton.id = "blackTeamSwitchButton";
        switchTeamButton.textContent = "Black Team";
    } else {
        current_team = "white";
        switchTeamButton.id = "whiteTeamSwitchButton";
        switchTeamButton.textContent = "White Team";
    }
})
const inputCodeField =  document.querySelector("#inputCodeField");
const joinRoomButton = document.querySelector("#joinRoomButton");
const createRoomButton = document.querySelector("#createRoomButton");
const switchTeamButton = document.querySelector("#whiteTeamSwitchButton");

let current_team = "white";

createRoomButton.addEventListener("click", () => {
    let xhttp = new XMLHttpRequest();
    let serverID = generateID(6);
    let url = "/create/room/" + serverID;
    console.log(url)
    xhttp.open("POST", url);
    xhttp.send();
    inputCodeField.value = serverID;
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

function generateID(length) {
    let ID = "";
    for (let i=0; i < length; i++) {
        ID += Math.floor(Math.random() * 10);
    }
    return ID;
}
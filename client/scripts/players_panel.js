import { socket } from "./game.js";

const playersContainer = document.querySelector("#players")

const getPlayerCard = (playerName) => {
    const playerCard = `
    <div class="player-card">
        <div class="online"></div>
        <p>${playerName}</p>
    </div>
    `
    return playerCard
}

socket.on("update_players", (ev) => {
    playersContainer.innerHTML = ''
    
    ev.players.forEach(player => {
        playersContainer.innerHTML += getPlayerCard(player.name)
    });
})
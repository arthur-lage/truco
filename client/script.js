const socket = io('http://localhost:3000')

const playersContainer = document.querySelector("#players")
const logContainer = document.querySelector("#logs")

const getPlayerCard = (playerName) => {
    const playerCard = `
    <div class="player-card">
        <p>${playerName}</p>
        <br/>
    </div>
    `
    return playerCard
}

socket.on("update_players", (ev) => {
    logContainer.innerHTML += `<p>${ev.message}</p>`

    playersContainer.innerHTML = ''
    
    ev.players.forEach(player => {
        playersContainer.innerHTML += getPlayerCard(player.name)
    });
})
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


const getNickname = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.nick;
}

const nickname = getNickname();

const socket = io('http://localhost:3000', {
    query: {
        nickname
    }
})

socket.emit("login_send", {nickname})

socket.on("update_players", (ev) => {
    logContainer.innerHTML += `<p>${ev.message}</p>`

    playersContainer.innerHTML = ''
    
    ev.players.forEach(player => {
        playersContainer.innerHTML += getPlayerCard(player.name)
    });
})
import { Player } from "./player.js"

export const socket = io('http://localhost:3000')

const getNickname = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.nick;
}

const nickname = getNickname();

socket.emit("login_send", {nickname})

export let player = new Player();

socket.on("player_info", (data) => {
    player = data.player
})
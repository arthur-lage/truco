import { Player } from "./player.js"

const gameWindow = document.querySelector("#game-window")
const cardsContainer = document.querySelector(".cards")
const lastCardsContainer = document.querySelector("#last-cards")
const overlay = document.querySelector(".overlay")

export const socket = io('http://localhost:3000')

function getNickname() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.nick;
}

function getCardElement(card) {
    return `
            <div data-idcarta="${card.idcarta}" class="card">
                <img src="../assets/cards/${card.idcarta}.png"/>
            </div>
        `
}

const nickname = getNickname();

socket.emit("login_send", { nickname })

export let player = new Player();

gameWindow.classList.add("not-your-turn")

function playCard(idCarta) {
    socket.emit("play_card", {
        playerId: player.id,
        cardId: idCarta
    })

    gameWindow.classList.add('not-your-turn')
}

socket.on("player_info", (data) => {
    player = data.player
})

socket.on("update_cards", (data) => {
    cardsContainer.innerHTML = ''

    data.currentCards.forEach(card => {
        const cardEl = getCardElement(card)
        cardsContainer.innerHTML += cardEl
    })

    cardsContainer.querySelectorAll(".card").forEach(el => {
        const idCarta = el.getAttribute("data-idcarta")
        el.addEventListener("click", () => { playCard(idCarta) })
    })
})

socket.on("your_turn", (data) => {
    showMessage("Sua vez!")
    gameWindow.classList.remove("not-your-turn")
})

socket.on("card_played", (data) => {
    lastCardsContainer.innerHTML += getCardElement(data.card)
})

socket.on("round_winner", (data) => {
    setTimeout(() => {
        lastCardsContainer.innerHTML = ""

        showMessage(data.message)
    }, 400);
})

socket.on("game_stop", () => {
    lastCardsContainer.innerHTML = ""
    cardsContainer.innerHTML = ""
})

function showMessage(msg) {
    const msgEl = document.createElement("div")
    msgEl.classList.add("message")
    msgEl.innerHTML = `<p>${msg}</p>`

    overlay.appendChild(msgEl)

    setTimeout(() => {
        msgEl.remove()
    }, 5000)
}

socket.on("game_end", (data) => {
    showMessage(`${data.gameWinner} venceu o jogo!`)
    showMessage(`Reiniciando...`)
})
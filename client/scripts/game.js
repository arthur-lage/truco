import { Player } from "./player.js"

const gameWindow = document.querySelector("#game-window")
const cardsContainer = document.querySelector(".cards")
const lastCardsContainer = document.querySelector("#last-cards")

export const socket = io('http://localhost:3000')

function getNickname () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    return params.nick;
}

function getCardElement (card) {
    return `
            <div data-idcarta="${card.idcarta}" class="card">
                <img src="../assets/cards/${card.idcarta}.png"/>
            </div>
        `
}

const nickname = getNickname();

socket.emit("login_send", {nickname})

export let player = new Player();

gameWindow.classList.add("not-your-turn")

function playCard (idCarta) {
    socket.emit("play_card", {
        playerId: player.id,
        cardId: idCarta
    })

    gameWindow.classList.add('not-your-turn')
}

socket.on("player_info", (data) => {
    player = data.player
})

socket.on("give_cards", (data) => {
    cardsContainer.innerHTML = ''

    data.currentCards.forEach(card => {
        const cardEl = getCardElement(card)
        cardsContainer.innerHTML += cardEl
    })

    cardsContainer.querySelectorAll(".card").forEach(el => {
        const idCarta = el.getAttribute("data-idcarta")
        el.addEventListener("click", () => {playCard(idCarta)})
    })
})

socket.on("your_turn", (data) => {
    alert("Sua vez")
    gameWindow.classList.remove("not-your-turn")    
})

socket.on("card_played", (data) => {
    lastCardsContainer.innerHTML += getCardElement(data.card)
    console.log("Botei a card played")
})

socket.on("round_winner", (data) => {
    lastCardsContainer.innerHTML = ""
    console.log("limpei")

    console.log(data)
})
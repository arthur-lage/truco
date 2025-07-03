import { socket, player } from './game.js'

const chatContainer = document.querySelector("#chat")
const chatBox = document.querySelector("#chatbox")
const sendMessageButton = document.querySelector("#send-message")

socket.on("chat_receive", (data) => {
    if(data.userSender.id == player.id) {
        chatContainer.innerHTML += `<p class="message user">Você: ${data.message}</p>`
    } else {
        chatContainer.innerHTML += `<p class="message user">${data.userSender.name}: ${data.message}</p>`    
    }
})

socket.on("server_message", (data) => {
    chatContainer.innerHTML += `<p class="message system"><em>${data.message}</em></p>`
})

const sendChatMessage = () => {
    if(chatBox.value.length > 0) {
        socket.emit("chat_send", {
            userSender: player,
            message: chatBox.value
        })
    }

    chatBox.value = ""
}

sendMessageButton.addEventListener("click", () => {
    sendChatMessage()
})
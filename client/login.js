const loginButton  = document.querySelector("#login")
const nicknameText = document.querySelector("#nickname")

loginButton.addEventListener("click", () => {
    const nick = nicknameText.value
    console.log("nick: ", nick)
    location.href="game.html?nick=" + nick
})
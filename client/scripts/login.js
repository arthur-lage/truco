const loginButton  = document.querySelector("#login")
const nicknameText = document.querySelector("#nickname")

loginButton.addEventListener("click", () => {
    const nick = nicknameText.value
    const newUrl = "/client/pages/game.html?nick=" + nick
    console.log(window.location.href)
    console.log(newUrl)
    
    location.href = newUrl
})
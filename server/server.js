import express from 'express'
import { createServer } from 'http'
import { GameInstance } from "./game-instance.js";
import { Player } from './player.js'
import { v4 } from 'uuid'
import { Server } from 'socket.io';

const PORT = 3000

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

app.get("/", (req, res) => {
    res.send("FUncionando")
})

try {
    const game = new GameInstance();

    io.on('connection', socket => {
    console.log("Jogador entrou.")
    const user_id = v4()
    socket.id = user_id

    const player = new Player()
    player.id = user_id
    player.name = user_id.slice(0, 5);

    game.addPlayer(player)

    io.emit("update_players", {
        message: '[Server]: ' + player.name + " entrou no jogo.",
        players: game.players,
        newPlayer: player
    })

    game.updateGameStatus()

    socket.on('disconnect', () => {
        console.log("Jogador desconectado: " + socket.id)
        game.removePlayer(socket.id)

        io.emit("update_players", {
            message: '[Server]: ' + player.name + " saiu do jogo.",
            players: game.players,
            disconnectedPlayer: socket.id
        })

        game.updateGameStatus()
    })

})
} catch (err) {
    io.emit("server_error", {
        message: "[Server]: Ocorreu um erro no servidor!"
    })
    console.error(err)
}

httpServer.listen(PORT, () => {
    console.log("servidor rodando no localhost:3000")
})
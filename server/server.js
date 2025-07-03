import express from 'express'
import { createServer } from 'http'
import { GameInstance } from "./game-instance.js";
import { Player } from './player.js'
import { v4 } from 'uuid'
import { Server } from 'socket.io';
import { PlayerMapper } from './mapper.js';

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

const updatePlayers = (game, player) => {
    io.emit("update_players", {
        message: '[Server]: ' + player.name + " entrou no jogo.",
        players: game.players,
        newPlayer: player
    })
}

const playerMapper = new PlayerMapper()

try {
    const game = new GameInstance();

    io.on('connection', socket => {
        console.log("Jogador entrou.")

        const user_id = v4()
        socket.id = user_id

        const player = new Player()

        socket.on("login_send", (data) => {
            const user_nickname = data.nickname

            const player = new Player()
            player.id = user_id
            player.name = user_nickname;

            game.addPlayer(player)

            game.updateGameStatus()

            updatePlayers(game, player)

            socket.emit("player_info", {
                player: playerMapper.playerInfoOnly(player)
            })

            socket.broadcast.emit("server_message", {
                message: player.name + " entrou no jogo."
            })
        })

        socket.on("chat_send", (messageData) => {
            if(messageData.message.length <= 0 || game.isPlayerInGame(messageData.userSender)) {
                return
            }

            socket.broadcast.emit("chat_receive", {
                userSender: messageData.userSender,
                message: messageData.message
            })
        })

        socket.on('disconnect', () => {
            console.log("Jogador desconectado: " + socket.id)
            game.removePlayer(socket.id)

            game.updateGameStatus()
            
            updatePlayers(game, player)
        })
    })
} catch (err) {
    io.emit("server_message", {
        message: "[Server]: Ocorreu um erro no servidor!"
    })

    console.error(err)
}

httpServer.listen(PORT, () => {
    console.log("servidor rodando no localhost:3000")
})
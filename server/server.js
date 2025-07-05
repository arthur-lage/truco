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

const playerSockets = new Map()

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
    const game = new GameInstance(playerSockets);
    game.setSocketIO(io)

    const addPlayerToGame = (player, socket) => {
        playerSockets.set(player.id, socket)

        game.addPlayer(player) // Agora dentro de addPlayer -> updateGameStatus

        updatePlayers(game, player)

        game.updateGameStatus()

        socket.emit("player_info", {
            player: playerMapper.playerInfoOnly(player)
        })

        socket.broadcast.emit("server_message", {
            message: player.name + " entrou no jogo."
        })
    }

    io.on('connection', socket => {
        console.log("Jogador entrou.")

        const user_id = v4()
        socket.id = user_id

        const player = new Player()

        socket.on("login_send", (data) => {
            const user_nickname = data.nickname

            player.id = user_id
            player.name = user_nickname;

            addPlayerToGame(player, socket)
        })

        socket.on("chat_send", (messageData) => {
            if (messageData.message.length <= 0 || game.isPlayerInGame(messageData.userSender)) {
                return
            }

            socket.broadcast.emit("chat_receive", {
                userSender: messageData.userSender,
                message: messageData.message
            })
        })

        socket.on("play_card", ({ playerId, cardId }) => {
            console.log("current palyer:" + game.getCurrentPlayer())
            
            if (playerId != game.getCurrentPlayer().id) {
                socket.emit("error_message", { message: "Não é a sua vez!" })
                return;
            }

            const result = game.playCard(playerId, cardId)
            if (!result.success) {
                socket.emit("error_message", { message: result.message });
                return;
            }

            io.emit("card_played", {
                playerId,
                card: result.card,
                remaining: result.remainingCards
            });

            // CORREÇÃO 3: Sincronização de eventos
            if (game.currentState === "round_end") {
                // Não emitir round_winner aqui - será feito pelo GameInstance
                // Apenas aguardar próxima rodada
            } else {
                // Chamar diretamente o método do jogo
                game.promptNextPlayer();
            }
        })

        socket.on('disconnect', () => {
            console.log("Jogador desconectado: " + socket.id)
            game.removePlayer(socket.id)
            playerSockets.delete(socket.id)

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
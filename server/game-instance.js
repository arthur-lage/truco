import { cards } from "./constants.js"

export class GameInstance {
    players = []
    currentCardStack = []
    running = false
    currentState = "waiting"
    currentPlayerIndex = 0
    currentRound = 1
    playedCards = []
    playerOrder = []

    constructor() {
        this.players = []
        this.currentCardStack = [...cards]
    }

    addPlayer(player) {
        this.players.push(player)
        this.updateGameStatus()
    }

    removePlayer(id) {
        this.players = this.players.filter(player => player.id !== id);
        this.updateGameStatus();
        
        // Se o jogo estava em andamento e um jogador saiu
        if (this.running) {
            this.stopGame();
        }
    }

    pickCard() {
        let randomIndex = Math.floor(Math.random() * this.currentCardStack.length - 1)
        let selectedCard = this.cards.splice(randomIndex, 1)
        return player.currentCards.push(selectedCard)
    }

    giveCards() {
        this.shuffleCards();
        
        this.players.forEach(player => {
            player.cards = this.currentCardStack.splice(0, 3);
        });
    }

    shuffleCards() {
        for (let i = this.currentCardStack.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentCardStack[i], this.currentCardStack[j]] = 
            [this.currentCardStack[j], this.currentCardStack[i]];
        }
    }

    setPlayerOrder() {
        this.playerOrder = [...this.players];
        this.shufflePlayerOrder();
        
        this.currentPlayerIndex = 0;
    }

    shufflePlayerOrder() {
        for (let i = this.playerOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playerOrder[i], this.playerOrder[j]] = 
            [this.playerOrder[j], this.playerOrder[i]];
        }
    }

    startGame() {
        if(this.players.length < 4) {
            console.log("Não há jogadores suficientes para começar.")
            return;
        }

        this.running = true;
        this.currentState = "dealing"
        this.giveCards()
        this.setPlayerOrder()
        this.currentState = "playing"
        console.log("Jogo iniciado.")
    }

    reset() {
        this.players.forEach(player => {
            player.reset()
        })
        this.currentCardStack = [...cards]
        this.playedCards = []
        this.currentRound = 1
        this.currentPlayerIndex = 0
    }

    stopGame() {
        this.running = false;
        this.currentState = "waiting"
        this.reset()
        console.log("Jogo interrompido.")
    }

    updateGameStatus() {
        if (this.players.length === 4 && !this.running) {
            this.startGame();
        }

        if (this.players.length < 4 && this.running) {
            this.stopGame();
        }
    }
    
    getCurrentPlayer() {
        return this.playerOrder[this.currentPlayerIndex];
    }

    playCard(playerId, cardIndex) {
        if (!this.running || this.currentState !== "playing") {
            return { success: false, message: "O jogo não está em andamento" };
        }

        const player = this.players.find(p => p.id === playerId);
        if (!player) {
            return { success: false, message: "Jogador não encontrado" };
        }

        if (player.id !== this.getCurrentPlayer().id) {
            return { success: false, message: "Não é a vez deste jogador" };
        }

        if (cardIndex < 0 || cardIndex >= player.cards.length) {
            return { success: false, message: "Carta inválida" };
        }

        const playedCard = player.cards.splice(cardIndex, 1)[0];
        
        this.playedCards.push({
            playerId: player.id,
            card: playedCard,
            round: this.currentRound
        });

        if (this.playedCards.length === 4) {
            this.endRound();
        } else {
            this.nextPlayer();
        }

        return { 
            success: true, 
            card: playedCard,
            remainingCards: player.cards.length
        };
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
    }

    endRound() {
        this.currentState = "round_end";
        
        const winner = this.determineRoundWinner();
        
        console.log(`Rodada ${this.currentRound} vencida por ${winner.player.name}`);
        
        setTimeout(() => {
            this.currentRound++;
            this.playedCards = [];
            
            if (this.currentRound > 3) {
                this.endGame();
            } else {
                this.currentState = "playing";
                const winnerIndex = this.playerOrder.findIndex(p => p.id === winner.player.id);
                this.currentPlayerIndex = winnerIndex;
                console.log(`Iniciando rodada ${this.currentRound}`);
            }
        }, 3000);
    }

    determineRoundWinner() {
        let strongestCard = this.playedCards[0];
        for (const played of this.playedCards) {
            if (played.card.value > strongestCard.card.value) {
                strongestCard = played;
            }
        }
        
        return {
            player: this.players.find(p => p.id === strongestCard.playerId),
            card: strongestCard.card
        };
    }

    endGame() {
        this.currentState = "game_end";
        console.log("Fim de jogo!");
        
        setTimeout(() => {
            this.reset();
            this.startGame();
        }, 10000);
    }

    isPlayerInGame (player) {
        this.players.forEach(p => {
            if(player.id == p.id) return true;
        })
        return false;
    }
}
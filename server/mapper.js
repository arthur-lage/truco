export class PlayerMapper {
    constructor() {}

    playerInfoOnly(player) {
        return {
            id: player.id,
            name: player.name
        }
    }

    inGame(player) {
        return {
            id: player.id,
            name: player.name,
            currentCards: player.currentCards
        }
    }
}
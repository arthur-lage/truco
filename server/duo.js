export class Duo {
    id // "A" ou "B"
    players = []
    points = 0

    constructor (id) {
        this.id = id
        this.players = []
        this.points = 0
    }

    addPoints(pointsToAdd) {
        this.points += pointsToAdd
    }
}
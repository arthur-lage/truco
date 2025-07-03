export class Player {
    id = ""
    name = ""
    currentCards = []
    points = 0
    matchesWon = 0
    team = ""

    constructor (id, name) {
        this.id = id
        this.name = name
        this.points = 0
        this.matchesWon = 0
    }   

    reset () {
        this.currentCards = []
        this.points = 0
    }

    useCard () {

    }
}
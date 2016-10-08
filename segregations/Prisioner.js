"use strict";
const GAME_ITERATIONS = 100;
class Prisioner {
    constructor(chromosome, x, y, world, block2d) {
        this.chromosome = chromosome;
        this.x = x;
        this.y = y;
        this.world = world;
        this.block2d = block2d;
        this.gameScore = 0;
        this.pastGambles = new Array(4).fill(0);
        this.strategies = chromosome.split('').map(cv => parseInt(cv));
        this.block2d.setFillStyleKey(this.chromosome);
    }
    improveStrategy() {
        let ownBestScore = Number.MAX_VALUE;
        let bestOpponent = this;
        for (let i = this.x - 1; i <= this.x + 1; i++) {
            for (let j = this.y - 1; j <= this.y + 1; j++) {
                if (i == this.x && j == this.y)
                    continue;
                let opponent = this.world.getPrisioner(i, j);
                this.game(opponent);
                if (this.gameScore < ownBestScore)
                    ownBestScore = this.gameScore;
                if (opponent.gameScore < bestOpponent.gameScore)
                    bestOpponent = opponent;
            }
        }
        if (bestOpponent.gameScore < ownBestScore) {
            this.chromosome = bestOpponent.chromosome;
            this.strategies = bestOpponent.strategies.slice(0);
            this.block2d.setFillStyleKey(this.chromosome);
        }
    }
    game(opponent) {
        this.startGame();
        opponent.startGame(this.pastGambles);
        for (let k = 0; k < GAME_ITERATIONS; k++) {
            let thisGamble = this.nextGamble();
            let opponentGamble = opponent.nextGamble();
            let payments = this.world.bet(thisGamble, opponentGamble);
            this.gameScore += payments.player;
            opponent.gameScore += payments.opponent;
            this.updatePast(thisGamble, opponentGamble);
            opponent.updatePast(opponentGamble, thisGamble);
        }
    }
    startGame(opponentGambles) {
        this.gameScore = 0;
        if (opponentGambles) {
            this.pastGambles[0] = opponentGambles[1];
            this.pastGambles[1] = opponentGambles[0];
            this.pastGambles[2] = opponentGambles[3];
            this.pastGambles[3] = opponentGambles[2];
        }
        else {
            this.pastGambles[0] = Math.round(Math.random());
            this.pastGambles[1] = Math.round(Math.random());
            this.pastGambles[2] = Math.round(Math.random());
            this.pastGambles[3] = Math.round(Math.random());
        }
    }
    nextGamble() {
        let order = this.pastGambles.reduce((pv, cv, idx) => {
            return pv + Math.pow(2 * cv, idx);
        }, 0);
        return this.strategies[order];
    }
    updatePast(ownGamble, opponentGamble) {
        this.pastGambles.splice(0, 2);
        this.pastGambles.push(ownGamble, opponentGamble);
    }
}
exports.Prisioner = Prisioner;

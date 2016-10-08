import {World, Gamble} from './World';
import {Block2D} from '../common/Block2D';

const GAME_ITERATIONS = 100;
export class Prisioner {
    gameScore = 0;
    pastGambles: number[] = new Array(4).fill(0);
    strategies: number[];
    constructor(
        private chromosome: string,
        private x: number,
        private y: number,
        private world: World,
        private block2d: Block2D
    ) {
        this.strategies = chromosome.split('').map(cv => parseInt(cv));
        this.block2d.setFillStyleKey(this.chromosome);
    }
    improveStrategy() {
        let ownBestScore = Number.MAX_VALUE;
        let bestOpponent: Prisioner = this;
        for (let i = this.x - 1; i <= this.x + 1; i++) {
            for (let j = this.y - 1; j <= this.y + 1; j++) {
                if (i == this.x && j == this.y) continue;
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
    private game(opponent: Prisioner) {
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
    private startGame(opponentGambles?: number[]) {
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
    private nextGamble(): Gamble {
        let order = this.pastGambles.reduce((pv, cv, idx) => {
            return pv + Math.pow(2 * cv, idx);
        }, 0);
        return this.strategies[order];
    }
    private updatePast(ownGamble: Gamble, opponentGamble: Gamble) {
        this.pastGambles.splice(0, 2);
        this.pastGambles.push(ownGamble, opponentGamble);
    }
}
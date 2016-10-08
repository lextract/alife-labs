import {Board2D} from '../common/Board2D';
import {Prisioner} from './Prisioner';

const LENGTH_CHROMOSOME = 16;

export enum GamblePayment {
    COOPERATE_C = 3,
    COOPERATE_D = 8,
    DEFEAT_C = 1,
    DEFEAT_D = 4
}
export enum Gamble {
    COOPERATE = 0,
    DEFEAT = 1
}
export class World {
    private prisioners: Prisioner[][];
    private board: Board2D;
    constructor(
        private containderId: string,
        private xPrisioners: number,
        private yPrisioners: number
    ) {
        this.board = new Board2D(containderId, xPrisioners, yPrisioners);
        this.initializeColorsFinder();
        this.initializePrisioners();
        this.board.draw();
    }
    simulate(generations: number) {
        let updateGenerator;
        let instance = this;
        function* drawState() {
            for (let i = 0; i < generations; i++) {
                instance.iteratePrisioners();
                instance.board.draw();
                setTimeout(() => {
                    updateGenerator.next();
                }, 20);
                yield;
            }
        }
        updateGenerator = drawState();
        updateGenerator.next();
    }
    iteratePrisioners() {
        for (let i = 0; i < this.xPrisioners; i++) {
            for (let j = 0; j < this.yPrisioners; j++) {
                this.prisioners[i][j].improveStrategy();
            }
        }
    }
    getPrisioner(x: number, y: number): Prisioner {
        if (x < 0) x = this.xPrisioners + x;
        if (x >= this.xPrisioners) x = 0;
        if (y < 0) y = this.yPrisioners + y;
        if (y >= this.yPrisioners) y = 0;
        return this.prisioners[x][y];
    }
    bet(player: Gamble, opponent: Gamble): Payments {
        if (player == Gamble.COOPERATE) {
            if (opponent == Gamble.COOPERATE) return {
                player: GamblePayment.COOPERATE_C,
                opponent: GamblePayment.COOPERATE_C
            };
            else return {
                player: GamblePayment.COOPERATE_D,
                opponent: GamblePayment.DEFEAT_C
            };
        }
        else {
            if (opponent == Gamble.COOPERATE) return {
                player: GamblePayment.DEFEAT_C,
                opponent: GamblePayment.COOPERATE_D
            };
            else return {
                player: GamblePayment.DEFEAT_D,
                opponent: GamblePayment.DEFEAT_D
            };
        }
    }
    private initializePrisioners() {
        this.prisioners = new Array(this.xPrisioners);
        for (let i = 0; i < this.xPrisioners; i++) {
            this.prisioners[i] = new Array(this.yPrisioners);
            for (let j = 0; j < this.yPrisioners; j++) {
                let c = this.randomChromosome();
                this.prisioners[i][j] = new Prisioner(c, i, j, this, this.board.blocks[i][j]);
            }
        }
    }
    private randomChromosome(): string {
        let chromosome = new Array(LENGTH_CHROMOSOME);
        for (let k = 0; k < LENGTH_CHROMOSOME; k++) {
            chromosome[k] = Math.round(Math.random());
        }
        return chromosome.join('');
    }
    private initializeColorsFinder() {
        let chromosomeColors = new Map<string, string>();
        this.board.fnFillStyleFinder = (key: string) => {
            if (chromosomeColors.has(key)) {
                return chromosomeColors.get(key);
            }
            else {
                let rc = generateRandomColor();
                chromosomeColors.set(key, rc);
                return rc;
            }
        }
    }
}
function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
type Payments = {
    player: GamblePayment;
    opponent: GamblePayment;
}
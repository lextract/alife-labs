"use strict";
const Board2D_1 = require('../common/Board2D');
const Prisioner_1 = require('./Prisioner');
const LENGTH_CHROMOSOME = 16;
(function (GamblePayment) {
    GamblePayment[GamblePayment["COOPERATE_C"] = 3] = "COOPERATE_C";
    GamblePayment[GamblePayment["COOPERATE_D"] = 8] = "COOPERATE_D";
    GamblePayment[GamblePayment["DEFEAT_C"] = 1] = "DEFEAT_C";
    GamblePayment[GamblePayment["DEFEAT_D"] = 4] = "DEFEAT_D";
})(exports.GamblePayment || (exports.GamblePayment = {}));
var GamblePayment = exports.GamblePayment;
(function (Gamble) {
    Gamble[Gamble["COOPERATE"] = 0] = "COOPERATE";
    Gamble[Gamble["DEFEAT"] = 1] = "DEFEAT";
})(exports.Gamble || (exports.Gamble = {}));
var Gamble = exports.Gamble;
class World {
    constructor(containderId, xPrisioners, yPrisioners) {
        this.containderId = containderId;
        this.xPrisioners = xPrisioners;
        this.yPrisioners = yPrisioners;
        this.board = new Board2D_1.Board2D(containderId, xPrisioners, yPrisioners);
        this.initializeColorsFinder();
        this.initializePrisioners();
        this.board.draw();
    }
    simulate(generations) {
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
    getPrisioner(x, y) {
        if (x < 0)
            x = this.xPrisioners + x;
        if (x >= this.xPrisioners)
            x = 0;
        if (y < 0)
            y = this.yPrisioners + y;
        if (y >= this.yPrisioners)
            y = 0;
        return this.prisioners[x][y];
    }
    bet(player, opponent) {
        if (player == Gamble.COOPERATE) {
            if (opponent == Gamble.COOPERATE)
                return {
                    player: GamblePayment.COOPERATE_C,
                    opponent: GamblePayment.COOPERATE_C
                };
            else
                return {
                    player: GamblePayment.COOPERATE_D,
                    opponent: GamblePayment.DEFEAT_C
                };
        }
        else {
            if (opponent == Gamble.COOPERATE)
                return {
                    player: GamblePayment.DEFEAT_C,
                    opponent: GamblePayment.COOPERATE_D
                };
            else
                return {
                    player: GamblePayment.DEFEAT_D,
                    opponent: GamblePayment.DEFEAT_D
                };
        }
    }
    initializePrisioners() {
        this.prisioners = new Array(this.xPrisioners);
        for (let i = 0; i < this.xPrisioners; i++) {
            this.prisioners[i] = new Array(this.yPrisioners);
            for (let j = 0; j < this.yPrisioners; j++) {
                let c = this.randomChromosome();
                this.prisioners[i][j] = new Prisioner_1.Prisioner(c, i, j, this, this.board.blocks[i][j]);
            }
        }
    }
    randomChromosome() {
        let chromosome = new Array(LENGTH_CHROMOSOME);
        for (let k = 0; k < LENGTH_CHROMOSOME; k++) {
            chromosome[k] = Math.round(Math.random());
        }
        return chromosome.join('');
    }
    initializeColorsFinder() {
        let chromosomeColors = new Map();
        this.board.fnFillStyleFinder = (key) => {
            if (chromosomeColors.has(key)) {
                return chromosomeColors.get(key);
            }
            else {
                let rc = generateRandomColor();
                chromosomeColors.set(key, rc);
                return rc;
            }
        };
    }
}
exports.World = World;
function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

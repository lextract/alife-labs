"use strict";
const Board2D_1 = require('../common/Board2D');
class Terrain {
    constructor(containderId, size) {
        this.containderId = containderId;
        this.size = size;
        this.board = new Board2D_1.Board2D(containderId, size, size);
        this.initializeColorStates();
        this.initializeStates();
        this.board.draw();
    }
    initializeStates() {
        this.matrixStates = new Array(this.size);
        for (var i = 0; i < this.size; i++) {
            this.matrixStates[i] = new Array(this.size);
            for (var j = 0; j < this.size; j++) {
                let state = 0;
                if (!(i == 0 || i == this.size - 1 || j == 0 || j == this.size - 1))
                    state = Math.round(Math.random() * 3);
                this.matrixStates[i][j] = state;
                this.board.blocks[i][j].setIndexColor(state);
            }
        }
    }
    initializeColorStates() {
        this.board.colors.push("#777");
        this.board.colors.push("#0D3398");
        this.board.colors.push("#00B500");
        this.board.colors.push("#e29900");
        this.board.colors.push("#e20000");
    }
    putGrains(nGrains) {
        let updateGenerator;
        let instance = this;
        function* drawState() {
            for (let i = 0; i < nGrains; i++) {
                let x = Math.floor(Math.random() * instance.size);
                let y = Math.floor(Math.random() * instance.size);
                instance.matrixStates[x][y]++;
                instance.board.blocks[x][y].setIndexColor(instance.matrixStates[x][y]);
                let criticalStates = instance.updateStates();
                do {
                    instance.board.draw();
                    setTimeout(() => {
                        updateGenerator.next();
                    }, 50);
                    yield;
                    criticalStates = instance.updateStates();
                } while (criticalStates > 0);
            }
        }
        updateGenerator = drawState();
        updateGenerator.next();
    }
    updateStates() {
        let criticalStates = 0;
        for (let j = 0; j < this.size; j++) {
            for (let k = 0; k < this.size; k++) {
                if (this.matrixStates[j][k] >= 4) {
                    criticalStates++;
                    this.matrixStates[j][k] -= 4;
                    this.board.blocks[j][k].setIndexColor(this.matrixStates[j][k]);
                    if (j < this.size - 1 && k < this.size - 1) {
                        this.matrixStates[j + 1][k + 1]++;
                        this.board.blocks[j + 1][k + 1].setIndexColor(this.matrixStates[j + 1][k + 1]);
                    }
                    if (j < this.size - 1 && k > 0) {
                        this.matrixStates[j + 1][k - 1]++;
                        this.board.blocks[j + 1][k - 1].setIndexColor(this.matrixStates[j + 1][k - 1]);
                    }
                    if (j > 0 && k < this.size - 1) {
                        this.matrixStates[j - 1][k + 1]++;
                        this.board.blocks[j - 1][k + 1].setIndexColor(this.matrixStates[j - 1][k + 1]);
                    }
                    if (j > 0 && k > 0) {
                        this.matrixStates[j - 1][k - 1]++;
                        this.board.blocks[j - 1][k - 1].setIndexColor(this.matrixStates[j - 1][k - 1]);
                    }
                }
            }
        }
        return criticalStates;
    }
}
exports.Terrain = Terrain;

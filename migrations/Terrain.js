"use strict";
class Terrain {
    constructor(size) {
        this.size = size;
        this.board = new Array(size);
        for (let i = 0; i < size; i++) {
            this.board[i] = new Array(size);
        }
    }
    generateResources(alpha, x1, y1, x2, y2) {
        this.alpha = alpha;
        this.board[x1][y1] = this.alpha;
        this.board[x2][y2] = this.alpha;
        let factores = [1, 0.9, 0.7, 0.4, 0.1];
        //let sum = 0;
        for (let i = 1; i < 5; i++) {
            //sum += i; 
            //factor = 1 - (sum / 10);
            this.setLevel(x1, y1, i, factores[i]);
            this.setLevel(x2, y2, i, factores[i]);
        }
    }
    setLevel(x, y, level, factor) {
        let x1 = x - level; // < 0 ? 0: x-level;
        let x2 = x + level; // > this.size ? this.size : x+level;
        let y1 = y - level; // < 0 ? 0: y-level;
        let y2 = y + level; // > this.size ? this.size : y+level;
        let xi = 0, xj = this.size;
        let yi = 0, yj = this.size;
        if (x1 >= 0 && x2 <= this.size) {
            xi = x1;
            while (xi <= x2) {
                this.board[xi][y1] = this.alpha * factor;
                this.board[xi][y2] = this.alpha * factor;
                xi++;
            }
        }
        if (y1 >= 0 && y2 <= this.size) {
            yi = y1;
            while (yi <= y2) {
                this.board[x1][yi] = this.alpha * factor;
                this.board[x2][yi] = this.alpha * factor;
                yi++;
            }
        }
    }
}
exports.Terrain = Terrain;

"use strict";
class Block2D {
    constructor(x, y, board) {
        this.x = x;
        this.y = y;
        this.board = board;
    }
    setIndexColor(idx) {
        this.indexColor = idx;
    }
    setFillStyleKey(key) {
        this.fillStyleKey = key;
    }
    draw(ctx) {
        //ctx.fillStyle= this.board.colors[this.indexColor];
        ctx.fillStyle = this.board.fnFillStyleFinder(this.fillStyleKey);
        let x = this.x * this.board.widthBlock, y = this.y * this.board.heightBlock, w = this.board.widthBlock, h = this.board.heightBlock;
        ctx.fillRect(x, y, w, h);
    }
}
exports.Block2D = Block2D;

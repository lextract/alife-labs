import {Board2D} from './Board2D'

export class Block2D {
    private indexColor: number;
    private fillStyleKey: string;
    constructor(
        private x: number,
        private y: number,
        private board: Board2D
    ) { }
    setIndexColor(idx: number){
        this.indexColor = idx;
    }
    setFillStyleKey(key: string){
        this.fillStyleKey = key;
    }
    draw(ctx: CanvasRenderingContext2D) {
        //ctx.fillStyle= this.board.colors[this.indexColor];
        ctx.fillStyle = this.board.fnFillStyleFinder(this.fillStyleKey);
        let x = this.x * this.board.widthBlock,
            y = this.y * this.board.heightBlock,
            w = this.board.widthBlock,
            h = this.board.heightBlock;
        ctx.fillRect(x,y,w,h);
    }

}
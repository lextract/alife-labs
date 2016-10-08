import {Block2D} from './Block2D'

export class Board2D {
    colors: Array<string> = [];
    widthBlock: number;
    heightBlock: number;
    blocks: Array<Array<Block2D>>;
    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private container: HTMLDivElement;
    fnFillStyleFinder: (key: string) => string | CanvasGradient | CanvasPattern;
    constructor(
        private containerId: string,
        private xBlocks: number = 1,
        private yBlocks: number = 1
    ) {
        this.container = <HTMLDivElement>document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.resetMeasures();
        this.initializeBlocks();
        window.onresize = () => {
            this.resetMeasures();
            this.draw();
        };
    }

    // getFillStyleByKey(key: string): string | CanvasGradient | CanvasPattern {
    //     return this.fnFillStyle(key);
    // }
    // setFillStyleFinder(fn: (string) => string | CanvasGradient | CanvasPattern) {
    //     this.fnFillStyle = fn;
    // }
    private initializeBlocks() {
        this.blocks = new Array(this.xBlocks);
        for (let i = 0; i < this.xBlocks; i++) {
            this.blocks[i] = new Array(this.yBlocks);
            for (let j = 0; j < this.yBlocks; j++) {
                this.blocks[i][j] = new Block2D(i + 1, j + 1, this);
            }
        }
    }

    // TODO: configure min width, min height, max width, max height
    private resetMeasures() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        this.widthBlock = this.width / (this.xBlocks + 2);
        this.heightBlock = this.height / (this.xBlocks + 2);

    }
    draw() {
        if (!this.fnFillStyleFinder) {
            console.warn('No yet implemented fnFillStyle on Board2D!');
            return;
        }
        let ctx = this.canvas.getContext('2d');
        for (let i = 0; i < this.xBlocks; i++) {
            for (let j = 0; j < this.yBlocks; j++) {
                this.blocks[i][j].draw(ctx);
            }
        }
    }
}

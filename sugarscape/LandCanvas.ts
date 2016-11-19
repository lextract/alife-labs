import { Subject } from 'rxjs/Subject.js';
import { PLOT_MEASURES } from './LandPlot.js';
import { MIGRANT_MEASURES } from './Migrant.js';

export class LandCanvas {
    onDraw: Subject<CanvasRenderingContext2D>;
    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private container: HTMLDivElement;

    constructor(
        private containerId: string,
        public xBlocks: number,
        public yBlocks: number
    ) {
        this.container = <HTMLDivElement>document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.onDraw = new Subject();
        this.resetMeasures();
        window.onresize = () => {
            this.resetMeasures();
            this.draw();
        };
    }
    resetMeasures() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        PLOT_MEASURES.width = this.width / this.xBlocks;
        PLOT_MEASURES.height = this.height / this.yBlocks;
        MIGRANT_MEASURES.xCenter = PLOT_MEASURES.width / 2;
        MIGRANT_MEASURES.yCenter = PLOT_MEASURES.height / 2;
        if (MIGRANT_MEASURES.xCenter > MIGRANT_MEASURES.yCenter)
            MIGRANT_MEASURES.radius = MIGRANT_MEASURES.yCenter * .8;
        else MIGRANT_MEASURES.radius = MIGRANT_MEASURES.xCenter * .8;
        MIGRANT_MEASURES.xGapMouth = MIGRANT_MEASURES.radius * .4;
        MIGRANT_MEASURES.eyeRaduis = MIGRANT_MEASURES.radius / 3;
        MIGRANT_MEASURES.xEyeCenter = MIGRANT_MEASURES.xCenter;
        MIGRANT_MEASURES.yEyeCenter = MIGRANT_MEASURES.yCenter - (MIGRANT_MEASURES.radius * .7);
    }
    draw() {
        let ctx = this.canvas.getContext('2d');
        this.onDraw.next(ctx);
    }
}

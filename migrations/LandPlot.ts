import {LandCanvas} from './LandCanvas';

export const PLOT_COLORS = [
    "#FFE6AD",
    "#57f857",
    "#23ee23",
    "#00e200",
    "#00a400",
    "#005700"
];

export class LandPlot {
    isBusy: boolean = false;
    levelResources: number = 0;
    indexColor: number = 0;
    constructor(
        public x: number,
        public y: number,
        private land: LandCanvas
    ) {
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.updateState();
        ctx.fillStyle = PLOT_COLORS[this.indexColor];
        let x = this.x * this.land.plotMeasures.width,
            y = this.y * this.land.plotMeasures.height,
            w = this.land.plotMeasures.width,
            h = this.land.plotMeasures.height;
        ctx.fillRect(x, y, w, h);
    }
    updateState() {
        let idx = (PLOT_COLORS.length - 1) * this.levelResources / this.land.plotMeasures.maxLevelResources;
        this.indexColor = Math.round(idx);
    }
}
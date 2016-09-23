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
    private _levelResources: number = 0;
    private indexColor: number = 0;
    constructor(
        public x: number,
        public y: number,
        private land: LandCanvas
    ) {
    }
    get levelResources(){
        return this._levelResources;
    }
    set levelResources(value: number){
        this._levelResources = value;
        this.updateState();
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = PLOT_COLORS[this.indexColor];
        let x = this.x * this.land.plotMeasures.width,
            y = this.y * this.land.plotMeasures.height,
            w = this.land.plotMeasures.width,
            h = this.land.plotMeasures.height;
        ctx.fillRect(x, y, w, h);
    }
    private updateState() {
        let idx = (PLOT_COLORS.length - 1) * this.levelResources / this.land.plotMeasures.maxLevelResources;
        this.indexColor = Math.round(idx);
    }
}
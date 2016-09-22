import {LandCanvas} from './LandCanvas';
import {LandPlot} from './LandPlot';
import {Migrant} from './Migrant';

const alphaFactors = [1, 0.9, 0.7, 0.4, 0.1];

export class LandMigrations {
    alpha: number = 0;
    land: LandCanvas;
    plots: Array<Array<LandPlot>>;
    alphaResources: Array<AlphaResource> = [];
    migrants: Array<Migrant>;
    constructor(
        private containerId: string,
        private xPlots: number,
        private yPlots: number,
        private beings: number
    ) {
        this.land = new LandCanvas(containerId, xPlots, yPlots);
        this.land.drawFunctions.push(ctx => {this.drawPlots(ctx)});
        this.land.drawFunctions.push(ctx =>{this.drawMigrants(ctx)});
    }

    private initializeMigrants(){
        this.migrants = new Array(this.beings);
        for (let i=0; i < this.beings; i++){
            let plot: LandPlot;
            let x =0,y=0;
            do{
                x = Math.floor(Math.random() * this.xPlots);
                y = Math.floor(Math.random() * this.yPlots);
                plot = this.plots[x][y];
            }
            while(plot.isBusy)
            this.migrants.push(new Migrant(x,y,this.land));
            plot.isBusy = true;
        }
    }

    initialize() {
        this.initializePlots();
        this.initializeMigrants();
        this.land.draw();
    }

    drawPlots(ctx: CanvasRenderingContext2D) {
        console.log(ctx);
        this.plots.forEach(arrPlot => arrPlot.forEach(item => item.draw(ctx)));

    }
    drawMigrants(ctx: CanvasRenderingContext2D) {
        this.migrants.forEach(mig => mig.draw(ctx));
    }

    private initializePlots() {
        this.plots = new Array(this.xPlots);
        for (let i = 0; i < this.xPlots; i++) {
            this.plots[i] = new Array(this.yPlots);
            for (let j = 0; j < this.yPlots; j++) {
                let plot = new LandPlot(i, j, this.land);
                this.calculateResources(plot);
                this.plots[i][j] = plot;
            }
        }
    }

    private calculateResources(plot: LandPlot) {
        this.alphaResources.some(item => {
            let dx = Math.abs(plot.x - item.x);
            let dy = Math.abs(plot.y - item.y);
            if (dx >= alphaFactors.length || dy >= alphaFactors.length)
                return false;
            else {
                if (dx > dy) plot.levelResources = alphaFactors[dx] * item.alpha;
                else plot.levelResources = alphaFactors[dy] * item.alpha;
                return true;
            }
        });
    }

    addAlphaResources(alpha: number, x: number, y: number) {
        this.alpha = alpha > this.alpha ? alpha : this.alpha;
        this.land.plotMeasures.maxLevelResources = this.alpha;
        this.alphaResources.push(new AlphaResource(alpha, x, y));
    }

}

class AlphaResource {
    constructor(
        public alpha: number,
        public x: number,
        public y: number
    ) { }
}
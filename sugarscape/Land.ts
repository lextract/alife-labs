import { LandCanvas } from './LandCanvas.js';
import { LandPlot } from './LandPlot.js';
import { Migrant, Chromosome } from './Migrant.js';

const alphaFactors = [1, 0.9, 0.7, 0.4, 0.1];

export enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

export class Land {
    simulating = false;
    simulationDelay = 100;
    private canvas: LandCanvas;
    private plots: LandPlot[][];
    private population: Migrant[] = [];
    constructor(
        private containerId: string,
        public xPlots: number,
        public yPlots: number
    ) {
        this.canvas = new LandCanvas(containerId, xPlots, yPlots);
        this.initializePlots();
        this.canvas.onDraw.subscribe((ctx) => this.draw(ctx));
    }
    resetPlots(xPlots: number, yPlots: number) {
        this.xPlots = xPlots;
        this.yPlots = yPlots;
        this.canvas.xBlocks = xPlots;
        this.canvas.yBlocks = yPlots;
        this.initializePlots();
    }
    private draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.xPlots; i++) {
            for (let j = 0; j < this.yPlots; j++) {
                this.plots[i][j].draw(ctx);
            }
        }
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].draw(ctx);
        }
    }
    redraw() {
        this.canvas.resetMeasures();
        this.canvas.draw();
    }
    getPlot(x: number, y: number): LandPlot {
        if (x < 0) x = this.xPlots + (x % this.xPlots);
        if (x >= this.xPlots) x = x % this.xPlots;
        if (y < 0) y = this.yPlots + (y % this.yPlots);
        if (y >= this.yPlots) y = y % this.yPlots;
        return this.plots[x][y];
    }
    private initializePlots() {
        this.plots = new Array(this.xPlots);
        for (let i = 0; i < this.xPlots; i++) {
            this.plots[i] = new Array(this.yPlots);
            for (let j = 0; j < this.yPlots; j++) {
                let plot = new LandPlot(i, j);
                this.plots[i][j] = plot;
            }
        }
    }
    simulate() {
        this.simulating = true;
        let instance = this;
        function* oneStepFn() {
            while (instance.simulating) {
                instance.simulateOneStep();
                setTimeout(() => {
                    oneStepGenerator.next();
                }, instance.simulationDelay);
                yield;
            }
        }
        let oneStepGenerator = oneStepFn();
        oneStepGenerator.next();
    }
    stopSimulation() {
        this.simulating = false;
    }
    simulateOneStep() {
        this.canvas.draw();
    }
    addResources(alpha: number, x: number, y: number, growthRate?: number, pollutionGrowthRate?: number) {
        let x1 = x - alphaFactors.length;
        let x2 = x + alphaFactors.length;
        let y1 = y - alphaFactors.length;
        let y2 = y + alphaFactors.length;
        for (let i = x1; i <= x2; i++) {
            let dx = Math.abs(x - i);
            for (let j = y1; j <= y2; j++) {
                let dy = Math.abs(y - j);
                let energy = dx > dy ? alphaFactors[dx] * alpha : alphaFactors[dy] * alpha;
                let plot = this.getPlot(i, j);
                plot.setResources(energy, growthRate, pollutionGrowthRate);
            }
        }
    }
    addMigrants(
        migrantVision: number, deltaVision: number,
        metabolism: number, nibbleSize: number,
        minEnergy: number, maxAge: number, deltaMaxAge: number,
        population: number, populationColor: string
    ) {
        for (let i = 0; i < population; i++) {
            let migrant = new Migrant(new Chromosome(
                Math.round((migrantVision - deltaVision) + (2 * deltaVision * Math.random())),
                metabolism, nibbleSize, minEnergy
            ));
            migrant.color = populationColor;
            this.population.push(migrant);
            // put on free plot
            let plot: LandPlot;
            let x = 0, y = 0;
            do {
                x = Math.floor(Math.random() * this.xPlots);
                y = Math.floor(Math.random() * this.yPlots);
                plot = this.plots[x][y];
            }
            while (plot.isBusy)
            migrant.currentPlot = plot;
            plot.isBusy = true;
        }
    }


}
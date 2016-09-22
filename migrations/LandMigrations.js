"use strict";
const LandCanvas_1 = require('./LandCanvas');
const LandPlot_1 = require('./LandPlot');
const Migrant_1 = require('./Migrant');
const alphaFactors = [1, 0.9, 0.7, 0.4, 0.1];
class LandMigrations {
    constructor(containerId, xPlots, yPlots, beings) {
        this.containerId = containerId;
        this.xPlots = xPlots;
        this.yPlots = yPlots;
        this.beings = beings;
        this.alpha = 0;
        this.alphaResources = [];
        this.land = new LandCanvas_1.LandCanvas(containerId, xPlots, yPlots);
        this.land.drawFunctions.push(ctx => { this.drawPlots(ctx); });
        this.land.drawFunctions.push(ctx => { this.drawMigrants(ctx); });
    }
    initializeMigrants() {
        this.migrants = new Array(this.beings);
        for (let i = 0; i < this.beings; i++) {
            let plot;
            let x = 0, y = 0;
            do {
                x = Math.floor(Math.random() * this.xPlots);
                y = Math.floor(Math.random() * this.yPlots);
                plot = this.plots[x][y];
            } while (plot.isBusy);
            this.migrants.push(new Migrant_1.Migrant(x, y, this.land));
            plot.isBusy = true;
        }
    }
    initialize() {
        this.initializePlots();
        this.initializeMigrants();
        this.land.draw();
    }
    drawPlots(ctx) {
        console.log(ctx);
        this.plots.forEach(arrPlot => arrPlot.forEach(item => item.draw(ctx)));
    }
    drawMigrants(ctx) {
        this.migrants.forEach(mig => mig.draw(ctx));
    }
    initializePlots() {
        this.plots = new Array(this.xPlots);
        for (let i = 0; i < this.xPlots; i++) {
            this.plots[i] = new Array(this.yPlots);
            for (let j = 0; j < this.yPlots; j++) {
                let plot = new LandPlot_1.LandPlot(i, j, this.land);
                this.calculateResources(plot);
                this.plots[i][j] = plot;
            }
        }
    }
    calculateResources(plot) {
        this.alphaResources.some(item => {
            let dx = Math.abs(plot.x - item.x);
            let dy = Math.abs(plot.y - item.y);
            if (dx >= alphaFactors.length || dy >= alphaFactors.length)
                return false;
            else {
                if (dx > dy)
                    plot.levelResources = alphaFactors[dx] * item.alpha;
                else
                    plot.levelResources = alphaFactors[dy] * item.alpha;
                return true;
            }
        });
    }
    addAlphaResources(alpha, x, y) {
        this.alpha = alpha > this.alpha ? alpha : this.alpha;
        this.land.plotMeasures.maxLevelResources = this.alpha;
        this.alphaResources.push(new AlphaResource(alpha, x, y));
    }
}
exports.LandMigrations = LandMigrations;
class AlphaResource {
    constructor(alpha, x, y) {
        this.alpha = alpha;
        this.x = x;
        this.y = y;
    }
}

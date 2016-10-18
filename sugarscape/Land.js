"use strict";
const LandCanvas_js_1 = require('./LandCanvas.js');
const LandPlot_js_1 = require('./LandPlot.js');
const Migrant_js_1 = require('./Migrant.js');
const alphaFactors = [1, 0.9, 0.7, 0.4, 0.1];
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
class Land {
    constructor(containerId, xPlots, yPlots) {
        this.containerId = containerId;
        this.xPlots = xPlots;
        this.yPlots = yPlots;
        this.simulating = false;
        this.simulationDelay = 100;
        this.population = [];
        this.canvas = new LandCanvas_js_1.LandCanvas(containerId, xPlots, yPlots);
        this.initializePlots();
        this.canvas.onDraw.subscribe((ctx) => this.draw(ctx));
    }
    resetPlots(xPlots, yPlots) {
        this.xPlots = xPlots;
        this.yPlots = yPlots;
        this.canvas.xBlocks = xPlots;
        this.canvas.yBlocks = yPlots;
        this.initializePlots();
    }
    draw(ctx) {
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
    getPlot(x, y) {
        if (x < 0)
            x = this.xPlots + (x % this.xPlots);
        if (x >= this.xPlots)
            x = x % this.xPlots;
        if (y < 0)
            y = this.yPlots + (y % this.yPlots);
        if (y >= this.yPlots)
            y = y % this.yPlots;
        return this.plots[x][y];
    }
    initializePlots() {
        this.plots = new Array(this.xPlots);
        for (let i = 0; i < this.xPlots; i++) {
            this.plots[i] = new Array(this.yPlots);
            for (let j = 0; j < this.yPlots; j++) {
                let plot = new LandPlot_js_1.LandPlot(i, j);
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
    addResources(alpha, x, y, growthRate, pollutionGrowthRate) {
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
    addMigrants(migrantVision, deltaVision, metabolism, nibbleSize, minEnergy, maxAge, deltaMaxAge, population, populationColor) {
        for (let i = 0; i < population; i++) {
            let migrant = new Migrant_js_1.Migrant(new Migrant_js_1.Chromosome(Math.round((migrantVision - deltaVision) + (2 * deltaVision * Math.random())), metabolism, nibbleSize, minEnergy));
            migrant.color = populationColor;
            this.population.push(migrant);
            // put on free plot
            let plot;
            let x = 0, y = 0;
            do {
                x = Math.floor(Math.random() * this.xPlots);
                y = Math.floor(Math.random() * this.yPlots);
                plot = this.plots[x][y];
            } while (plot.isBusy);
            migrant.currentPlot = plot;
            plot.isBusy = true;
        }
    }
}
exports.Land = Land;

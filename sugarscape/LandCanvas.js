"use strict";
const Subject_js_1 = require('rxjs/Subject.js');
const LandPlot_js_1 = require('./LandPlot.js');
const Migrant_js_1 = require('./Migrant.js');
class LandCanvas {
    constructor(containerId, xBlocks, yBlocks) {
        this.containerId = containerId;
        this.xBlocks = xBlocks;
        this.yBlocks = yBlocks;
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.onDraw = new Subject_js_1.Subject();
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
        LandPlot_js_1.PLOT_MEASURES.width = this.width / this.xBlocks;
        LandPlot_js_1.PLOT_MEASURES.height = this.height / this.yBlocks;
        Migrant_js_1.MIGRANT_MEASURES.xCenter = LandPlot_js_1.PLOT_MEASURES.width / 3;
        Migrant_js_1.MIGRANT_MEASURES.yCenter = LandPlot_js_1.PLOT_MEASURES.height / 3;
        if (Migrant_js_1.MIGRANT_MEASURES.xCenter > Migrant_js_1.MIGRANT_MEASURES.yCenter)
            Migrant_js_1.MIGRANT_MEASURES.radius = Migrant_js_1.MIGRANT_MEASURES.yCenter * .8;
        else
            Migrant_js_1.MIGRANT_MEASURES.radius = Migrant_js_1.MIGRANT_MEASURES.xCenter * .8;
        Migrant_js_1.MIGRANT_MEASURES.xGapMouth = Migrant_js_1.MIGRANT_MEASURES.radius * .4;
        Migrant_js_1.MIGRANT_MEASURES.eyeRaduis = Migrant_js_1.MIGRANT_MEASURES.radius / 3;
        Migrant_js_1.MIGRANT_MEASURES.xEyeCenter = Migrant_js_1.MIGRANT_MEASURES.xCenter;
        Migrant_js_1.MIGRANT_MEASURES.yEyeCenter = Migrant_js_1.MIGRANT_MEASURES.yCenter - (Migrant_js_1.MIGRANT_MEASURES.radius * .7);
    }
    draw() {
        let ctx = this.canvas.getContext('2d');
        this.onDraw.next(ctx);
    }
}
exports.LandCanvas = LandCanvas;

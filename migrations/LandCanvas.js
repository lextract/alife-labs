"use strict";
class PlotMeasures {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.paddingTop = 0;
        this.paddingLeft = 0;
        this.maxLevelResources = 0;
    }
}
class MigrantMeasures {
    constructor() {
        this.xCenter = 0;
        this.yCenter = 0;
        this.radius = 0;
        this.xEyeCenter = 0;
        this.yEyeCenter = 0;
        this.eyeRaduis = 0;
        this.startAngle = Math.PI / 12;
        this.endAngle = -Math.PI / 6;
        this.xGapMouth = 0;
    }
}
class LandCanvas {
    constructor(containerId, xBlocks, yBlocks) {
        this.containerId = containerId;
        this.xBlocks = xBlocks;
        this.yBlocks = yBlocks;
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.drawFunctions = new Array();
        this.plotMeasures = new PlotMeasures();
        this.migrantMeasures = new MigrantMeasures();
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
        this.plotMeasures.width = this.width / this.xBlocks;
        this.plotMeasures.height = this.height / this.yBlocks;
        this.migrantMeasures.xCenter = this.plotMeasures.width / 3;
        this.migrantMeasures.yCenter = this.plotMeasures.height / 3;
        if (this.migrantMeasures.xCenter > this.migrantMeasures.yCenter)
            this.migrantMeasures.radius = this.migrantMeasures.yCenter * .8;
        else
            this.migrantMeasures.radius = this.migrantMeasures.xCenter * .8;
        this.migrantMeasures.xGapMouth = this.migrantMeasures.radius * .4;
        this.migrantMeasures.eyeRaduis = this.migrantMeasures.radius / 3;
        this.migrantMeasures.xEyeCenter = this.migrantMeasures.xCenter;
        this.migrantMeasures.yEyeCenter = this.migrantMeasures.yCenter - (this.migrantMeasures.radius * .7);
    }
    draw() {
        let ctx = this.canvas.getContext('2d');
        this.drawFunctions.forEach(item => item(ctx));
    }
}
exports.LandCanvas = LandCanvas;

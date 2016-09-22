"use strict";
exports.PLOT_COLORS = [
    "#FFE6AD",
    "#57f857",
    "#23ee23",
    "#00e200",
    "#00a400",
    "#005700"
];
class LandPlot {
    constructor(x, y, land) {
        this.x = x;
        this.y = y;
        this.land = land;
        this.isBusy = false;
        this.levelResources = 0;
        this.indexColor = 0;
    }
    draw(ctx) {
        this.updateState();
        ctx.fillStyle = exports.PLOT_COLORS[this.indexColor];
        let x = this.x * this.land.plotMeasures.width, y = this.y * this.land.plotMeasures.height, w = this.land.plotMeasures.width, h = this.land.plotMeasures.height;
        ctx.fillRect(x, y, w, h);
    }
    updateState() {
        let idx = (exports.PLOT_COLORS.length - 1) * this.levelResources / this.land.plotMeasures.maxLevelResources;
        this.indexColor = Math.round(idx);
    }
}
exports.LandPlot = LandPlot;

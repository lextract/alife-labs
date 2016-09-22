class PlotMeasures {
    width = 0;
    height = 0;
    paddingTop = 0;
    paddingLeft = 0;
    maxLevelResources = 0;
}
class MigrantMeasures {
    xCenter = 0;
    yCenter = 0;
    radius = 0;
    xEyeCenter = 0;
    yEyeCenter = 0;
    eyeRaduis = 0;
    startAngle = Math.PI / 12;
    endAngle = -Math.PI / 6;
    xGapMouth = 0;
}

export class LandCanvas {
    plotMeasures: PlotMeasures;
    migrantMeasures: MigrantMeasures;
    drawFunctions: Array<(CanvasRenderingContext2D) => void>;

    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private container: HTMLDivElement;

    constructor(
        private containerId: string,
        private xBlocks: number,
        private yBlocks: number
    ) {
        this.container = <HTMLDivElement>document.getElementById(containerId);
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
    private resetMeasures() {
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
        else this.migrantMeasures.radius = this.migrantMeasures.xCenter * .8;
        this.migrantMeasures.xGapMouth = this.migrantMeasures.radius * .4;
        this.migrantMeasures.eyeRaduis = this.migrantMeasures.radius/3;
        this.migrantMeasures.xEyeCenter = this.migrantMeasures.xCenter;
        this.migrantMeasures.yEyeCenter = this.migrantMeasures.yCenter - (this.migrantMeasures.radius * .7); 
    }
    draw() {
        let ctx = this.canvas.getContext('2d');
        this.drawFunctions.forEach(item => item(ctx));
    }
}

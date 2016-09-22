import {LandCanvas} from './LandCanvas';
export const MIGRANT_COLORS = ["#000", "#fff"];
export class Migrant {
    visionRange = 4;
    constructor(
        public x: number,
        public y: number,
        private land: LandCanvas

    ) {
        this.visionRange += Math.round(Math.random() * 12);
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = MIGRANT_COLORS[0];
        let x = this.x * this.land.plotMeasures.width;
        let y = this.y * this.land.plotMeasures.height;
        ctx.beginPath();
        ctx.arc(
            x + this.land.migrantMeasures.xCenter,
            y + this.land.migrantMeasures.yCenter,
            this.land.migrantMeasures.radius,
            this.land.migrantMeasures.startAngle,
            this.land.migrantMeasures.endAngle
        );
        ctx.lineTo(
            x + this.land.migrantMeasures.xCenter - this.land.migrantMeasures.xGapMouth,
            y + this.land.migrantMeasures.yCenter
        );
        ctx.fill();
        ctx.fillStyle = MIGRANT_COLORS[1];
        ctx.beginPath();
        ctx.arc(
            x + this.land.migrantMeasures.xEyeCenter,
            y + this.land.migrantMeasures.yEyeCenter,
            this.land.migrantMeasures.eyeRaduis,
            0,
            -Math.PI,
            false
        )
        ctx.fill();
    }
}
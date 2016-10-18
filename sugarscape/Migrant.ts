import { LandPlot, PLOT_MEASURES } from './LandPlot.js';
import { Land, Direction } from './Land.js';

export const MIGRANT_MEASURES = {
    xCenter : 0,
    yCenter : 0,
    radius : 0,
    xEyeCenter : 0,
    yEyeCenter : 0,
    eyeRaduis : 0,
    startAngle : Math.PI / 12,
    endAngle : -Math.PI / 6,
    xGapMouth : 0,
}

export class Chromosome {
    constructor(
        public visionRange = 10,
        public metabolism = 1,
        public nibbleSize = 5,
        public minEnergy = 1,
        public maxEnergy = 100,
        public maxAge = 100,
    ) { }
}

export enum TypeAction {
    NONE,
    MOVE,
    EAT,
    DIE
}
export enum TypePerception {
    MOVEMENT,
    NEW_PLOT,
    CRASHED
}
export class MigrantAction {
    constructor(
        public typeAction: TypeAction,
        public direction?: Direction
    ) { }
    //direction: Direction;
}
export class MigrantPerception {
    constructor(
        public typePerception: TypePerception
    ) { }
    //newPlot: LandPlot;
    land: Land;
    perimeterPlots: LandPlot[];
}

export class Migrant {
    energy = 0;
    currentPlot: LandPlot;
    color: string;
    constructor(
        private chromosome: Chromosome
    ) {
        this.energy = (chromosome.maxEnergy + chromosome.minEnergy) / 2;
    }

    perceive(perception: MigrantPerception): MigrantAction {
        if (perception.typePerception == TypePerception.NEW_PLOT) {
            if (this.currentPlot.levelResources > 0) {
                return new MigrantAction(TypeAction.EAT);
            }
            else {
                let dir = this.findResources(perception.land);
                if (!dir) dir = this.getRandomDirection(perception.land)
                if (dir) return new MigrantAction(TypeAction.MOVE, dir);
                else return new MigrantAction(TypeAction.NONE);
            }
        }
        else if (perception.typePerception == TypePerception.CRASHED) {
            let dir = this.findResources(perception.land);
            if (!dir) dir = this.getRandomDirection(perception.land)
            if (dir) return new MigrantAction(TypeAction.MOVE, dir);
            else return new MigrantAction(TypeAction.NONE);
        }
    }
    findResources(land: Land): Direction {
        let direction: Direction;
        let startDirection = Math.round(Math.random() * 3);
        for (let i = 1; i <= this.chromosome.visionRange; i++) {
            for (let j = 0; j < 4; j++) {
                direction = (startDirection + j) % 4;
                let plot = this.getPlot(land, direction, i);
                if (plot.levelResources > i * this.chromosome.metabolism
                    && !this.getPlot(land, direction, 1).isBusy
                ) {
                    break;
                }
                else direction = undefined;
            }
            if (direction) break;
        }
        return direction;
    }
    getRandomDirection(land: Land) {
        let direction: Direction;
        let startDirection = Math.round(Math.random() * 3);
        for (let j = 0; j < 4; j++) {
            direction = (startDirection + j) % 4;
            let plot = this.getPlot(land, direction, 1);
            if (plot.isBusy) direction = undefined;
            else break;
        }
        return direction;
    }
    private getPlot(land: Land, dir: Direction, distance: number): LandPlot {
        let result: LandPlot;
        if (dir == Direction.UP) {
            result = land.getPlot(this.currentPlot.x, this.currentPlot.y - distance);
        }
        else if (dir == Direction.DOWN) {
            result = land.getPlot(this.currentPlot.x, this.currentPlot.y + distance);
        }
        else if (dir == Direction.LEFT) {
            result = land.getPlot(this.currentPlot.x - distance, this.currentPlot.y);
        }
        else if (dir == Direction.RIGHT) {
            result = land.getPlot(this.currentPlot.x + distance, this.currentPlot.y);
        }
        return result;
    }
    consumeEnergy() {
        this.energy -= this.chromosome.metabolism;
    }
    get nibbleSize(){
        return this.chromosome.nibbleSize;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        let x = this.currentPlot.x * PLOT_MEASURES.width;
        let y = this.currentPlot.y * PLOT_MEASURES.height;
        ctx.beginPath();
        ctx.arc(
            x + MIGRANT_MEASURES.xCenter,
            y + MIGRANT_MEASURES.yCenter,
            MIGRANT_MEASURES.radius,
            MIGRANT_MEASURES.startAngle,
            MIGRANT_MEASURES.endAngle
        );
        ctx.lineTo(
            x + MIGRANT_MEASURES.xCenter - MIGRANT_MEASURES.xGapMouth,
            y + MIGRANT_MEASURES.yCenter
        );
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(
            x + MIGRANT_MEASURES.xEyeCenter,
            y + MIGRANT_MEASURES.yEyeCenter,
            MIGRANT_MEASURES.eyeRaduis,
            0,
            -Math.PI,
            false
        )
        ctx.fill();
    }
}
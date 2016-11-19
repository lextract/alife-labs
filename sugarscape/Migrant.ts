import { LandPlot, PLOT_MEASURES } from './LandPlot.js';
import { Land, Direction } from './Land.js';

export const MIGRANT_MEASURES = {
    xCenter: 0,
    yCenter: 0,
    radius: 0,
    xEyeCenter: 0,
    yEyeCenter: 0,
    eyeRaduis: 0,
    startAngle: Math.PI / 12,
    endAngle: -Math.PI / 6,
    xGapMouth: 0,
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
export enum MigrantCycle {
    DIE,
    LIVE,
    BREED
}
export class MigrantAction {
    targetPlot: LandPlot;
    constructor(
        public typeAction: TypeAction
    ) { }
    //direction: Direction;
}
export class MigrantPerception {
    constructor(
        public typePerception: TypePerception
    ) { }
    newPlot: LandPlot;
    land: Land;
    perimeterPlots: LandPlot[];
}

export class Migrant {
    energy = 0;
    currentPlot: LandPlot;
    color: string;
    constructor(
        private chromosome: Chromosome,
        private land: Land
    ) {
        this.energy = (chromosome.maxEnergy + chromosome.minEnergy) / 2;
    }

    perceive(perception: MigrantPerception): MigrantAction {
        // if (perception.typePerception == TypePerception.NEW_PLOT) {

        // }
        // else if (perception.typePerception == TypePerception.CRASHED)
        if (this.currentPlot.levelResources >= this.chromosome.metabolism) {
            return new MigrantAction(TypeAction.EAT);
        }
        else {
            let nextPlot = this.findResources(this.land);
            if (!nextPlot) nextPlot = this.getRandomDirection(this.land)
            if (nextPlot) {
                let action = new MigrantAction(TypeAction.MOVE);
                action.targetPlot = nextPlot;
                return action;
            }
            else return new MigrantAction(TypeAction.NONE);
        }
    }
    findResources(land: Land): LandPlot {
        let result: LandPlot;
        let startDirection = Math.round(Math.random() * 3);
        for (let i = 1; i <= this.chromosome.visionRange; i++) {
            for (let j = 0; j < 4; j++) {
                let direction = (startDirection + j) % 4;
                result = this.getPlot(land, direction, 1);
                if (this.getPlot(land, direction, i).levelResources > i * this.chromosome.metabolism
                    && !result.isOccupied
                ) {
                    break;
                }
                else result = undefined;
            }
            if (result) break;
        }
        return result;
    }
    getRandomDirection(land: Land): LandPlot {
        let result: LandPlot;
        let startDirection = Math.round(Math.random() * 3);
        for (let j = 0; j < 4; j++) {
            let direction = (startDirection + j) % 4;
            result = this.getPlot(land, direction, 1);
            if (result.isOccupied) result = undefined;
            else break;
        }
        return result;
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
    landCycle(): MigrantCycle {
        this.energy -= this.chromosome.metabolism;
        if (this.energy < this.chromosome.minEnergy)
            return MigrantCycle.DIE;
        else return MigrantCycle.LIVE;
    }
    get nibbleSize() {
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
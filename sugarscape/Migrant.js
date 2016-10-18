"use strict";
const LandPlot_js_1 = require('./LandPlot.js');
const Land_js_1 = require('./Land.js');
exports.MIGRANT_MEASURES = {
    xCenter: 0,
    yCenter: 0,
    radius: 0,
    xEyeCenter: 0,
    yEyeCenter: 0,
    eyeRaduis: 0,
    startAngle: Math.PI / 12,
    endAngle: -Math.PI / 6,
    xGapMouth: 0,
};
class Chromosome {
    constructor(visionRange = 10, metabolism = 1, nibbleSize = 5, minEnergy = 1, maxEnergy = 100, maxAge = 100) {
        this.visionRange = visionRange;
        this.metabolism = metabolism;
        this.nibbleSize = nibbleSize;
        this.minEnergy = minEnergy;
        this.maxEnergy = maxEnergy;
        this.maxAge = maxAge;
    }
}
exports.Chromosome = Chromosome;
(function (TypeAction) {
    TypeAction[TypeAction["NONE"] = 0] = "NONE";
    TypeAction[TypeAction["MOVE"] = 1] = "MOVE";
    TypeAction[TypeAction["EAT"] = 2] = "EAT";
    TypeAction[TypeAction["DIE"] = 3] = "DIE";
})(exports.TypeAction || (exports.TypeAction = {}));
var TypeAction = exports.TypeAction;
(function (TypePerception) {
    TypePerception[TypePerception["MOVEMENT"] = 0] = "MOVEMENT";
    TypePerception[TypePerception["NEW_PLOT"] = 1] = "NEW_PLOT";
    TypePerception[TypePerception["CRASHED"] = 2] = "CRASHED";
})(exports.TypePerception || (exports.TypePerception = {}));
var TypePerception = exports.TypePerception;
class MigrantAction {
    constructor(typeAction, direction) {
        this.typeAction = typeAction;
        this.direction = direction;
    }
}
exports.MigrantAction = MigrantAction;
class MigrantPerception {
    constructor(typePerception) {
        this.typePerception = typePerception;
    }
}
exports.MigrantPerception = MigrantPerception;
class Migrant {
    constructor(chromosome) {
        this.chromosome = chromosome;
        this.energy = 0;
        this.energy = (chromosome.maxEnergy + chromosome.minEnergy) / 2;
    }
    perceive(perception) {
        if (perception.typePerception == TypePerception.NEW_PLOT) {
            if (this.currentPlot.levelResources > 0) {
                return new MigrantAction(TypeAction.EAT);
            }
            else {
                let dir = this.findResources(perception.land);
                if (!dir)
                    dir = this.getRandomDirection(perception.land);
                if (dir)
                    return new MigrantAction(TypeAction.MOVE, dir);
                else
                    return new MigrantAction(TypeAction.NONE);
            }
        }
        else if (perception.typePerception == TypePerception.CRASHED) {
            let dir = this.findResources(perception.land);
            if (!dir)
                dir = this.getRandomDirection(perception.land);
            if (dir)
                return new MigrantAction(TypeAction.MOVE, dir);
            else
                return new MigrantAction(TypeAction.NONE);
        }
    }
    findResources(land) {
        let direction;
        let startDirection = Math.round(Math.random() * 3);
        for (let i = 1; i <= this.chromosome.visionRange; i++) {
            for (let j = 0; j < 4; j++) {
                direction = (startDirection + j) % 4;
                let plot = this.getPlot(land, direction, i);
                if (plot.levelResources > i * this.chromosome.metabolism
                    && !this.getPlot(land, direction, 1).isBusy) {
                    break;
                }
                else
                    direction = undefined;
            }
            if (direction)
                break;
        }
        return direction;
    }
    getRandomDirection(land) {
        let direction;
        let startDirection = Math.round(Math.random() * 3);
        for (let j = 0; j < 4; j++) {
            direction = (startDirection + j) % 4;
            let plot = this.getPlot(land, direction, 1);
            if (plot.isBusy)
                direction = undefined;
            else
                break;
        }
        return direction;
    }
    getPlot(land, dir, distance) {
        let result;
        if (dir == Land_js_1.Direction.UP) {
            result = land.getPlot(this.currentPlot.x, this.currentPlot.y - distance);
        }
        else if (dir == Land_js_1.Direction.DOWN) {
            result = land.getPlot(this.currentPlot.x, this.currentPlot.y + distance);
        }
        else if (dir == Land_js_1.Direction.LEFT) {
            result = land.getPlot(this.currentPlot.x - distance, this.currentPlot.y);
        }
        else if (dir == Land_js_1.Direction.RIGHT) {
            result = land.getPlot(this.currentPlot.x + distance, this.currentPlot.y);
        }
        return result;
    }
    consumeEnergy() {
        this.energy -= this.chromosome.metabolism;
    }
    get nibbleSize() {
        return this.chromosome.nibbleSize;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        let x = this.currentPlot.x * LandPlot_js_1.PLOT_MEASURES.width;
        let y = this.currentPlot.y * LandPlot_js_1.PLOT_MEASURES.height;
        ctx.beginPath();
        ctx.arc(x + exports.MIGRANT_MEASURES.xCenter, y + exports.MIGRANT_MEASURES.yCenter, exports.MIGRANT_MEASURES.radius, exports.MIGRANT_MEASURES.startAngle, exports.MIGRANT_MEASURES.endAngle);
        ctx.lineTo(x + exports.MIGRANT_MEASURES.xCenter - exports.MIGRANT_MEASURES.xGapMouth, y + exports.MIGRANT_MEASURES.yCenter);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x + exports.MIGRANT_MEASURES.xEyeCenter, y + exports.MIGRANT_MEASURES.yEyeCenter, exports.MIGRANT_MEASURES.eyeRaduis, 0, -Math.PI, false);
        ctx.fill();
    }
}
exports.Migrant = Migrant;

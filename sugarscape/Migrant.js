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
(function (MigrantCycle) {
    MigrantCycle[MigrantCycle["DIE"] = 0] = "DIE";
    MigrantCycle[MigrantCycle["LIVE"] = 1] = "LIVE";
    MigrantCycle[MigrantCycle["BREED"] = 2] = "BREED";
})(exports.MigrantCycle || (exports.MigrantCycle = {}));
var MigrantCycle = exports.MigrantCycle;
class MigrantAction {
    constructor(typeAction) {
        this.typeAction = typeAction;
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
    constructor(chromosome, land) {
        this.chromosome = chromosome;
        this.land = land;
        this.energy = 0;
        this.energy = (chromosome.maxEnergy + chromosome.minEnergy) / 2;
    }
    perceive(perception) {
        // if (perception.typePerception == TypePerception.NEW_PLOT) {
        // }
        // else if (perception.typePerception == TypePerception.CRASHED)
        if (this.currentPlot.levelResources >= this.chromosome.metabolism) {
            return new MigrantAction(TypeAction.EAT);
        }
        else {
            let nextPlot = this.findResources(this.land);
            if (!nextPlot)
                nextPlot = this.getRandomDirection(this.land);
            if (nextPlot) {
                let action = new MigrantAction(TypeAction.MOVE);
                action.targetPlot = nextPlot;
                return action;
            }
            else
                return new MigrantAction(TypeAction.NONE);
        }
    }
    findResources(land) {
        let result;
        let startDirection = Math.round(Math.random() * 3);
        for (let i = 1; i <= this.chromosome.visionRange; i++) {
            for (let j = 0; j < 4; j++) {
                let direction = (startDirection + j) % 4;
                result = this.getPlot(land, direction, 1);
                if (this.getPlot(land, direction, i).levelResources > i * this.chromosome.metabolism
                    && !result.isOccupied) {
                    break;
                }
                else
                    result = undefined;
            }
            if (result)
                break;
        }
        return result;
    }
    getRandomDirection(land) {
        let result;
        let startDirection = Math.round(Math.random() * 3);
        for (let j = 0; j < 4; j++) {
            let direction = (startDirection + j) % 4;
            result = this.getPlot(land, direction, 1);
            if (result.isOccupied)
                result = undefined;
            else
                break;
        }
        return result;
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
    landCycle() {
        this.energy -= this.chromosome.metabolism;
        if (this.energy < this.chromosome.minEnergy)
            return MigrantCycle.DIE;
        else
            return MigrantCycle.LIVE;
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

"use strict";
exports.MIGRANT_COLORS = ["#000", "#fff"];
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
class Migrant {
    constructor(x, y, world) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.visionRange = 4;
        this.levelResources = 0;
        this.eat = false;
        this.visionRange += Math.round(Math.random() * 12);
        this.currentPlot = this.world.getPlot(this.x, this.y);
    }
    perceive() {
        if (this.currentPlot.levelResources > 0) {
            // stay here
            this.eat = true;
            this.targetDirection = undefined;
            this.targetPlot = undefined;
            return;
        }
        else
            this.eat = false;
        if (this.targetPlot) {
            if (this.validDirections().some(dir => dir == this.targetDirection)) {
                return;
            }
            else {
                this.targetDirection = undefined;
                this.targetPlot = undefined;
            }
        }
        let valids = this.validDirections(true);
        if (valids.length == 0) {
            this.targetDirection = undefined;
            this.targetPlot = undefined;
            return;
        }
        let td = valids.some(dir => {
            this.targetPlot = this.findResources(dir);
            if (this.targetPlot) {
                this.targetDirection = dir;
                return true;
            }
        });
        if (!td)
            this.targetDirection = valids[0];
    }
    // advance one step to future, update previous plot
    advance(ctx) {
        if (this.eat) {
            this.currentPlot.levelResources -= 1;
            this.levelResources += 1;
            this.currentPlot.draw(ctx);
            this.draw(ctx);
        }
        if (this.targetDirection) {
            this.currentPlot.isBusy = false;
            this.currentPlot.draw(ctx);
            switch (this.targetDirection) {
                case Direction.Up:
                    this.y--;
                    break;
                case Direction.Down:
                    this.y++;
                    break;
                case Direction.Left:
                    this.x--;
                    break;
                case Direction.Right:
                    this.x++;
                    break;
            }
            this.currentPlot = this.world.getPlot(this.x, this.y);
            this.currentPlot.isBusy = true;
            this.currentPlot.draw(ctx);
            this.draw(ctx);
        }
    }
    moveTo(dir) {
        switch (dir) {
            case Direction.Up:
                this.y--;
                break;
            case Direction.Down:
                this.y++;
                break;
            case Direction.Left:
                this.x--;
                break;
            case Direction.Right:
                this.x++;
                break;
        }
    }
    findResources(dir) {
        let plot;
        if (dir == Direction.Up) {
            let yLimit = this.y - this.visionRange;
            if (yLimit < 0)
                yLimit = 0;
            for (let j = this.y - 1; j >= yLimit; j--) {
                plot = this.world.getPlot(this.x, j);
                if (plot.levelResources > 0)
                    break;
            }
        }
        else if (dir == Direction.Down) {
            let yLimit = this.y + this.visionRange;
            if (yLimit >= this.world.yPlots)
                yLimit = this.world.yPlots - 1;
            for (let j = this.y + 1; j <= yLimit; j++) {
                plot = this.world.getPlot(this.x, j);
                if (plot.levelResources > 0)
                    break;
            }
        }
        else if (dir == Direction.Left) {
            let xLimit = this.x - this.visionRange;
            if (xLimit < 0)
                xLimit = 0;
            for (let i = this.x - 1; i >= xLimit; i--) {
                plot = this.world.getPlot(i, this.y);
                if (plot.levelResources > 0)
                    break;
            }
        }
        else if (dir == Direction.Right) {
            let xLimit = this.x + this.visionRange;
            if (xLimit >= this.world.xPlots)
                xLimit = this.world.xPlots - 1;
            for (let i = this.x + 1; i <= xLimit; i++) {
                plot = this.world.getPlot(i, this.y);
                if (plot.levelResources > 0)
                    break;
            }
        }
        if (plot.levelResources <= 0)
            plot = undefined;
        return plot;
    }
    validDirections(randomly) {
        let up = this.y - 1 >= 0;
        if (up) {
            let upPlot = this.world.getPlot(this.x, this.y - 1);
            up = !upPlot.isBusy && upPlot.levelResources >= this.currentPlot.levelResources;
        }
        let down = this.y + 1 < this.world.yPlots;
        if (down) {
            let downPlot = this.world.getPlot(this.x, this.y + 1);
            down = !downPlot.isBusy && downPlot.levelResources >= this.currentPlot.levelResources;
        }
        let left = this.x - 1 >= 0;
        if (left) {
            let leftPlot = this.world.getPlot(this.x - 1, this.y);
            left = !leftPlot.isBusy && leftPlot.levelResources >= this.currentPlot.levelResources;
        }
        let right = this.x + 1 < this.world.xPlots;
        if (right) {
            let rightPlot = this.world.getPlot(this.x + 1, this.y);
            right = !rightPlot.isBusy && rightPlot.levelResources >= this.currentPlot.levelResources;
        }
        let validDirections = [];
        if (!randomly) {
            if (up)
                validDirections.push(Direction.Up);
            if (right)
                validDirections.push(Direction.Right);
            if (down)
                validDirections.push(Direction.Down);
            if (left)
                validDirections.push(Direction.Left);
            return validDirections;
        }
        // return valid directions randomly ordered
        let processedDirs = new Array(4).fill(false);
        let counterDirections = 0;
        while (counterDirections < 4) {
            let dir = Math.round(Math.random() * 3);
            if (!processedDirs[dir]) {
                processedDirs[dir] = true;
                counterDirections++;
                switch (dir) {
                    case 0:
                        if (up)
                            validDirections.push(Direction.Up);
                        break;
                    case 1:
                        if (right)
                            validDirections.push(Direction.Right);
                        break;
                    case 2:
                        if (down)
                            validDirections.push(Direction.Down);
                        break;
                    case 3:
                        if (left)
                            validDirections.push(Direction.Left);
                        break;
                }
            }
        }
        return validDirections;
    }
    draw(ctx) {
        ctx.fillStyle = exports.MIGRANT_COLORS[0];
        let x = this.x * this.world.land.plotMeasures.width;
        let y = this.y * this.world.land.plotMeasures.height;
        ctx.beginPath();
        ctx.arc(x + this.world.land.migrantMeasures.xCenter, y + this.world.land.migrantMeasures.yCenter, this.world.land.migrantMeasures.radius, this.world.land.migrantMeasures.startAngle, this.world.land.migrantMeasures.endAngle);
        ctx.lineTo(x + this.world.land.migrantMeasures.xCenter - this.world.land.migrantMeasures.xGapMouth, y + this.world.land.migrantMeasures.yCenter);
        ctx.fill();
        ctx.fillStyle = exports.MIGRANT_COLORS[1];
        ctx.beginPath();
        ctx.arc(x + this.world.land.migrantMeasures.xEyeCenter, y + this.world.land.migrantMeasures.yEyeCenter, this.world.land.migrantMeasures.eyeRaduis, 0, -Math.PI, false);
        ctx.fill();
    }
}
exports.Migrant = Migrant;

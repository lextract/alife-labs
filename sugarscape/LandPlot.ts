import {Migrant} from './Migrant.js';

const RESOURCE_COLORS = [];
const PLOT_DEFAULTS = {
    maxLevelResources: 100,
    resourceGrowthRate: 1,
    pollutionGrowthRate: -1,
}

export const PLOT_MEASURES = {
    width: 10,
    height: 10,
    paddingTop: 0,
    paddingLeft: 0,
}

export class LandPlot {
    energy = 0;
    pollution = 0;
    // energyGrowthRate = 0;
    // pollutionGrowthRate = 0;
    isBusy: boolean = false;
    opponents: Migrant[] = [];
    private indexColor: number = 0;
    constructor(
        public x: number,
        public y: number
    ) {
    }
    get levelResources() {
        return this.energy;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = RESOURCE_COLORS[this.indexColor];
        let x = this.x * PLOT_MEASURES.width,
            y = this.y * PLOT_MEASURES.height,
            w = PLOT_MEASURES.width,
            h = PLOT_MEASURES.height;
        ctx.fillRect(x, y, w, h);
    }
    setResources(value: number, growthRate?: number, pollutionGrowthRate?: number) {
        this.energy = Math.round(value);
        let idx = (RESOURCE_COLORS.length - 1) * this.energy / PLOT_DEFAULTS.maxLevelResources;
        this.indexColor = Math.round(idx);
        // if (growthRate) this.energyGrowthRate = growthRate;
        // if (pollutionGrowthRate) this.pollutionGrowthRate = pollutionGrowthRate;
    }
    addOpponent(migrant: Migrant){
        this.opponents.push(migrant);
    }
    transferEnergy(migrant: Migrant){
        this.energy -= migrant.nibbleSize;
        migrant.energy += migrant.nibbleSize;
    }
    nextState(){
        this.energy += PLOT_DEFAULTS.resourceGrowthRate;
        if (this.energy > PLOT_DEFAULTS.maxLevelResources)
            this.energy = PLOT_DEFAULTS.maxLevelResources;
        if (this.pollution > 0)
            this.pollution += PLOT_DEFAULTS.pollutionGrowthRate;
        if (this.opponents.length>0){
            let idx = Math.floor(this.opponents.length*Math.random());
            
        }
    }
    static setPlotDefaults(
        maxLevelResources: number = 100,
        resourceGrowthRate: number = 1,
        pollutionGrowthRate: number = -1
    ) {
        PLOT_DEFAULTS.maxLevelResources = maxLevelResources;
        PLOT_DEFAULTS.resourceGrowthRate = resourceGrowthRate;
        PLOT_DEFAULTS.pollutionGrowthRate = pollutionGrowthRate;
    }
}

function generateResourceColors() {
    let r = 0;
    let g = 80;
    while (g < 256) {
        RESOURCE_COLORS.push('rgb(0,' + g + ',0)');
        g += 3;
    }
    g = 255;
    while (r < 230) {
        RESOURCE_COLORS.push('rgb(' + r + ',' + g + ',0)');
        r += 3;
        g -= 1;
    }
    RESOURCE_COLORS.reverse();
}
generateResourceColors();

// export function setPlotDefaults(
//     maxLevelResources: number = 100,
//     resourceGrowthRate: number = 0.01,
//     pollutionGrowthRate: number = -0.01
// ) {
//     PLOT_DEFAULTS.maxLevelResources = maxLevelResources;
//     PLOT_DEFAULTS.resourceGrowthRate = resourceGrowthRate;
//     PLOT_DEFAULTS.pollutionGrowthRate = pollutionGrowthRate;
// }
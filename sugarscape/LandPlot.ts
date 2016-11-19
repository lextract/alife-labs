import { Migrant, MigrantPerception, TypePerception, TypeAction } from './Migrant.js';

const RESOURCE_COLORS = [];
const PLOT_DEFAULTS = {
    maxLevelResources: 100,
    resourceGrowthRate: 0,
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
    energyGrowthRate = 0;
    pollutionGrowthRate = 0;
    //isBusy: boolean = false;
    dweller: Migrant;
    opponents: Migrant[] = [];
    private indexColor: number = 0;
    constructor(
        public x: number,
        public y: number
    ) {
        this.energyGrowthRate = PLOT_DEFAULTS.resourceGrowthRate;
        this.pollutionGrowthRate = PLOT_DEFAULTS.pollutionGrowthRate;
    }
    get levelResources() {
        return this.energy;
    }
    get isOccupied(): boolean {
        return this.dweller !== undefined;
    }
    occupy(dweller: Migrant): boolean {
        if (this.dweller) {
            //throw `The plot (${this.x},${this.y}) is already occupied!`;
            console.error(`The plot (${this.x},${this.y}) is already occupied!`);
            return false;
        }
        this.dweller = dweller;
        this.dweller.currentPlot = this;
        return true;
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
        this.updateColorState();
        if (typeof growthRate == 'number') this.energyGrowthRate = growthRate;
        if (typeof pollutionGrowthRate == 'number') this.pollutionGrowthRate = pollutionGrowthRate;
    }
    updateColorState() {
        let idx = (RESOURCE_COLORS.length - 1) * this.energy / PLOT_DEFAULTS.maxLevelResources;
        this.indexColor = Math.round(idx);
    }
    addOpponent(migrant: Migrant) {
        this.opponents.push(migrant);
    }
    transferEnergy(migrant: Migrant) {
        let quantity = 0;
        if (migrant.nibbleSize > this.energy) quantity = this.energy;
        else quantity = migrant.nibbleSize;
        this.energy -= quantity;
        migrant.energy += quantity;
    }
    landCycle() {
        this.energy += this.energyGrowthRate;
        if (this.energy > PLOT_DEFAULTS.maxLevelResources)
            this.energy = PLOT_DEFAULTS.maxLevelResources;
        if (this.pollution > 0)
            this.pollution += this.pollutionGrowthRate;
        
        if (this.isOccupied) {
            let perception = new MigrantPerception(TypePerception.NEW_PLOT);
            perception.newPlot = this;
            let action = this.dweller.perceive(perception);
            if (action.typeAction == TypeAction.EAT) {
                this.transferEnergy(this.dweller);
            }
            if (action.typeAction == TypeAction.MOVE) {
                action.targetPlot.addOpponent(this.dweller);
            }
        }
        this.updateColorState();
    }
    strugglePlot() {
        if (this.opponents.length > 0) {
            let idx = 0;
            if (this.opponents.length != 1)
                idx = Math.floor(this.opponents.length * Math.random());
            let migrant = this.opponents[idx];
            migrant.currentPlot.empty();
            this.occupy(migrant);
            this.opponents.splice(0);
        }
    }
    empty() {
        this.dweller = undefined;
    }
    static setPlotDefaults(
        maxLevelResources: number = 100,
        resourceGrowthRate: number = 1,
        pollutionGrowthRate: number = -1
    ) {
        console.log('RESET DEFAULT PLOT_MEASURES');
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
        g += 10;
    }
    g = 255;
    while (r < 230) {
        RESOURCE_COLORS.push('rgb(' + r + ',' + g + ',0)');
        r += 10;
        g -= 3;
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
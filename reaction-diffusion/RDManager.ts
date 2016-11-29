import { ReacDiff2D } from './ReacDiff2D';

let container: HTMLDivElement;
let lattice: ReacDiff2D;
let simulating = false;
let simulationDelay = 20;

export class RDManager {
    static get lattice() {
        return lattice;
    }
    static createCanvas(containerId: string, sideSize: number) {
        container = <HTMLDivElement>document.getElementById(containerId);
        lattice = new ReacDiff2D(sideSize);
        container.appendChild(lattice.canvas);
    }
    static reset() {
        lattice.resetStates();
        lattice.redraw();
    }
    static simulate() {
        simulating = true;
        function* oneStepFn() {
            while (simulating) {
                lattice.simulateRD(1);
                setTimeout(() => {
                    oneStepGenerator.next();
                }, simulationDelay);
                yield;
            }
        }
        let oneStepGenerator = oneStepFn();
        oneStepGenerator.next();
    }
    static stopSimulation() {
        simulating = false;
    }
    static set simulationDelay(value) {
        simulationDelay = value;
    }
}
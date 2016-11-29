"use strict";
const ReacDiff2D_1 = require('./ReacDiff2D');
let container;
let lattice;
let simulating = false;
let simulationDelay = 20;
class RDManager {
    static get lattice() {
        return lattice;
    }
    static createCanvas(containerId, sideSize) {
        container = document.getElementById(containerId);
        lattice = new ReacDiff2D_1.ReacDiff2D(sideSize);
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
exports.RDManager = RDManager;

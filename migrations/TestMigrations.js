"use strict";
const LandMigrations_1 = require('./LandMigrations');
let land;
function testMigrations() {
    land = new LandMigrations_1.LandMigrations("boardContainer", 30, 15, 40);
    land.addAlphaResources(50, 6, 10);
    land.addAlphaResources(50, 24, 7);
    land.initialize();
    document.getElementById("simulateButton").onclick = simulateClick;
}
function simulateClick() {
    let i = parseInt(document.getElementById("iterationsNum").value);
    land.simulate(i);
}
testMigrations();

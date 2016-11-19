"use strict";
const Terrain_1 = require('./Terrain');
let land;
function testSandpile() {
    land = new Terrain_1.Terrain("boardContainer", 50);
    document.getElementById("simulateButton").onclick = simulateClick;
}
function simulateClick() {
    let i = parseInt(document.getElementById("grainsNum").value);
    land.putGrains(i);
}
testSandpile();

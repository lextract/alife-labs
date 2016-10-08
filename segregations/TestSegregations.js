"use strict";
const World_1 = require('./World');
let world;
function testSandpile() {
    world = new World_1.World("boardContainer", 50, 50);
    document.getElementById("simulateButton").onclick = simulateClick;
}
function simulateClick() {
    let i = parseInt(document.getElementById("iterations").value);
    world.simulate(i);
}
testSandpile();

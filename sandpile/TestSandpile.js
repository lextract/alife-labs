"use strict";
const Terrain_1 = require('./Terrain');
function testSandpile() {
    let land = new Terrain_1.Terrain("boardContainer", 50);
    land.putGrains(2000);
}
testSandpile();

import {LandMigrations} from './LandMigrations';

let land:LandMigrations;
function testMigrations(){
    land = new LandMigrations("boardContainer",30,15,40);
    land.addAlphaResources(50, 6, 10);
    land.addAlphaResources(50, 24, 7);
    land.initialize();
    document.getElementById("simulateButton").onclick = simulateClick;
}

function simulateClick(){
    let i = parseInt((<HTMLInputElement>document.getElementById("iterationsNum")).value);
    land.simulate(i);
}

testMigrations();
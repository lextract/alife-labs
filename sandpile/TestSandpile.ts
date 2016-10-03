import {Terrain} from './Terrain';

let land;
function testSandpile(){
    land = new Terrain("boardContainer",50);
    document.getElementById("simulateButton").onclick = simulateClick;
}

function simulateClick(){
    let i = parseInt((<HTMLInputElement>document.getElementById("grainsNum")).value);
    land.putGrains(i);
}

testSandpile();
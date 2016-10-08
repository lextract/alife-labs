import {World} from './World';

let world: World;
function testSandpile(){
    world = new World("boardContainer",50,50);
    document.getElementById("simulateButton").onclick = simulateClick;
}

function simulateClick(){
    let i = parseInt((<HTMLInputElement>document.getElementById("iterations")).value);
    world.simulate(i);
}

testSandpile();
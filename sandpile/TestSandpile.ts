import {Terrain} from './Terrain';

function testSandpile(){
    let land = new Terrain("boardContainer",50);
    land.putGrains(2000);
}

testSandpile();
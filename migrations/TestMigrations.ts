import {LandMigrations} from './LandMigrations';

function testMigrations(){
    let land = new LandMigrations("boardContainer",30,15,40);
    land.addAlphaResources(50, 6, 10);
    land.addAlphaResources(50, 24, 7);
    land.initialize();
}

testMigrations();
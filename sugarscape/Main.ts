import { initGuiController } from './GuiController.js';
import { Land } from './Land.js'
import * as angular from 'angular';

function main() {
    let appModule = angular.module('app', []);
    let land = new Land("canvasContainer", 10, 10);
    initGuiController(appModule, land);
    angular.bootstrap(document, ['app']);
    land.redraw();
}
setTimeout(() => { main() }, 0);
//probando comnentario


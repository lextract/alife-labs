import { initGuiController } from './GuiController';
import { RDManager } from './RDManager';
import * as angular from 'angular';

function main() {
    let appModule = angular.module('app', []);
    RDManager.createCanvas("canvasContainer",128);
    initGuiController(appModule);
    angular.bootstrap(document, ['app']);
}
setTimeout(() => { main() }, 0);


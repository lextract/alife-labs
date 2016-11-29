"use strict";
const GuiController_1 = require('./GuiController');
const RDManager_1 = require('./RDManager');
const angular = require('angular');
function main() {
    let appModule = angular.module('app', []);
    RDManager_1.RDManager.createCanvas("canvasContainer", 128);
    GuiController_1.initGuiController(appModule);
    angular.bootstrap(document, ['app']);
}
setTimeout(() => { main(); }, 0);

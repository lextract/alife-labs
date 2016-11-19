"use strict";
const GuiController_js_1 = require('./GuiController.js');
const Land_js_1 = require('./Land.js');
const angular = require('angular');
function main() {
    let appModule = angular.module('app', []);
    let land = new Land_js_1.Land("canvasContainer", 10, 10);
    GuiController_js_1.initGuiController(appModule, land);
    angular.bootstrap(document, ['app']);
    land.redraw();
}
setTimeout(() => { main(); }, 0);
//probando comnentario

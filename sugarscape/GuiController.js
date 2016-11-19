"use strict";
const LandPlot_js_1 = require('./LandPlot.js');
function initGuiController(appModule, land) {
    appModule.controller('GuiController', ($scope) => {
        $scope.xSize = 40;
        $scope.ySize = 40;
        $scope.simDelay = 100;
        $scope.showedControls = true;
        $scope.canvasClass = "width7";
        $scope.simulating = false;
        $scope.alphaResoruce = 80;
        $scope.xPosResource = 6;
        $scope.yPosResource = 6;
        $scope.resourceGR = 2;
        $scope.pollutionGR = -1;
        $scope.maxLevelResource = 100;
        $scope.migrantVision = 10;
        $scope.deltaVision = 6;
        $scope.metabolism = 4;
        $scope.nibbleSize = 6;
        $scope.minEnergy = 5;
        $scope.maxEnergy = 100;
        $scope.maxAge = 100;
        $scope.deltaMaxAge = 10;
        $scope.population = 10;
        $scope.populationColor = "#000";
        land.resetPlots($scope.xSize, $scope.ySize);
        LandPlot_js_1.LandPlot.setPlotDefaults(100, 0, -1);
        $scope.showControls = function (show) {
            $scope.showedControls = show;
            if (show)
                $scope.canvasClass = "width7";
            else
                $scope.canvasClass = "allWidth";
            setTimeout(() => { land.redraw(); }, 0);
        };
        $scope.resetLand = function () {
            land.cleanMigrants();
            land.resetPlots($scope.xSize, $scope.ySize);
            land.redraw();
        };
        $scope.stopSimulate = function () {
            land.stopSimulation();
            $scope.simulating = false;
        };
        $scope.simulate = function () {
            land.simulate();
            $scope.simulating = true;
        };
        $scope.putResources = () => {
            land.addResources($scope.alphaResoruce, $scope.xPosResource, $scope.yPosResource, $scope.resourceGR, $scope.pollutionGR);
            land.redraw();
        };
        $scope.resourceDefaults = () => {
            LandPlot_js_1.LandPlot.setPlotDefaults($scope.maxLevelResource, $scope.resourceGR, $scope.pollutionGR);
        };
        $scope.generateMigrants = () => {
            land.addMigrants($scope.migrantVision, $scope.deltaVision, $scope.metabolism, $scope.nibbleSize, $scope.minEnergy, $scope.maxEnergy, $scope.maxAge, $scope.deltaMaxAge, $scope.population, $scope.populationColor);
            land.redraw();
        };
        $scope.updateDelay = () => {
            land.simulationDelay = $scope.simDelay;
        };
        $scope.simulateStep = () => {
            land.simulateOneStep();
        };
        $scope.cleanMigrants = () => {
            land.cleanMigrants();
            land.redraw();
        };
    });
}
exports.initGuiController = initGuiController;

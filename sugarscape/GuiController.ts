
import * as angular from 'angular';
import { Land } from './Land.js';

export function initGuiController(
    appModule: angular.IModule,
    land: Land
) {
    appModule.controller('GuiController', ($scope) => {
        $scope.xSize = 20;
        $scope.ySize = 20;
        $scope.showedControls = true;
        $scope.canvasClass = "width7";
        $scope.simulating = false;
        $scope.alphaResoruce = 50;
        $scope.xPosResource = 10;
        $scope.yPosResource = 10;
        $scope.resourceGR = 1;
        $scope.pollutionGR = -1;
        $scope.maxLevelResource = 100;
        $scope.migrantVision = 10;
        $scope.deltaVision = 6;
        $scope.metabolism = 4;
        $scope.nibbleSize = 10;
        $scope.minEnergy = 1;
        $scope.maxAge = 100;
        $scope.deltaMaxAge = 10;
        $scope.population = 10;
        $scope.populationColor = "#000";

        land.resetPlots($scope.xSize, $scope.ySize);

        $scope.showControls = function (show: boolean) {
            $scope.showedControls = show;
            if (show) $scope.canvasClass = "width7";
            else $scope.canvasClass = "allWidth";
            setTimeout(() => { land.redraw() }, 0);
        }

        $scope.resetLand = function () {
            land.resetPlots($scope.xSize, $scope.ySize);
            land.redraw();
        }
        $scope.stopSimulate = function () {
            land.stopSimulation();
            $scope.simulating = false;
        }
        $scope.simulate = function () {
            land.simulate();
            $scope.simulating = true;
        }
        $scope.putResources = () => {
            land.addResources($scope.alphaResoruce, $scope.xPosResource, $scope.yPosResource);
            land.redraw();
        }
        $scope.resourceDefaults = () => {
        }
        $scope.generateMigrants = () => {
            land.addMigrants(
                $scope.migrantVision,
                $scope.deltaVision,
                $scope.metabolism,
                $scope.nibbleSize,
                $scope.minEnergy,
                $scope.maxAge,
                $scope.deltaMaxAge,
                $scope.population,
                $scope.populationColor
            );
            land.redraw();
        }
    })
}



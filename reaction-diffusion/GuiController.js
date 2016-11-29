"use strict";
const RDManager_1 = require('./RDManager');
function initGuiController(appModule) {
    appModule.controller('GuiController', ($scope) => {
        $scope.iterations = 0;
        $scope.simDelay = 0;
        $scope.simulating = false;
        $scope.feedRate = 0.017;
        $scope.killRate = 0.037;
        $scope.difussionRateA = 0.753;
        $scope.difussionRateB = 0.097;
        // let updateIters = () => {
        //     $scope.iterations = RDManager.lattice.iterations;
        //     if ($scope.simulating)
        //         setTimeout(updateIters,2000);
        // }
        $scope.simulate = () => {
            //setTimeout(updateIters, 2000);
            RDManager_1.RDManager.simulate();
            $scope.simulating = true;
        };
        $scope.stopSimulate = () => {
            RDManager_1.RDManager.stopSimulation();
            $scope.simulating = false;
            $scope.iterations = RDManager_1.RDManager.lattice.iterations;
        };
        $scope.reset = () => {
            RDManager_1.RDManager.reset();
            $scope.iterations = 0;
            RDManager_1.RDManager.lattice.setRates(+$scope.feedRate, +$scope.killRate, +$scope.difussionRateA, +$scope.difussionRateB);
        };
        $scope.updateDelay = () => {
            RDManager_1.RDManager.simulationDelay = +$scope.simDelay;
        };
        $scope.feedRateUpdate = () => {
            RDManager_1.RDManager.lattice.setRates(+$scope.feedRate, 0, 0, 0);
        };
        $scope.killRateUpdate = () => {
            RDManager_1.RDManager.lattice.setRates(0, +$scope.killRate, 0, 0);
        };
        $scope.difussionRateAUpdate = () => {
            RDManager_1.RDManager.lattice.setRates(0, 0, +$scope.difussionRateA, 0);
        };
        $scope.difussionRateBUpdate = () => {
            RDManager_1.RDManager.lattice.setRates(0, 0, 0, +$scope.difussionRateB);
        };
    });
}
exports.initGuiController = initGuiController;

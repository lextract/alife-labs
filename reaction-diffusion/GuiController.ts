
import * as angular from 'angular';
import { RDManager } from './RDManager';

export function initGuiController(
    appModule: angular.IModule
) {
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
            RDManager.simulate();
            $scope.simulating = true;
        }
        $scope.stopSimulate = () => {
            RDManager.stopSimulation();
            $scope.simulating = false;
            $scope.iterations = RDManager.lattice.iterations;
        }
        $scope.reset = () => {
            RDManager.reset();
            $scope.iterations = 0;
            RDManager.lattice.setRates(+$scope.feedRate, +$scope.killRate, 
            +$scope.difussionRateA, +$scope.difussionRateB)
        }
        $scope.updateDelay = () => {
            RDManager.simulationDelay = +$scope.simDelay;
        }
        $scope.feedRateUpdate = () => {
            RDManager.lattice.setRates(+$scope.feedRate, 0, 0, 0);
        }
        $scope.killRateUpdate = () => {
            RDManager.lattice.setRates(0, +$scope.killRate, 0, 0);
        }
        $scope.difussionRateAUpdate = () => {
            RDManager.lattice.setRates(0, 0, +$scope.difussionRateA, 0);
        }
        $scope.difussionRateBUpdate = () => {
            RDManager.lattice.setRates(0, 0, 0, +$scope.difussionRateB);
        }
    })
}
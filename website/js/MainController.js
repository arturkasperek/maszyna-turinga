(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController',['$scope','matrixService', function($scope, matrixService) {
            var that = this;

            this.availableSymbols = 'asdf';
            this.stateMatrix = [];
            this.symbols = [];
            this.stateNumber = 5;

            function initMachine() {
                matrixService.initMachine(that.stateNumber, that.availableSymbols);
                that.turingMatrixObject = matrixService.getTuringMatrixObject();
            }

            $scope.initMachine = function() {
                try {
                    initMachine();
                } catch(e) {
                    alert(e);
                }
            };
        }]);
})();
(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController',['$scope','matrixService', '$http', function($scope, matrixService, $http) {
            var that = this;

            this.availableSymbols = 'asdf';
            this.stateMatrix = [];
            this.symbols = [];
            this.stateNumber = 5;

            function initMachine() {
                matrixService.initMachine(that.stateNumber, that.availableSymbols);
                that.turingMatrixObject = matrixService.getTuringMatrixObject();
                console.log(that.turingMatrixObject);
            }

            function downloadFile(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }

            $scope.initMachine = function() {
                try {
                    initMachine();
                } catch(e) {
                    alert(e);
                }
            };

            $scope.working = function() {
                console.log("Working");
            };

            $scope.downloadTuringStateMatrix = function() {
                downloadFile('turing-state-matrix.JSON', JSON.stringify(that.turingMatrixObject));
            };

            $scope.$watch('uploadedStateMatrixURL', function(url) {
                if(url) {
                    $http.get(url).then(function(response) {
                        var stateMatrixObject = response.data;
                        that.turingMatrixObject = stateMatrixObject;
                    });
                }
            });
        }]);
})();
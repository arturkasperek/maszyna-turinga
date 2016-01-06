(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController',['$scope','matrixService', '$http', function($scope, matrixService, $http) {
            var that = this;

            $scope.symbolsInput = '#ab';

            this.availableSymbols = $scope.symbolsInput;
            this.stateMatrix = [];
            this.stateNumber = $scope.symbolsInput.length;

            function initMachine() {
                matrixService.initMachine(that.stateNumber, that.availableSymbols);
                that.turingMatrixObject = matrixService.getTuringMatrixObject();
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

            $scope.addNewState = function(stateName) {
                matrixService.addState(stateName);
                that.stateNumber ++;
            };

            $scope.deleteLastAddedState = function() {
                if(that.stateNumber >= 0) {
                    matrixService.deleteLastAddedState();
                    that.stateNumber --;
                }
            };

            $scope.updateStateMatrix = function(symbolsInput) {
                var differences;

                function findAddedEndDeletedSymbols(oldSymbols, newSymbols) {
                    var oldSymbols = oldSymbols.split(""),
                        newSymbols = newSymbols.split(""),
                        symbolChangeObj = {
                            added: [],
                            deleted: []
                        };

                    function arrayToObj(array) {
                        var objToRet = {};

                        array.forEach(function(elem) {
                             objToRet[elem] = true;
                        });

                        return objToRet;
                    }

                    function checkForDifferencesInObjects(firstObj, secondObj, differencesList) {
                        for(var key in firstObj) {
                            if(secondObj[key] == undefined) {
                                differencesList.push(key);
                            }
                        }
                    }

                    oldSymbols = arrayToObj(oldSymbols);
                    newSymbols = arrayToObj(newSymbols);

                    checkForDifferencesInObjects(newSymbols, oldSymbols, symbolChangeObj.added);
                    checkForDifferencesInObjects(oldSymbols, newSymbols, symbolChangeObj.deleted);

                    return symbolChangeObj;
                }

                differences = findAddedEndDeletedSymbols(that.availableSymbols, symbolsInput);

                differences.deleted.forEach(function(deletedSymbol) {
                    matrixService.deleteSymbol(deletedSymbol);
                });

                differences.added.forEach(function(addedSymbol) {
                    matrixService.addSymbol(addedSymbol);
                });

                that.availableSymbols = symbolsInput;
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

            $scope.initMachine();
        }]);
})();
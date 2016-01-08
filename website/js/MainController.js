(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController',['$scope','matrixService', '$http', '$timeout', function($scope, matrixService, $http, $timeout) {
            var that = this;

            $scope.symbolsInput = '#ab';

            this.availableSymbols = $scope.symbolsInput;
            this.stateMatrix = [];
            this.stateNumber = $scope.symbolsInput.length;

            function initMachine() {
                matrixService.initMachine(that.stateNumber, that.availableSymbols);
                $scope.turingMatrixObject = matrixService.getTuringMatrixObject();
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

            $scope.startNewProject = function() {
                $scope.showStateCreator = true;
                $scope.adjustProjectLoadContainer();
            };

            $scope.uploadProject = function() {
                angular.element('.project-upload-input').click();
            };

            $scope.adjustProjectLoadContainer = function() {
                $timeout(function() {
                    var projectLoadContainer = angular.element('.project-source-choice-container'),
                        stateCreator = angular.element('.matrix-creator-container');

                    stateCreator.prepend(projectLoadContainer);
                }, 1);
            };

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

                console.log(differences);

                differences.deleted.forEach(function(deletedSymbol) {
                    matrixService.deleteSymbol(deletedSymbol);
                });

                differences.added.forEach(function(addedSymbol) {
                    matrixService.addSymbol(addedSymbol);
                });

                that.availableSymbols = symbolsInput;
            };

            $scope.downloadTuringStateMatrix = function() {
                downloadFile('turing-state-matrix.JSON', angular.toJson($scope.turingMatrixObject));
            };

            $scope.$watch('uploadedStateMatrixURL', function(url) {
                if(url) {
                    $http.get(url).then(function(response) {
                        var stateMatrixObject = response.data;

                        //TODO create constructor for creating new turing machine object

                        $scope.symbolsInput = stateMatrixObject.symbols.join('');
                        that.availableSymbols = stateMatrixObject.symbols.join('');
                        that.stateNumber = stateMatrixObject.stateMatrix.length;
                        $scope.turingMatrixObject = stateMatrixObject;
                        matrixService.initMachineFromObject(stateMatrixObject.stateMatrix, stateMatrixObject.symbols);
                        $scope.startNewProject();
                    });
                }
            });

            $scope.initMachine();
        }]);
})();
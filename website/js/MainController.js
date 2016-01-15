(function() {
    "use strict";
    angular.module('turingApp', [])
        .controller('MainController',['$scope','matrixService', '$http', '$timeout', function($scope, matrixService, $http, $timeout) {
            var that = this,
                currentProjectCacheSaveSlotIndex = undefined;

            $scope.symbolsInput = '#ab';

            this.availableSymbols = $scope.symbolsInput;
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

            function findFreeSlotIndexInCacheForStateMatrix() {
                var i = 1,
                    stateMatrixFromCache = true;

                while(stateMatrixFromCache != null) {
                    stateMatrixFromCache = localStorage.getItem('state-matrix-' + i.toString());
                    i++;
                }
                i--;

                return i;
            }

            function loadFromCacheSavedMatrixes(stateMatrixes) {
                var i = 1,
                    stateMatrixFromCache = true;

                while(stateMatrixFromCache != null) {
                    stateMatrixFromCache = localStorage.getItem('state-matrix-' + i.toString());
                    if(stateMatrixFromCache != null) {
                        stateMatrixes.push(angular.fromJson(stateMatrixFromCache));
                    }
                    i++;
                }
            }

            function adjustStateMatrix(stateMatrix) {
                //if state matrix didnt have any symbols or state we must hide matrix editor( to dont display only state names or symbols )
                if(stateMatrix.stateMatrix == 0 || stateMatrix.symbols ==0) {
                    $scope.hideMatrix = true;
                } else {
                    $scope.hideMatrix = false;
                }
            }

            function loadProgramFromStateMatrixObject(stateMatrixObject) {
                $scope.symbolsInput = stateMatrixObject.symbols.join('');
                that.availableSymbols = stateMatrixObject.symbols.join('');
                that.stateNumber = stateMatrixObject.stateMatrix.length;
                $scope.turingMatrixObject = stateMatrixObject;
                matrixService.initMachineFromObject(stateMatrixObject.stateMatrix, stateMatrixObject.symbols);
                $scope.startNewProject();
            }

            $scope.startNewProject = function() {
                $scope.showStateCreator = true;
                $scope.adjustProjectLoadContainer();
            };

            $scope.uploadProject = function() {
                angular.element('.project-upload-input').click();
            };

            $scope.showRecent = function() {
                $scope.savedStateMatrixes = [];
                loadFromCacheSavedMatrixes($scope.savedStateMatrixes);
                $scope.showProjectsSavedInCache = true;
                $scope.showStateCreator = false;
                $scope.adjustProjectLoadContainer();
            };

            $scope.startProjectFromCache = function(stateMatrixObject) {
                loadProgramFromStateMatrixObject(stateMatrixObject);
                $scope.showProjectsSavedInCache = false;
            };

            $scope.adjustProjectLoadContainer = function() {
                $timeout(function() {
                    var projectLoadContainer = angular.element('.project-source-choice-container');

                    projectLoadContainer.addClass('mini');
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

                adjustStateMatrix($scope.turingMatrixObject);
            };

            $scope.deleteLastAddedState = function() {
                if(that.stateNumber >= 0) {
                    matrixService.deleteLastAddedState();
                    that.stateNumber --;
                }

                adjustStateMatrix($scope.turingMatrixObject);
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

                adjustStateMatrix($scope.turingMatrixObject);
            };

            $scope.downloadTuringStateMatrix = function() {
                downloadFile('turing-state-matrix.JSON', angular.toJson($scope.turingMatrixObject));
            };

            $scope.saveTuringStateMatrixInCache = function() {
                function addCurrentDateToMatrixObject() {
                    $scope.turingMatrixObject.lastModified = moment().format('MMMM YYYY HH:mm');
                }

                if(!currentProjectCacheSaveSlotIndex) {
                    currentProjectCacheSaveSlotIndex = findFreeSlotIndexInCacheForStateMatrix();
                }

                addCurrentDateToMatrixObject();

                localStorage.setItem("state-matrix-" + currentProjectCacheSaveSlotIndex.toString(), angular.toJson($scope.turingMatrixObject));

            };

            $scope.loadProgramFromStateMatrixObject = loadProgramFromStateMatrixObject;

            /* Init code */

            $scope.$watch('uploadedStateMatrixURL', function(url) {
                if(url) {
                    $http.get(url).then(function(response) {
                        loadProgramFromStateMatrixObject(response.data);
                    });
                }
            });

            $scope.initMachine();
        }]);
})();
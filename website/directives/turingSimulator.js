(function() {
    angular.module('turingApp')
        .directive('turingSimulator', ['$timeout', '$q', '$rootScope', function($timeout, $q, $rootScope) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'turingSimulator.html',
                scope: {
                    stateMatrix: '='
                },
                link: function($scope, $element) {
                    var that = this,
                        $simulatorHead = $element.find('.simulator-head'),
                        $simulatorWrapper = $element.find('.turing-simulator-wrapper'),
                        $tape = $element.find('.tape'),
                        fieldWidth,
                        fieldHeight;

                    function setElementsSize() {
                        var $firstTapeField = angular.element($tape.find('.tape-field')[0]);

                        fieldWidth = $firstTapeField.outerWidth();
                        fieldHeight = $firstTapeField.outerHeight();
                    }

                    function adjustSimulatorHead() {
                        var $upperFrameOfHead = $simulatorHead.find('.upper-frame');

                        $simulatorHead.css('width', fieldWidth);
                        $upperFrameOfHead.css('height', fieldHeight);
                    }

                    $scope.getHeadSimulationDuration = function() {
                        return parseFloat($simulatorHead.css('transition-duration').split('s')[0]);
                    };

                    $scope.setHeadSimulationDuration = function(newDurationInSec) {
                        $simulatorHead.css('transition-duration', newDurationInSec.toString() + 's');
                    };

                    $scope.setTapeAdjustingAnimationDuration = function(newDurationInSec) {
                        $tape.css('transition-duration', newDurationInSec.toString() + 's');
                    };

                    $scope.getTapeAdjustingAnimationDuration = function() {
                        return parseFloat($tape.css('transition-duration').split('s')[0]);
                    };

                    $scope.setFieldOnLeftSide = function(fieldNumber) {
                        var $field = $tape.find('.field-' + fieldNumber),
                            fieldLeftPosition = $field.position().left,
                            visibleAreaWidth = $simulatorWrapper.outerWidth(),
                            fieldWidth = $field.outerWidth(),
                            visibleFieldsCount = parseInt(visibleAreaWidth / fieldWidth),
                            oldTapeLeftOffset = $tape.position().left,
                            oldSimulatorHeadLeftOffset = $simulatorHead.position().left,
                            newTapeLeftOffset = - fieldLeftPosition,
                            translationOffset = newTapeLeftOffset - oldTapeLeftOffset,
                            simulatorHeadTransitionDurationInSec = $scope.getHeadSimulationDuration(),
                            tapeAdjusingAnimationDurationInSec = $scope.getTapeAdjustingAnimationDuration();

                        $scope.setHeadSimulationDuration(tapeAdjusingAnimationDurationInSec);
                        $simulatorHead.css('left', oldSimulatorHeadLeftOffset + translationOffset);
                        $tape.css('left', newTapeLeftOffset);
                        $scope.newTapeLeftOffset = newTapeLeftOffset;
                        $scope.firstVisibleFieldIndex = fieldNumber;
                        $scope.lastVisibleFieldIndex = fieldNumber + visibleFieldsCount;

                        $timeout(function() {
                            $scope.setHeadSimulationDuration(simulatorHeadTransitionDurationInSec);
                        }, tapeAdjusingAnimationDurationInSec * 1000);
                    };

                    $scope.setHeadOnField = function(fieldNumber) {
                        var $field = $tape.find('.field-' + fieldNumber),
                            fieldLeftPosition = $field.position().left,
                            tapeLeftOffset = $scope.newTapeLeftOffset;

                        $simulatorHead.css('left', fieldLeftPosition + tapeLeftOffset);
                    };

                    $timeout(function() {
                        setElementsSize();
                        adjustSimulatorHead();
                    }, 1);
                },
                controller: function($scope) {
                    var that = this,
                        hashNeighborsCount = 35,
                        headStopDurationInSec = 0.2,
                        firstNotHashFieldIndex = hashNeighborsCount,
                        currentHeadPosition = firstNotHashFieldIndex,
                        adjustAmount = 3,
                        simulation = undefined;

                    $scope.isSimulationPlay = false;
                    $scope.breakPointTable = [];

                    $scope.setFieldValue = function(fieldNumber, newValue) {
                        $scope.$evalAsync(function() {
                            $scope.tape[fieldNumber] = newValue;
                        });
                    };

                    $scope.$watch('userInputTable', function(newVal) {
                        function generateHashOnTapeEnd(hashNumber) {
                            for(var i = 0; i < hashNumber; i++) {
                                $scope.tape.push('#');
                            }
                        }
                        $scope.tape = [];
                        generateHashOnTapeEnd(hashNeighborsCount);
                        if(newVal) {
                            for(var i = 0; i < newVal.length; i++) {
                                $scope.tape.push(newVal[i]);
                            }
                        }
                        generateHashOnTapeEnd(hashNeighborsCount);
                    });

                    function adjustTapePosition() {
                        var deferred = $q.defer(),
                            tapeAnimationDuration = $scope.getTapeAdjustingAnimationDuration(),
                            middleOfVisibleFields = parseInt(($scope.lastVisibleFieldIndex - $scope.firstVisibleFieldIndex) / 4);

                        if(currentHeadPosition - $scope.firstVisibleFieldIndex <= adjustAmount) {
                            $scope.setFieldOnLeftSide($scope.firstVisibleFieldIndex - middleOfVisibleFields);

                            $timeout(function() {
                                deferred.resolve(true);
                            }, tapeAnimationDuration * 1000);
                        } else if($scope.lastVisibleFieldIndex - currentHeadPosition <= adjustAmount) {
                            $scope.setFieldOnLeftSide($scope.firstVisibleFieldIndex + middleOfVisibleFields);

                            $timeout(function() {
                                deferred.resolve(true);
                            }, tapeAnimationDuration * 1000);
                        } else {
                            deferred.resolve(false);
                        }

                        return deferred.promise;
                    }

                    $scope.stopSimulation = function() {
                        $scope.isSimulationPlay = false;
                    };

                    $scope.changeBreakPointOnField = function(fieldIndex) {
                        var breakPoint = $scope.breakPointTable[fieldIndex];

                        if(!breakPoint || breakPoint == '') {
                            $scope.breakPointTable[fieldIndex] = 'break-point';
                        } else {
                            $scope.breakPointTable[fieldIndex] = '';
                        }
                    };

                    $scope.startSimulation = function() {
                        function changeCurrentFieldAndGoToNext() {
                            var newSymbol = simulation.currentField.char,
                                direction = simulation.currentField.direction,
                                newState = simulation.currentField.newState - 1,
                                simulatorHeadTransitionDurationInSec = $scope.getHeadSimulationDuration();

                            if(simulation.prevField) {
                                $rootScope.$broadcast('endHighlightField', simulation.prevField);
                            }
                            $rootScope.$broadcast('highlightField', simulation.currentField);

                            if($scope.breakPointTable[currentHeadPosition] == 'break-point') {
                                $scope.stopSimulation();
                                $scope.breakPointTable[currentHeadPosition] = '';

                                return;
                            }

                            $scope.setFieldValue(currentHeadPosition, newSymbol);

                            if(direction == 'R') {
                                currentHeadPosition++;
                            } else if(direction == 'L') {
                                currentHeadPosition--;
                            }

                            $scope.setHeadOnField(currentHeadPosition);

                            simulation.prevField = simulation.currentField;
                            simulation.currentState = $scope.stateMatrix[newState];
                            simulation.currentSymbol = $scope.tape[currentHeadPosition];
                            simulation.currentField = simulation.currentState.fields[simulation.currentSymbol];

                            $timeout(function() {
                                adjustTapePosition().then(function(adjusted) {
                                    if($scope.isSimulationPlay) {
                                        if(adjusted == false) {
                                            $timeout(function() {
                                                changeCurrentFieldAndGoToNext();
                                            }, headStopDurationInSec * 1000);
                                        } else {
                                            changeCurrentFieldAndGoToNext();
                                        }
                                    }
                                });
                            }, simulatorHeadTransitionDurationInSec * 1000);
                        }

                        if(!simulation) {
                            var currentState = $scope.stateMatrix[0],
                                currentSymbol = $scope.tape[currentHeadPosition];

                            simulation = {
                                currentState: currentState,
                                currentSymbol: currentSymbol,
                                currentField: currentState.fields[currentSymbol]
                            }
                        }

                        $scope.isSimulationPlay = true;
                        changeCurrentFieldAndGoToNext();
                    };

                    $scope.setSimulationSpeed = function(valueToIncremmentSpeed) {
                        var speed = parseFloat($scope.simulationSpead);

                        if(valueToIncremmentSpeed) {
                            speed += valueToIncremmentSpeed;
                            speed = speed.toFixed(1);
                            $scope.simulationSpead = speed;
                        }

                        if(speed < 0) {
                            $scope.simulationSpead = 0.0;
                        }

                        if(!isNaN(speed) && speed >= 0) {
                            $scope.setHeadSimulationDuration(speed);
                            $scope.setTapeAdjustingAnimationDuration(speed * 1.5);
                            headStopDurationInSec = speed / 2;
                        }
                    };

                    $timeout(function() {
                        $scope.simulationSpead = $scope.getHeadSimulationDuration();

                        $scope.setFieldOnLeftSide(currentHeadPosition - 4);
                        $scope.setHeadOnField(currentHeadPosition);
                    }, 1);
                }
            }
        }]);
})();
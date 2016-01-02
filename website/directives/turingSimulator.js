(function() {
    angular.module('turingApp')
        .directive('turingSimulator', ['$timeout', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'turingSimulator.html',
                scope: {
                    userInputTable: '=',
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
                            simulatorHeadTransitionDuration = parseFloat($simulatorHead.css('transition-duration').split('s')[0]);

                        $simulatorHead.css('transition-duration', '0.2s');
                        $simulatorHead.css('left', oldSimulatorHeadLeftOffset + translationOffset);
                        $tape.css('left', newTapeLeftOffset);
                        $scope.newTapeLeftOffset = newTapeLeftOffset;
                        $scope.firstVisibleFieldIndex = fieldNumber;
                        $scope.lastVisibleFieldIndex = fieldNumber + visibleFieldsCount;

                        $timeout(function() {
                            $simulatorHead.css('transition-duration', simulatorHeadTransitionDuration.toString() + 's');
                        }, 200);
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
                        firstNotHashFieldIndex = hashNeighborsCount,
                        currentHeadPosition = firstNotHashFieldIndex,
                        adjustAmount = 3;

                    $scope.setFieldValue = function(fieldNumber, newValue) {
                        $scope.$evalAsync(function() {
                            $scope.tape[fieldNumber] = newValue;
                        });
                    };

                    $scope.$watch('userInputTable', function(newVal) {
                        function genereateHashOnTapeEnd(hashNumber) {
                            for(var i = 0; i < hashNumber; i++) {
                                $scope.tape.push('#');
                            }
                        }
                        $scope.tape = [];
                        genereateHashOnTapeEnd(hashNeighborsCount);
                        if(newVal) {
                            for(var i = 0; i < newVal.length; i++) {
                                $scope.tape.push(newVal[i]);
                            }
                        }
                        genereateHashOnTapeEnd(hashNeighborsCount);
                    });

                    function adjustTapePosition() {
                        if(currentHeadPosition - $scope.firstVisibleFieldIndex <= adjustAmount) {
                            $scope.setFieldOnLeftSide($scope.firstVisibleFieldIndex - adjustAmount);
                        } else if($scope.lastVisibleFieldIndex - currentHeadPosition <= adjustAmount) {
                            $scope.setFieldOnLeftSide($scope.firstVisibleFieldIndex + adjustAmount);
                        }
                    }

                    $scope.startSimulation = function() {
                        var currentState = $scope.stateMatrix[0],
                            currentSymbol = $scope.tape[currentHeadPosition],
                            currentField = currentState.fields[currentSymbol];

                        function changeCurrentFieldAndGoToNext() {
                            var newSymbol = currentField.char,
                                direction = currentField.direction,
                                newState = currentField.newState - 1;

                            $scope.setFieldValue(currentHeadPosition, newSymbol);

                            if(direction == 'R') {
                                currentHeadPosition++;
                            } else if(direction == 'L') {
                                currentHeadPosition--;
                            }

                            $scope.setHeadOnField(currentHeadPosition);

                            currentState = $scope.stateMatrix[newState];
                            currentSymbol = $scope.tape[currentHeadPosition];
                            currentField = currentState.fields[currentSymbol];

                            $timeout(function() {
                                changeCurrentFieldAndGoToNext();
                            }, 700);
                            $timeout(function() {
                                adjustTapePosition();
                            }, 500);
                        }

                        changeCurrentFieldAndGoToNext();
                    };

                    $timeout(function() {
                        $scope.setFieldOnLeftSide(currentHeadPosition - 4);
                        $scope.setHeadOnField(currentHeadPosition);
                    }, 1);
                }
            }
        }]);
})();
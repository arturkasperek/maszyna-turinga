(function() {
    angular.module('turingApp')
        .directive('turingSimulator', ['$timeout', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'turingSimulator.html',
                scope: {
                    userInputTable: '='
                },
                link: function($scope, $element) {
                    var that = this,
                        $simulatorHead = $element.find('.simulator-head'),
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
                            tapeOldLeftPosition = $tape.position().left;

                        $tape.css('left', tapeOldLeftPosition - fieldLeftPosition);
                    };

                    $scope.setHeadOnField = function(fieldNumber) {
                        var $field = $tape.find('.field-' + fieldNumber),
                            fieldLeftPosition = $field.position().left,
                            tapeLeftOffset = $tape.position().left;

                        $simulatorHead.css('left', fieldLeftPosition + tapeLeftOffset);
                    };

                    $timeout(function() {
                        setElementsSize();
                        adjustSimulatorHead();
                    }, 1);
                },
                controller: function($scope) {
                    var that = this,
                        hashNeighborsCount = 10,
                        firstNotHashFieldIndex = hashNeighborsCount;

                    $scope.$watch('userInputTable', function(newVal) {
                        function genereateHashOnTapeEnd(hashNumber) {
                            for(var i = 0; i < hashNumber; i++) {
                                $scope.tape += '#';
                            }
                        }
                        $scope.tape = '';
                        genereateHashOnTapeEnd(hashNeighborsCount);
                        if(newVal) {
                            $scope.tape += newVal;
                        }
                        genereateHashOnTapeEnd(hashNeighborsCount);
                    });

                    $timeout(function() {
                        $scope.setFieldOnLeftSide(firstNotHashFieldIndex - 2);
                    }, 1);
                }
            }
        }]);
})();
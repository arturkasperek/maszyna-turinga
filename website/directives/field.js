(function() {
    angular.module('turingApp')
        .directive('field', function($timeout) {
            return {
                restrict: 'A',
                templateUrl: 'field.html',
                scope: {
                    field: '=fieldObject'
                },
                link: function($scope) {
                    var that = this,
                        lastActiveField = undefined,
                        pickingActive = false;

                    $scope.fieldsFocus = [{
                        direction: false,
                        symbol: false,
                        state: false
                    }];

                    function fieldFocus(fieldName) {
                        $scope.fieldsFocus[fieldName] = false;
                        $timeout(function() {
                            $scope.fieldsFocus[fieldName] = true;
                        }, 1);
                    }

                    $scope.activeEditMode = function(fieldName) {
                        if(fieldName == 'direction') {
                            fieldFocus('direction');
                            $scope.showDirectionControl = true;
                        } else {
                            $scope.showDirectionControl = false;
                        }

                        if(fieldName == 'symbol') {
                            pickingActive = true;
                            $scope.$emit('symbolPickingActive');
                        } else {
                            $scope.$emit('symbolPickingDeactive');
                        }

                        if(fieldName == 'state') {
                            pickingActive = true;
                            $scope.$emit('statePickingActive');
                        } else {
                            $scope.$emit('statePickingDeactive');
                        }

                        $scope.editMode = true;
                        lastActiveField = fieldName;
                    };

                    $scope.setDirectionAndGoToNextField = function(direction) {
                        $scope.field.direction = direction;
                        fieldFocus('symbol');
                    };

                    $scope.turnoffEditMode = function() {
                        function offEditMode() {
                            $scope.$emit('symbolPickingDeactive');
                            $scope.$emit('statePickingDeactive');
                            $scope.editMode = false;
                        }
                        if(!pickingActive) {
                            offEditMode();
                        } else {
                            $timeout(function() {
                                /*  if picking is now still active mean that user
                                    doesn't click on picking element, and we should
                                    now turn off editing mode
                                */
                                if(pickingActive) {
                                    offEditMode();
                                }
                            }, 1);
                        }
                    };

                    $scope.changeEditMode = function() {

                    };

                    $scope.$on('symbolPicked', function(e, symbol) {
                        if($scope.editMode == true) {
                            $scope.field.char = symbol;
                            $timeout(function() {
                                pickingActive = false;
                                fieldFocus('state');
                            }, 1);
                        }
                    });

                    $scope.$on('statePicked', function(e, state) {
                        if($scope.editMode == true) {
                            $scope.field.newState = state;
                            $timeout(function() {
                                pickingActive = false;
                                $scope.turnoffEditMode();
                            }, 1);
                        }
                    });
                }
            }
    });
})();
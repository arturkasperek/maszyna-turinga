angular.module('turingApp')
    .directive('field', function($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'field.html',
            scope: {
                direction: '=direction',
                char: '=char',
                newState: '=newState',
                editMode: '=editMode'
            },
            link: function($scope) {
                var switchedToDiffrentField = undefined,
                    lastActiveField = undefined;

                $scope.focusDirectionField = false;

                $scope.field = new Field($scope.direction, $scope.char, $scope.newState);

                $scope.activeEditMode = function(fieldNumber) {
                    if(switchedToDiffrentField == undefined || lastActiveField == fieldNumber) {
                        switchedToDiffrentField = false;
                    } else {
                        switchedToDiffrentField = true;
                    }

                    $scope.editMode = true;
                    $scope.focusDirectionField = true;
                    lastActiveField = fieldNumber;
                };

                $scope.turnoffEditMode = function() {
                    $timeout(function() {
                        console.log(switchedToDiffrentField);
                        if(!switchedToDiffrentField) {
                            $scope.editMode = false;
                        } else {
                            switchedToDiffrentField = false;
                        }
                    }, 1);
                };
            }
        }
});
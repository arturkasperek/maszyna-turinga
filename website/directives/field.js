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
                var switchedToDiffrentField = false;

                $scope.focusDirectionField = false;

                $scope.field = new Field($scope.direction, $scope.char, $scope.newState);

                $scope.activeEditMode = function() {
                    switchedToDiffrentField = true;

                    $scope.editMode = true;
                    $scope.focusDirectionField = true;
                };

                $scope.turnoffEditMode = function() {
                    $timeout(function() {
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
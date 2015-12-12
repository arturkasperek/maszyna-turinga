(function() {
    angular.module('turingApp')
        .directive('clickedOutside',['$document', '$timeout',function($document, $timeout){
            return {
                restrict: 'A',
                link: function(scope, elem, attr) {
                    $timeout(function() {
                        var elemClickHandler = function(e) {
                            e.stopPropagation();
                        };

                        var docClickHandler = function() {
                            scope.$apply(attr.clickedOutside);
                        };

                        elem.on('click', elemClickHandler);
                        $document.on('click', docClickHandler);

                        scope.$on('$destroy', function() {
                            elem.off('click', elemClickHandler);
                            $document.off('click', docClickHandler);
                        });
                    }, 1);
                }
            }
    }]);
})();
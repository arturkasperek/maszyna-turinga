(function() {
    "use strict";
    angular.module('turingApp')
        .service('matrixService', function() {
            var that = this,
                stateMatrix = [],
                symbols = [];

            this.initMachine = initMachine;
            this.getTuringMatrixObject = getTuringMatrixObject;

            function initMachine(stateNumber, availableSymbols) {
                if(availableSymbols.length <= 0) {
                    throw new Error("Musisz podać znaki !!!");
                } else {
                    stateMatrix = [];
                    symbols = [];

                    //generate table header
                    for(var i = 0; i < availableSymbols.length; i++) {
                        symbols.push(availableSymbols[i]);
                    }

                    for(var i = 0; i < stateNumber; i++) {
                        var state = {
                            fields: [],
                            stateName: i + 1
                        };

                        for(var j = 0; j < availableSymbols.length; j++) {
                            var field = new Field('N', availableSymbols[j], i + 1);

                            field.showEditMode = false;

                            state.fields.push(field);
                        }
                        stateMatrix.push(state);
                    }
                }
            }

            function getTuringMatrixObject() {
                return {
                    stateMatrix: stateMatrix,
                    symbols: symbols
                }
            }
        });
})();
(function() {
    "use strict";
    angular.module('turingApp')
        .service('matrixService', function() {
            var that = this,
                stateMatrix = [],
                symbols = [],
                stateNumber,
                lastAddedStateName;

            this.initMachine = initMachine;
            this.initMachineFromObject = initMachineFromObject;
            this.getTuringMatrixObject = getTuringMatrixObject;
            this.deleteSymbol = deleteSymbol;
            this.deleteLastAddedState = deleteLastAddedState;
            this.addSymbol = addSymbol;
            this.addState = addState;

            function createState(stateName, symbols) {
                var state = {
                    fields: {},
                    stateName: stateName
                };

                for(var j = 0; j < symbols.length; j++) {
                    var field = new Field('', '', ''),
                        currentSymbol = symbols[j];

                    state.fields[currentSymbol] = field;
                }

                return state;
            }

            function initMachineFromObject(newStateMatrix, newSymbols) {
                stateMatrix = newStateMatrix;
                symbols = newSymbols;
            }

            function initMachine(newStateNumber, availableSymbols) {
                if(availableSymbols.length <= 0) {
                    throw new Error("Musisz podać znaki !!!");
                } else {
                    stateNumber = newStateNumber;
                    stateMatrix = [];
                    symbols = [];

                    //generate table header
                    for(var i = 0; i < availableSymbols.length; i++) {
                        symbols.push(availableSymbols[i]);
                    }

                    for(var i = 0; i < stateNumber; i++) {
                        var newState = createState(i + 1, availableSymbols);

                        stateMatrix.push(newState);
                        lastAddedStateName = newState.stateName;
                    }
                }
            }

            function deleteSymbol(symbol) {
                stateMatrix.forEach(function(state) {
                    delete state.fields[symbol];
                });

                symbols.splice(symbols.indexOf(symbol), 1);
            }

            function deleteLastAddedState() {
                stateMatrix.splice(stateNumber -1, 1);
                stateNumber--;
            }

            function addState(stateName) {
                stateName = stateName || stateNumber + 1;
                var newState = createState(stateName, symbols);

                stateMatrix.push(newState);
                lastAddedStateName = newState.stateName;
                stateNumber++;
            }

            function addSymbol(symbol) {
                stateMatrix.forEach(function(state) {
                    state.fields[symbol] = new Field('', '', '');
                });

                symbols.push(symbol);
            }

            function getTuringMatrixObject() {

                return {
                    stateMatrix: stateMatrix,
                    symbols: symbols
                }
            }
        });
})();
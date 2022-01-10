/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EpsilonTransition } from './epsilontransition.js';
import { SymbolTransition } from './symboltransition.js';

class State {
    constructor(index, accept) {
        this.index = index;
        this.accept = accept;
        this.symbolTransitions = []; // [{symbol: Symbol, nextState: State}]
        this.epsilonTransition = new EpsilonTransition(); // [nextStates: [State, State, ...]]
    }

    addSymbolTransition(symbol, nextState) {
        this.symbolTransitions.push(
            new SymbolTransition(symbol, nextState));
    }

    addEpsilonTransition(nextState) {
        this.epsilonTransition.nextStates.push(nextState);
    }

    toString() {
        let symbols = this.symbolTransitions.map(item => {
            return '"' + item.symbol.toString() + '"->' + item.nextState.index;
        });

        let epsilonNextStateIndexies = this.epsilonTransition.nextStates.map(item => {
            return item.index;
        });

        let epsilons = 'ε->[' + epsilonNextStateIndexies.join(',') + ']';

        symbols.push(epsilons);

        return this.index +
            (this.accept ? '*' : '') +
            ': ' +
            symbols.join(', ');
    }
}

export { State };

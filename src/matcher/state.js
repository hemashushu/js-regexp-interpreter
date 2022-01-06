/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EpsilonSymbol } from './epsilonsymbol.js';

class State {
    constructor() {
        this.accept = false;
        this.transitions = []; // [{Symbol, [nextState, ...]}]
    }

    addTransition(symbol, state) {
        this.transitions.push({
            symbol: symbol,
            states: [state]
        });
    }

    addEpsilonTransition(state) {
        let transition = this.transitions.find(item => {
            return item instanceof EpsilonSymbol;
        });

        if (transition === null) {
            this.transitions.push({
                symbol: new EpsilonSymbol(),
                states: [state]
            });
        }else {
            transition.states.push(state);
        }
    }
}

export { State };

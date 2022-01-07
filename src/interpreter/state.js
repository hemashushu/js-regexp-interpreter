/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EpsilonSymbol } from './epsilonsymbol.js';
import { Transition } from './transition.js';

class State {
    constructor(index, accept) {
        this.index = index;
        this.accept = accept;
        this.transitions = []; // [{symbol: Symbol, states: [nextState, ...]}]
    }

    addTransition(transition) {
        this.transitions.push(transition);
    }

    appendEpsilonTransition(state) {
        let epsilonTransition = this.transitions.find(item => {
            return item instanceof EpsilonSymbol;
        });

        if (epsilonTransition === null) {
            this.addTransition(
                new Transition(new EpsilonSymbol(), [state])
            );
        } else {
            epsilonTransition.states.push(state);
        }
    }

    toString() {
        let ss = this.transitions.map(item => {
            return item.toString();
        });
        return ss.join(',');
    }
}

export { State };

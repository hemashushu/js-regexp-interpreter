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

        // State 的转换列表，排在前面的 Transition 将会优先计算
        this.transitions = [];
    }

    addSymbolTransition(symbol, nextState) {
        this.transitions.push(
            new SymbolTransition(symbol, nextState));
    }

    addEpsilonTransition(nextState) {
        this.transitions.push(
            new EpsilonTransition(nextState));
    }

    toString() {
        let lines = this.transitions.map(item => {
            return item.toString();
        });

        return this.index +
            (this.accept ?
                '*' :
                '') +
            ': ' +
            (lines.length > 0 ?
                lines.join(', '):
                '[]');
    }
}

export { State };

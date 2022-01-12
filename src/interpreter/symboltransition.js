/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Transition } from './transition.js';

class SymbolTransition extends Transition {
    constructor(symbol, nextState) {
        super(nextState);

        // symbol 是 AST 的 Symbol 对象实例：
        //
        // Symbol
        //   |-- Char
        //   |     |-- SimpleChar
        //   |     \-- UnicodeChar
        //   |
        //   \-- CharSet

        this.symbol = symbol;
    }

    toString() {
        return '"' + this.symbol.toString() + '" -> ' + this.nextState.index;
    }
}

export { SymbolTransition };
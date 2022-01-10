/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class SymbolTransition {
    constructor(symbol, nextState) {

        // symbol 是 AST 的 Symbol 对象实例：
        //
        // Symbol
        //   |-- Char
        //   |     |-- CodePointChar
        //   |     |     |-- SimpleChar
        //   |     |     \-- UnicodeChar
        //   |     |
        //   |     \--  MetaChar
        //   |
        //   \-- CharSet

        this.symbol = symbol;
        this.nextState = nextState;
    }
}

export { SymbolTransition };
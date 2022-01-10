/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Symbol
//   |-- Char
//   |     |-- CodePointChar
//   |     |     |-- SimpleChar
//   |     |     \-- UnicodeChar
//   |     |
//   |     \--  MetaChar
//   |
//   \-- CharSet
//
// Expression
//   |-- AlternativeExp
//   |-- DisjunctionExp
//   |-- GroupExp
//   \-- RepetitionExp
//
// Quantifier
//   |-- RangeQuantifier
//   |-- OneOrMoreQuantifier
//   |-- OneOrZeroQuantifier
//   |-- ManyTimesQuantifier,
//   |-- ManyTimesOrMoreQuantifier
//   \-- ZeroOrMoreQuantifier

import {
    Symbol,

    Char,
    CodePointChar,
    SimpleChar,
    UnicodeChar,

    MetaChar,
    CharSet,

    Expression,
    AlternativeExp,
    DisjunctionExp,
    GroupExp,
    RepetitionExp,

    // 常量
    MetaChars,
    MetaCharDot,
    EntityChars,

    // 辅助
    CharRange,
    Quantifier,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
} from '../src/ast/index.js';

import { State } from './state.js';
import { Transition } from './transition.js';

class StateBuilder {
    constructor() {
        this.count = 0
    }

    generateStateObject(accept) {
        let idx = this.count;
        let state = new State(idx, accept);
        return state;
    }

    /**
     *
     * @param {*} exp AST 对象
     */
    build(exp) {
        //if (exp instanceof )
    }

}

export { StateBuilder };
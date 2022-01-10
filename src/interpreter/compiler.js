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
} from '../ast/index.js';

import { State } from './state.js';

import { EpsilonTransition } from './epsilontransition.js';
import { SymbolTransition } from './symboltransition.js';

class Compiler {
    constructor() {
        this.count = 0
        this.states = [];
    }

    generateStateObject(accept = false) {
        let idx = this.count;
        this.count++;

        let state = new State(idx, accept);
        this.states.push(state);

        return state;
    }

    /**
     * 编译语法树为自动机的 State 结构
     *
     * @param {*} node 语法树，注意需要先经过元字符处理。
     *     即，必须先经过 Transformer 转换。
     */
    compile(node) {
        if (node === undefined) {
            // 正则表达式是空的情况，视为 `^$`
            return this.generateEpsilonStates();

        } else {
            return this.generate(node);
        }
    }

    generate(node) {
        if (node instanceof Symbol) {
            return this.generateSymbolStates(node);
        }
    }

    generateEpsilonStates() {
        let inState = this.generateStateObject();
        let outState = this.generateStateObject(true);
        inState.addEpsilonTransition(outState);
        return { inState, outState };
    }

    generateSymbolStates(node) {
        let inState = this.generateStateObject();
        let outState = this.generateStateObject(true);
        inState.addSymbolTransition(node, outState);
        return { inState, outState };
    }
}

export { Compiler };
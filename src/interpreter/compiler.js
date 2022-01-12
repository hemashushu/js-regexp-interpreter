/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Symbol
//   |-- Char
//   |     |-- SimpleChar
//   |     \-- UnicodeChar
//   |
//   \-- CharSet
//
// MetaChar
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

    AlternativeExp,
    DisjunctionExp,
    GroupExp,
    RepetitionExp,

    // 辅助
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
} from '../ast/index.js';

import { State } from './state.js';

class Compiler {
    constructor() {
        this.count = 0
        this.states = [];
    }

    /**
     * 构建一个 State 对象
     * @param {*} accept 标记当前 State 是否为表达式的终点状态
     * @returns
     */
    newStateObject(accept = false) {
        let idx = this.count;
        this.count++;

        let state = new State(idx, accept);
        this.states.push(state);

        return state;
    }

    /**
     * 编译语法树为自动机的 State 表或结构
     *
     * @param {*} node 语法树，注意需要先经过元字符处理。
     *     即，从正则表达式字符串开始，需要经过如下处理过程：
     *     - Lex 将字符串转为一系列 Token；
     *     - Parser 将 Token 构建成一棵语法树；
     *     - 使用 Transformer 将语法树里的某些特殊节点（比如元字符）转换为普通节点；
     *     - Compiler 将语法树转成一个 State 表。
     * @returns {inState, outState}
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
            // Symbol 包括 Char（SimpleChar, UnicodeChar, MetaChar） 和 CharSet
            return this.generateSymbolStates(node);

        } else if (node instanceof RepetitionExp) {
            return this.generateRepeatStates(node);

        } else if (node instanceof AlternativeExp) {
            return this.generateConcatStates(node);

        } else if (node instanceof DisjunctionExp) {
            return this.generateOrStates(node);

        } else if (node instanceof GroupExp) {
            return this.generateGroupStates(node);

        } else {
            throw new Error('Unsupport AST node.');
        }
    }

    generateEpsilonStates() {
        let inState = this.newStateObject();
        let outState = this.newStateObject(true);
        inState.addEpsilonTransition(outState);
        return { inState, outState };
    }

    generateSymbolStates(node) {
        let inState = this.newStateObject();
        let outState = this.newStateObject(true);
        inState.addSymbolTransition(node, outState);
        return { inState, outState };
    }

    generateRepeatStates(node) {
        let exp = node.exp;
        let quantifier = node.quantifier;

        let { inState, outState } = this.generate(exp);

        if (quantifier instanceof OneOrMoreQuantifier) {
            // 重复 + 次
            if (quantifier.greedy) {
                // 从 outState 添加一个 ε 转换到 inState
                outState.addEpsilonTransition(inState);

            } else {
                // 1. 新建 outState' (accept = true)
                // 2. 为 outState 添加一个 ε 转换到 outState'
                // 3. 为 outState 添加一个 ε 转换到 inState
                // 4. 设置 outState 的 accept 为 false
                // 5. 将 outState' 作为新的 out state
                let outState2 = this.newStateObject(true);
                outState.addEpsilonTransition(outState2);
                outState.addEpsilonTransition(inState);

                outState.accept = false;
                outState = outState2;
            }

        } else if (quantifier instanceof OneOrZeroQuantifier) {
            // 重复 ? 次
            if (quantifier.greedy) {
                // 从 inState 添加一个 ε 到 outState
                inState.addEpsilonTransition(outState);

            } else {
                // 1. 新建 inState'
                // 2. 为 inState' 添加一个 ε 转换到 outState
                // 3. 为 inState' 添加一个 ε 转换到 inState
                // 4. 将 inState' 作为新的 in state
                let inState2 = this.newStateObject();
                inState2.addEpsilonTransition(outState);
                inState2.addEpsilonTransition(inState);
                inState = inState2;
            }

        } else if (quantifier instanceof ZeroOrMoreQuantifier) {
            // 重复 * 次
            if (quantifier.greedy) {
                // 1. 为 inState 添加一个 ε 转换到 outState
                // 2. 为 outState 添加一个 ε 转换到 inState
                inState.addEpsilonTransition(outState);
                outState.addEpsilonTransition(inState);

            } else {
                // 1. 新建 inState'
                // 2. 新建 outState' (accept = true)
                // 3. 为 inState' 添加一个 ε 转换到 outState'
                // 4. 为 inState' 添加一个 ε 转换到 inState
                // 5. 为 outState 添加一个 ε 转换到 outState'
                // 6. 为 outState 添加一个 ε 转换到 inState
                // 7. 设置 outState 的 accept 为 false
                // 8. 将 inState' 作为新的 in state
                // 9. 将 outState' 作为新的 out state

                let inState2 = this.newStateObject();
                let outState2 = this.newStateObject(true);
                inState2.addEpsilonTransition(outState2);
                inState2.addEpsilonTransition(inState);
                outState.addEpsilonTransition(outState2);
                outState.addEpsilonTransition(inState);

                outState.accept = false;
                inState = inState2;
                outState = outState2;
            }

        } else if (quantifier instanceof RangeQuantifier) {
            // 重复 {m,n} 次
            throw new Error('Not implemented.');

        } else if (quantifier instanceof ManyTimesQuantifier) {
            // 重复 {m} 次
            throw new Error('Not implemented.');

        } else if (quantifier instanceof ManyTimesOrMoreQuantifier) {
            // 重复 {m,} 次
            throw new Error('Not implemented.');

        } else {
            throw new Error('Unexpected quantifier');
        }

        return { inState, outState };
    }

    generateConcatStates(node) {
        // "连接" 表达式
        let statePairs = node.exps.map(item => {
            return this.generate(item);
        });

        // 将前一对 State 的 outState 和下一对 State 的 inState
        // 通过 EpsilonTransition 串联起来
        for (let idx = 1; idx < statePairs.length; idx++) {
            let previousOutState = statePairs[idx - 1].outState;
            let nextInState = statePairs[idx].inState;

            previousOutState.accept = false; // 重置前一个状态的 accept
            previousOutState.addEpsilonTransition(nextInState);
        }

        return {
            inState: statePairs[0].inState,
            outState: statePairs[statePairs.length - 1].outState
        };
    }

    generateOrStates(node) {
        // "或" 表达式
        let statePairs = node.exps.map(item => {
            return this.generate(item);
        });

        // 1. 新建 inState'
        // 2. 新建 outState' (accept = true)
        // 3. 为 inState' 添加一个 ε 转换到 statePairs 里的每一个 inState
        // 4. 为 statePairs 里的每一个 outState 添加一个 ε 转换到 outState'
        // 5. 设置 statePairs 里的每一个 outState 的 accept 为 false
        // 6. 将 inState' 作为新的 in state
        // 7. 将 outState' 作为新的 out state

        let inState2 = this.newStateObject();
        let outState2 = this.newStateObject(true);

        for (const { inState, outState } of statePairs) {
            inState2.addEpsilonTransition(inState);
            outState.addEpsilonTransition(outState2);
            outState.accept = false;
        }

        return {
            inState: inState2,
            outState: outState2
        };
    }

    generateGroupStates(node) {
        // "组" 表达式

        // 1. 新建 inState'
        // 2. 新建 outState' (accept = true)
        // 3. 为 inState' 添加一个 ε 转换到 inState
        // 4. 为 outState 添加一个 ε 转换到 outState'
        // 5. 设置 outState 的 accept 为 false
        // 6. 将 inState' 作为新的 in state
        // 7. 将 outState' 作为新的 out state

        let exp = node.exp;
        let { inState, outState } = this.generate(exp);

        let inState2 = this.newStateObject();
        let outState2 = this.newStateObject(true);

        inState2.addEpsilonTransition(inState);
        outState.addEpsilonTransition(outState2);

        outState.accept = false;

        inState = inState2;
        outState = outState2;

        return {inState, outState};
    }
}

export { Compiler };
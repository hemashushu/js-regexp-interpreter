/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Parser } from '../parser/index.js';
import { Transformer } from './transformer.js';
import { Compiler } from './compiler.js';
import { EpsilonTransition } from './epsilontransition.js';
import { SymbolTransition } from './symboltransition.js';

class Matcher {

    /**
     * 将字符串转成语法树
     *
     * @param {*} expStr
     * @returns AST
     */
    static parse(expStr) {
        let parser = new Parser();

        let tree = parser.parseString(expStr);
        return tree;
    }

    /**
     * 将语法树编译成状态表
     *
     * @param {*} expStr
     * @returns {inState, outState, states}
     */
    static compile(expStr) {
        let transformer = new Transformer();
        let compiler = new Compiler();

        let tree = Matcher.parse(expStr);
        let node = transformer.transform(tree); // 语法检查，转换元字符等
        let { inState, outState } = compiler.compile(node);
        let states = compiler.states;
        return { inState, outState, states };
    }

    /**
     * 使用状态表测试目标字符串
     *
     * @param {*} expStr
     * @param {*} testStr
     * @returns
     */
    static test(expStr, testStr) {
        let { inState } = Matcher.compile(expStr);

        let testChars = [];
        for (const c of testStr) {
            testChars.push(c);
        }

        return Matcher.match(inState, testChars, 0);
    }

    /**
     * 从 inState 开始不断往前探索所有能到达的 State，如果
     * 被测试的字符数组已消费（consume）完，且刚好落在一个 accept 属性为 true
     * 的 State，说明被测试的字符数组符合（match）正则表达式所构造
     * 出来的 State 表/结构。
     *
     * @param {*} state
     * @param {*} testChars
     * @param {*} idx
     * @param {*} nodes
     * @returns
     */
    static match(state, testChars, idx, nodes = []) {

        // nodes 记录 match() 方法经历过的 State，是访问途经
        // 的轨迹记录，如果一个 State 已经在轨迹上，说明 match()
        // 掉入一个死循环了，这时要停止往前探索。
        if (nodes.includes(state.index)) {
            return false;
        }
        nodes.push(state.index);

        if (idx === testChars.length) {
            // 到达测试字符数组的末尾

            if (state.accept) {
                return true;
            }

            // 再努力看看有无 EpsilonTransition
            let transitions = state.transitions;
            for (const transition of transitions) {
                if (transition instanceof EpsilonTransition) {
                    if (Matcher.match(
                        transition.nextState,
                        testChars,
                        idx,
                        nodes)) {

                        return true;
                    }
                }
            }

            // 没有更多的 Transition，只能返回 false 表示匹配失败
            return false;

        } else {
            let char = testChars[idx];
            let codePoint = char.codePointAt(0);

            // 依次检查 State 的所有 Transition
            let transitions = state.transitions;
            for (const transition of transitions) {
                if (transition instanceof SymbolTransition) {
                    // 当前是字符 SymbolTransition

                    let symbol = transition.symbol;
                    if (symbol.includes(codePoint)) {
                        if (Matcher.match(
                            transition.nextState,
                            testChars,
                            idx + 1)) { // SymbolTransition 消费一个字符

                            return true;
                        }
                    }

                } else {
                    // 当前是字符 EpsilonTransition

                    if (Matcher.match(
                        transition.nextState,
                        testChars,
                        idx,       // EpsilonTransition 不消费字符
                        nodes)) {

                        return true;
                    }
                }
            }

            // 没有满足条件的 Transition，只能返回 false 表示匹配失败
            return false;
        }
    }
}

export { Matcher };
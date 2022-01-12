/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Parser } from '../src/parser/index.js';
import { Transformer } from '../src/interpreter/transformer.js';
import { Compiler } from '../src/interpreter/compiler.js';

function testA() {
    // 单一字符
    let { states: c1, inState: in1, outState: out1 } = getStates('a');
    assert.deepEqual(statesToLines(c1), [
        '0: "a" -> 1',
        '1*: []'
    ]);

    assert.equal(in1.toString(), '0: "a" -> 1');
    assert.equal(out1.toString(), '1*: []');

    // 空表达式，相当于 `^$`
    let { states: c2, inState: in2, outState: out2 } = getStates('');
    assert.deepEqual(statesToLines(c2), [
        '0: ε -> 1',
        '1*: []'
    ]);

    assert.equal(in2.toString(), '0: ε -> 1');
    assert.equal(out2.toString(), '1*: []');

    // 字符集
    let { states: c3, inState: in3, outState: out3 } = getStates('\\w');
    assert.deepEqual(statesToLines(c3), [
        '0: "[A-Za-z0-9_]" -> 1',
        '1*: []'
    ]);

    assert.equal(in3.toString(), '0: "[A-Za-z0-9_]" -> 1');
    assert.equal(out3.toString(), '1*: []');

    // 自定义字符集
    let { states: c4, inState: in4, outState: out4 } = getStates('[a-f\\d]');
    assert.deepEqual(statesToLines(c4), [
        '0: "[a-f0-9]" -> 1',
        '1*: []'
    ]);

    assert.equal(in4.toString(), '0: "[a-f0-9]" -> 1');
    assert.equal(out4.toString(), '1*: []');

    // 自定义字符集
    let { states: c5, inState: in5, outState: out5 } = getStates('[文\\u{2764}]');
    assert.deepEqual(statesToLines(c5), [
        '0: "[文\\u{2764}]" -> 1',
        '1*: []'
    ]);

    assert.equal(in5.toString(), '0: "[文\\u{2764}]" -> 1');
    assert.equal(out5.toString(), '1*: []');

    // "非" 字符集
    let { states: c6, inState: in6, outState: out6 } = getStates('[^ab]');
    assert.deepEqual(statesToLines(c6), [
        '0: "[^ab]" -> 1',
        '1*: []'
    ]);

    assert.equal(in6.toString(), '0: "[^ab]" -> 1');
    assert.equal(out6.toString(), '1*: []');
}

function testArepetition() {
    // 重复 A+
    let { states: c1, inState: in1, outState: out1 } = getStates('a+');
    assert.deepEqual(statesToLines(c1), [
        '0: "a" -> 1',
        '1*: ε -> 0'
    ]);

    assert.equal(in1.index, 0);
    assert.equal(out1.index, 1);

    // 重复 A+?
    let { states: c2, inState: in2, outState: out2 } = getStates('a+?');
    assert.deepEqual(statesToLines(c2), [
        '0: "a" -> 1',
        '1: ε -> 2, ε -> 0',
        '2*: []'
    ]);

    assert.equal(in2.index, 0);
    assert.equal(out2.index, 2);

    // 重复 A?
    let { states: c3, inState: in3, outState: out3 } = getStates('a?');
    assert.deepEqual(statesToLines(c3), [
        '0: "a" -> 1, ε -> 1',
        '1*: []'
    ]);

    assert.equal(in3.index, 0);
    assert.equal(out3.index, 1);

    // 重复 A??
    let { states: c4, inState: in4, outState: out4 } = getStates('a??');
    assert.deepEqual(statesToLines(c4), [
        '0: "a" -> 1', // 虽然是在 inState 之前插入新的 State，但 compiler.states
        '1*: []',      // 数组中以存在的项目的顺序不变
        '2: ε -> 1, ε -> 0',
    ]);

    assert.equal(in4.index, 2);
    assert.equal(out4.index, 1);

    // 重复 A*
    let { states: c5, inState: in5, outState: out5 } = getStates('a*');
    assert.deepEqual(statesToLines(c5), [
        '0: "a" -> 1, ε -> 1',
        '1*: ε -> 0'
    ]);

    assert.equal(in5.index, 0);
    assert.equal(out5.index, 1);

    // 重复 A*?
    let { states: c6, inState: in6, outState: out6 } = getStates('a*?');
    assert.deepEqual(statesToLines(c6), [
        '0: "a" -> 1',
        '1: ε -> 3, ε -> 0',
        '2: ε -> 3, ε -> 0',
        '3*: []'
    ]);

    assert.equal(in6.index, 2);
    assert.equal(out6.index, 3);
}

function testAB() {
    // 两个字符
    let { states: c1, inState: in1, outState: out1 } = getStates('ab');
    assert.deepEqual(statesToLines(c1), [
        '0: "a" -> 1',
        '1: ε -> 2',
        '2: "b" -> 3',
        '3*: []'
    ]);

    assert.equal(in1.index, 0);
    assert.equal(out1.index, 3);

    // 字符和字符集
    let { states: c2, inState: in2, outState: out2 } = getStates('a\\db');
    assert.deepEqual(statesToLines(c2), [
        '0: "a" -> 1',
        '1: ε -> 2',
        '2: "[0-9]" -> 3',
        '3: ε -> 4',
        '4: "b" -> 5',
        '5*: []'
    ]);

    assert.equal(in2.index, 0);
    assert.equal(out2.index, 5);

    // 字符和重复
    let { states: c3, inState: in3, outState: out3 } = getStates('ab*c');
    assert.deepEqual(statesToLines(c3), [
        '0: "a" -> 1',
        '1: ε -> 2',
        '2: "b" -> 3, ε -> 3',
        '3: ε -> 2, ε -> 4',
        '4: "c" -> 5',
        '5*: []'
    ]);

    assert.equal(in3.index, 0);
    assert.equal(out3.index, 5);

}

function testAorB() {
    // 两个字符
    let { states: c1, inState: in1, outState: out1 } = getStates('a|b');
    assert.deepEqual(statesToLines(c1), [
        '0: "a" -> 1',
        '1: ε -> 5',
        '2: "b" -> 3',
        '3: ε -> 5',
        '4: ε -> 0, ε -> 2',
        '5*: []'
    ]);

    assert.equal(in1.index, 4);
    assert.equal(out1.index, 5);

    // 字符+连接+重复
    let { states: c2, inState: in2, outState: out2 } = getStates('a|xy|b+');
    assert.deepEqual(statesToLines(c2), [
        '0: "a" -> 1',
        '1: ε -> 9',
        '2: "x" -> 3',
        '3: ε -> 4',
        '4: "y" -> 5',
        '5: ε -> 9',
        '6: "b" -> 7',
        '7: ε -> 6, ε -> 9',
        '8: ε -> 0, ε -> 2, ε -> 6',
        '9*: []'
    ]);

    assert.equal(in2.index, 8);
    assert.equal(out2.index, 9);
}

function testGroup() {
    // 一个组
    let { states: c1, inState: in1, outState: out1 } = getStates('(a)');
    assert.deepEqual(statesToLines(c1), [
        '0: "a" -> 1',
        '1: ε -> 3',
        '2: ε -> 0',
        '3*: []'
    ]);

    assert.equal(in1.index, 2);
    assert.equal(out1.index, 3);

    // 一个字符 + 一个组
    let { states: c2, inState: in2, outState: out2 } = getStates('a(b)');
    assert.deepEqual(statesToLines(c2), [
        '0: "a" -> 1',
        '1: ε -> 4',
        '2: "b" -> 3',
        '3: ε -> 5',
        '4: ε -> 2',
        '5*: []'
    ]);

    assert.equal(in2.index, 0);
    assert.equal(out2.index, 5);

    // 平行组
    let { states: c3, inState: in3, outState: out3 } = getStates('(a)(b)');
    assert.deepEqual(statesToLines(c3), [
        '0: "a" -> 1',
        '1: ε -> 3',
        '2: ε -> 0',
        '3: ε -> 6',
        '4: "b" -> 5',
        '5: ε -> 7',
        '6: ε -> 4',
        '7*: []'
    ]);

    assert.equal(in3.index, 2);
    assert.equal(out3.index, 7);

    // 嵌套组
    let { states: c4, inState: in4, outState: out4 } = getStates('(a(b)c)');
    assert.deepEqual(statesToLines(c4), [
        '0: "a" -> 1',
        '1: ε -> 4',
        '2: "b" -> 3',
        '3: ε -> 5',
        '4: ε -> 2',
        '5: ε -> 6',
        '6: "c" -> 7',
        '7: ε -> 9',
        '8: ε -> 0',
        '9*: []'
    ]);

    assert.equal(in4.index, 8);
    assert.equal(out4.index, 9);

    // 组 "或"
    let { states: c5, inState: in5, outState: out5 } = getStates('(ab)|(xy)');
    assert.deepEqual(statesToLines(c5), [
        '0: "a" -> 1',
        '1: ε -> 2',
        '2: "b" -> 3',
        '3: ε -> 5',
        '4: ε -> 0',
        '5: ε -> 13',
        '6: "x" -> 7',
        '7: ε -> 8',
        '8: "y" -> 9',
        '9: ε -> 11',
        '10: ε -> 6',
        '11: ε -> 13',
        '12: ε -> 4, ε -> 10',
        '13*: []'
    ]);

    assert.equal(in5.index, 12);
    assert.equal(out5.index, 13);

    // 组 "重复"
    let { states: c6, inState: in6, outState: out6 } = getStates('(ab)*');
    assert.deepEqual(statesToLines(c6), [
        '0: "a" -> 1',
        '1: ε -> 2',
        '2: "b" -> 3',
        '3: ε -> 5',
        '4: ε -> 0, ε -> 5',
        '5*: ε -> 4'
    ]);

    assert.equal(in6.index, 4);
    assert.equal(out6.index, 5);
}

function getStates(expression) {
    let parser = new Parser();
    let transformer = new Transformer();
    let complier = new Compiler();

    let tree = parser.parseString(expression);
    let nodes = transformer.transform(tree);

    let { inState, outState } = complier.compile(nodes);
    let states = complier.states;
    return { states, inState, outState };
}

function statesToLines(states) {
    return states.map(item => {
        return item.toString();
    });
}

function testCompiler() {
    testA();
    testArepetition();
    testAB();
    testAorB();
    testGroup();

    console.log('testCompiler() passed.');
}

export { testCompiler };

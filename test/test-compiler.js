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
    let {complier: c1, inState: in1, outState: out1} = getCompilerAndInOutState('a');
    assert.deepEqual(statesToLines(c1.states), [
        '0: "a"->1, ε->[]',
        '1*: ε->[]'
    ]);

    assert.equal(in1.toString(), '0: "a"->1, ε->[]');
    assert.equal(out1.toString(), '1*: ε->[]');

    // 空字符
    let {complier: c2, inState: in2, outState: out2} = getCompilerAndInOutState('');
    assert.deepEqual(statesToLines(c2.states), [
        '0: ε->[1]',
        '1*: ε->[]'
    ]);

    assert.equal(in2.toString(), '0: ε->[1]');
    assert.equal(out2.toString(), '1*: ε->[]');

    // 字符集
    let {complier: c3, inState: in3, outState: out3} = getCompilerAndInOutState('\\w');

    assert.deepEqual(statesToLines(c3.states), [
        '0: "[A-Za-z0-9_]"->1, ε->[]',
        '1*: ε->[]'
    ]);

    assert.equal(in3.toString(), '0: "[A-Za-z0-9_]"->1, ε->[]');
    assert.equal(out3.toString(), '1*: ε->[]');

    // 自定义字符集
    let {complier: c4, inState: in4, outState: out4} = getCompilerAndInOutState('[文\\w\\u{2764}]');

    assert.deepEqual(statesToLines(c4.states), [
        '0: "[文A-Za-z0-9_\\u{2764}]"->1, ε->[]',
        '1*: ε->[]'
    ]);

    assert.equal(in4.toString(), '0: "[文A-Za-z0-9_\\u{2764}]"->1, ε->[]');
    assert.equal(out4.toString(), '1*: ε->[]');
}

function getCompilerAndInOutState(expression) {
    let parser = new Parser();
    let complier = new Compiler();
    let transformer = new Transformer();

    let tree = parser.parseString(expression);
    let nodes = transformer.transform(tree);

    let {inState, outState} = complier.compile(nodes);
    return {complier, inState, outState};
}

function statesToLines(states) {
    return states.map(item => {
        return item.toString();
    });
}

function testCompiler() {
    testA();

    console.log('testCompiler() passed.');
}

export { testCompiler };

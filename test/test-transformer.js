/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Parser } from '../src/parser/index.js';
import { Transformer } from '../src/interpreter/transformer.js'

function testChar() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('a');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), 'a');

    let e2 = parser.parseString('\\u{4e2d}');
    let t2 = transformer.transform(e2);
    assert.equal(t2.toString(), '\\u{4e2d}');
}

function testMetaChar() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('\\n');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), '\\u{000a}');

    let e2 = parser.parseString('\\w');
    let t2 = transformer.transform(e2);
    assert.equal(t2.toString(), '[A-Za-z0-9_]');

    let e3 = parser.parseString('\\W');
    let t3 = transformer.transform(e3);
    assert.equal(t3.toString(), '[^A-Za-z0-9_]');

    let e4 = parser.parseString('\\s');
    let t4 = transformer.transform(e4);
    assert.equal(t4.toString(),
        '[ \\u{000c}\\u{000a}\\u{000d}\\u{0009}\\u{000b}\\u{00a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}\\u{2029}\\u{202f}\\u{205f}\\u{3000}\\u{feff}]');
}

function testCharSet() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('[ab]');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), '[ab]');

    let e2 = parser.parseString('[\\w-]');
    let t2 = transformer.transform(e2);
    assert.equal(t2.toString(), '[A-Za-z0-9_-]');

    let e3 = parser.parseString('[文\\w-]');
    let t3 = transformer.transform(e3);
    assert.equal(t3.toString(), '[文A-Za-z0-9_-]');
}

function testSeqExp() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('foo[+\\-\\d]');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), 'foo[+\\-0-9]');
}

function testOrExp() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('a|[+\\-\\d]');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), 'a|[+\\-0-9]');
}

function testRepeatExp() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('\\d{3}');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), '[0-9]{3}');
}

function testGroupExp() {
    let parser = new Parser();
    let transformer = new Transformer();

    let e1 = parser.parseString('(\\d)');
    let t1 = transformer.transform(e1);
    assert.equal(t1.toString(), '([0-9])');
}

function testTransformer() {
    testChar();
    testMetaChar();
    testCharSet();
    testSeqExp();
    testOrExp();
    testRepeatExp();
    testGroupExp();

    console.log('testTransformer() passed.');
}

export { testTransformer };
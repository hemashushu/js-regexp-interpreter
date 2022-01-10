/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Builder } from '../src/builder/index.js';
import { Transformer } from '../src/interpreter/transformer.js'

function testCodePointChar() {
    let t = new Transformer();

    let e1 = Builder.char('a');
    let t1 = t.transform(e1);
    assert.equal(t1.toString(), 'a');

    let e2 = Builder.char('*'); // escape char
    let t2 = t.transform(e2);
    assert.equal(t2.toString(), '\\*');

    let e3 = Builder.unicodeChar(0x6587);
    let t3 = t.transform(e3);
    assert.equal(t3.toString(), '\\u{6587}');
}

function testMetaChar() {
    let t = new Transformer();

    let e1 = Builder.metaChar('n');
    let t1 = t.transform(e1);
    assert.equal(t1.toString(), '\\u{000a}');

    let e2 = Builder.metaChar('w');
    let t2 = t.transform(e2);
    assert.equal(t2.toString(), '[A-Za-z0-9_]');

    let e3 = Builder.metaChar('W');
    let t3 = t.transform(e3);
    assert.equal(t3.toString(), '[^A-Za-z0-9_]');

    let e4 = Builder.metaChar('s');
    let t4 = t.transform(e4);
    assert.equal(t4.toString(),
        '[ \\u{000c}\\u{000a}\\u{000d}\\u{0009}\\u{000b}\\u{00a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}\\u{2029}\\u{202f}\\u{205f}\\u{3000}\\u{feff}]');
}

function testCharSet() {
    let t = new Transformer();

    let e1 = Builder.charSet()
        .addChar('a')
        .addChar('b')
        .build();

    let t1 = t.transform(e1);
    assert.equal(t1.toString(), '[ab]');

    let e2 = Builder.charSet()
        .addMetaChar('w')
        .addChar('-')
        .build();

    let t2 = t.transform(e2);
    assert.equal(t2.toString(), '[A-Za-z0-9_-]');

    let e3 = Builder.charSet()
        .addChar('文')
        .addMetaChar('w')
        .addChar('-')
        .build();

    let t3 = t.transform(e3);
    assert.equal(t3.toString(), '[文A-Za-z0-9_-]');
}

function testSeqExp() {
    let t = new Transformer();

    let e1 = Builder.seqExp()
        .addChars('foo')
        .addCharSet()
            .addChar('+')
            .addChar('-')
            .addMetaChar('d')
            .build()
        .build();

    let t1 = t.transform(e1);
    assert.equal(t1.toString(), 'foo[+\\-0-9]');
}

function testOrExp() {
    let t = new Transformer();

    let e1 = Builder.orExp()
        .addChar('a')
        .addCharSet()
            .addChar('+')
            .addChar('-')
            .addMetaChar('d')
            .build()
        .build();

    let t1 = t.transform(e1);
    assert.equal(t1.toString(), 'a|[+\\-0-9]');
}

function testRepeatExp() {
    let t = new Transformer();

    let e1 = Builder.repeatExp()
        .metaChar('d')
        .range(3, 3)
        .build();

    let t1 = t.transform(e1);
    assert.equal(t1.toString(), '[0-9]{3}');
}

function testGroupExp() {
    let t = new Transformer();

    let e1 = Builder.groupExp()
        .metaChar('d')
        .build();

    let t1 = t.transform(e1);
    assert.equal(t1.toString(), '([0-9])');
}

function testTransformer() {
    testCodePointChar();
    testMetaChar();
    testCharSet();
    testSeqExp();
    testOrExp();
    testRepeatExp();
    testGroupExp();

    console.log('testTransformer() passed.');
}

export { testTransformer };
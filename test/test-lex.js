/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import {
    Lex,

    CharToken,
    UnicodeToken,
    CharSetToken,
    EntityToken,
    MetaToken,
    QuantityToken
} from '../src/lex/index.js';

function testChar() {
    let lex = new Lex();

    // 普通字符

    let t1 = lex.lexChars(stringToCharArray('abc你好'));
    assert.deepEqual(t1, [
        new CharToken('a'),
        new CharToken('b'),
        new CharToken('c'),
        new CharToken('你'),
        new CharToken('好')
    ]);

    // 编码字符

    let t2 = lex.lexChars(stringToCharArray('\\(\\*'));
    assert.deepEqual(t2, [
        new CharToken('('),
        new CharToken('*'),
    ]);

    // unicode 字符

    let t3 = lex.lexChars(stringToCharArray('\\u{4e2d}\\u{6587}\\u{0200D3}'));
    assert.deepEqual(t3, [
        new UnicodeToken(0x4e2d),
        new UnicodeToken(0x6587),
        new UnicodeToken(0x200d3)
    ]);

    // 实体字符
    let t4 = lex.lexChars(stringToCharArray('(a|b)'));
    assert.deepEqual(t4, [
        new EntityToken('('),
        new CharToken('a'),
        new EntityToken('|'),
        new CharToken('b'),
        new EntityToken(')')
    ]);

    // 元字符
    let t5 = lex.lexChars(stringToCharArray('0\\w.'));
    assert.deepEqual(t5, [
        new CharToken('0'),
        new MetaToken('w'),
        new MetaToken('.'),
    ]);
}

function testCharSet() {
    let lex = new Lex();

    // 普通字符

    let t1 = lex.lexChars(stringToCharArray('a[01]b'));
    assert.deepEqual(t1, [
        new CharToken('a'),
        new CharSetToken([
            new CharToken('0'),
            new CharToken('1'),
        ]),
        new CharToken('b')
    ]);

    // 编码字符

    let t2 = lex.lexChars(stringToCharArray('[-*+?.{}()[\\]\\-^$|\\\\]'));
    assert.deepEqual(t2, [
        new CharSetToken([
            new CharToken('-'),
            new CharToken('*'),
            new CharToken('+'),
            new CharToken('?'),
            new CharToken('.'),
            new CharToken('{'),
            new CharToken('}'),
            new CharToken('('),
            new CharToken(')'),
            new CharToken('['),
            new CharToken(']'),
            new CharToken('-'),
            new CharToken('^'),
            new CharToken('$'),
            new CharToken('|'),
            new CharToken('\\'),
        ])
    ]);

    // unicode 字符

    let t3 = lex.lexChars(stringToCharArray('[\\u{4e2d}\\u{6587}\\u{0200D3}]'));
    assert.deepEqual(t3, [
        new CharSetToken([
            new UnicodeToken(0x4e2d),
            new UnicodeToken(0x6587),
            new UnicodeToken(0x200d3)
        ])
    ]);

    // 实体字符
    let t4 = lex.lexChars(stringToCharArray('[0-9]'));
    assert.deepEqual(t4, [
        new CharSetToken([
            new CharToken('0'),
            new EntityToken('-'),
            new CharToken('9'),
        ])
    ]);

    let t5 = lex.lexChars(stringToCharArray('[^ab]'));
    assert.deepEqual(t5, [
        new CharSetToken([
            new EntityToken('^'),
            new CharToken('a'),
            new CharToken('b'),
        ])
    ]);

    // 元字符
    let t6 = lex.lexChars(stringToCharArray('[0\\w\\s]'));
    assert.deepEqual(t6, [
        new CharSetToken([
            new CharToken('0'),
            new MetaToken('w'),
            new MetaToken('s')
        ])
    ]);
}

function testQuantifier() {
    let lex = new Lex();

    let t1 = lex.lexChars(stringToCharArray('a*b'));
    assert.deepEqual(t1, [
        new CharToken('a'),
        new QuantityToken('*'),
        new CharToken('b')
    ]);

    let t2 = lex.lexChars(stringToCharArray('a*?b'));
    assert.deepEqual(t2, [
        new CharToken('a'),
        new QuantityToken('*', false),
        new CharToken('b')
    ]);

    let t3 = lex.lexChars(stringToCharArray('a{2,4}b'));
    assert.deepEqual(t3, [
        new CharToken('a'),
        new QuantityToken('{m,n}', true, 2, 4),
        new CharToken('b')
    ]);

    let t4 = lex.lexChars(stringToCharArray('a{2,}b'));
    assert.deepEqual(t4, [
        new CharToken('a'),
        new QuantityToken('{m,}', true, 2),
        new CharToken('b')
    ]);

    let t5 = lex.lexChars(stringToCharArray('a{2}b'));
    assert.deepEqual(t5, [
        new CharToken('a'),
        new QuantityToken('{m}', true, 2),
        new CharToken('b')
    ]);
}

function testLex() {
    testChar();
    testCharSet();
    testQuantifier();

    console.log('testLex() passed.');
}

/**
 * 将字符串转换为 Unicode 字符数组
 * @param {*} str
 */
function stringToCharArray(str) {
    let chars = [];
    for (const c of str) {
        chars.push(c);
    }
    return chars;
}

export { testLex };
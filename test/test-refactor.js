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
    GroupToken,
} from '../src/lex/index.js';

import { Refactor } from '../src/parser/refactor.js';

// TODO:: 挪到 test-parser.js

function testFoldTokens() {
    let lex = new Lex();
    let refactor = new Refactor();

    let t1 = lex.lexChars(stringToCharArray('ab'));
    let { groupToken: g1 } = refactor.refactorTokens(t1, 0);
    assert.deepEqual(g1, new GroupToken([
        new CharToken('a'),
        new CharToken('b')
    ]));

    let t2 = lex.lexChars(stringToCharArray('a(01)b'));
    let { groupToken: g2 } = refactor.refactorTokens(t2, 0);
    assert.deepEqual(g2, new GroupToken([
        new CharToken('a'),
        new GroupToken([
            new CharToken('0'),
            new CharToken('1')
        ]),
        new CharToken('b')
    ]));

    let t3 = lex.lexChars(stringToCharArray('a(0)b(1)c'));
    let { groupToken: g3 } = refactor.refactorTokens(t3, 0);
    assert.deepEqual(g3, new GroupToken([
        new CharToken('a'),
        new GroupToken([
            new CharToken('0'),
        ]),
        new CharToken('b'),
        new GroupToken([
            new CharToken('1'),
        ]),
        new CharToken('c'),
    ]));

    let t4 = lex.lexChars(stringToCharArray('a(0(\\*)1)b(2)c'));
    let { groupToken: g4 } = refactor.refactorTokens(t4, 0);
    assert.deepEqual(g4, new GroupToken([
        new CharToken('a'),
        new GroupToken([
            new CharToken('0'),
            new GroupToken([
                new CharToken('*')
            ]),
            new CharToken('1'),
        ]),
        new CharToken('b'),
        new GroupToken([
            new CharToken('2'),
        ]),
        new CharToken('c'),
    ]));
}

function testRefactor() {
    testFoldTokens();

    console.log('testRefactor() passed.')
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

export { testRefactor };
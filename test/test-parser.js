/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Parser } from '../src/parser/index.js';

function testParser() {
    let parser = new Parser();

    let exps = [
        // testChar
        'a',
        '中',
        '\\*',

        // testMetaChar
        '\\w',

        // testUnicodeChar
        '\\u{6587}',
        '\\u{0200d3}',

        // testCharSet
        '[abc]',
        '[*+?.{}()[\\]^$\\\\|-]',
        '[0-9]',
        '[+0-9A-F]',
        '[0-9\\w]',
        '[^ab]',

        // testSeqExp
        'abc',
        '你好',
        '0x[a-f]',

        // testOrExp
        'a|b',
        'a|[0-9]',

        // testRepeatExp
        'a*',
        'a+',
        'a?',
        'a{2,4}',
        'a{5,}',
        'a{5}',
        '[a-z]+',
        'a+?',

        // testGroupExp
        '(a)',
        '([0-9])',

        // testGroupExpComplex
        '(ab)',
        '(a|b)',
        '(a*)',

        // testSeqExpComplex
        'ab?',
        'a(x|y)',

        // testOrExpComplex
        'a|foo|bar',
        'a|b+',
        '(foo)|(bar)',

        // testRepeatExpComplex
        '(foo){1,3}',
    ];

    for (let e of exps) {
        let n = parser.parseString(e);
        assert.equal(n.toString(), e);
    }

    console.log('testParser() passed.')
}

export { testParser };
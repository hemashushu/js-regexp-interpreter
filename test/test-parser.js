/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Parser } from '../src/parser/index.js';

import {
    SimpleChar,
    UnicodeChar,

    MetaChar,
    CharSet,

    AlternativeExp,
    DisjunctionExp,
    GroupExp,
    RepetitionExp,

    CharRange,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
} from '../src/ast/index.js';

function testChar() {
    let parser = new Parser();

    // simple char
    let e1 = parser.parseString('a');
    assert.deepEqual(e1, new SimpleChar('a'));
    assert.equal(e1.value, 'a');
    assert.equal(e1.codePoint, 97);
    assert.equal(e1.toString(), 'a');

    let e2 = parser.parseString('中');
    assert.deepEqual(e2, new SimpleChar('中'));
    assert.equal(e2.value, '中');
    assert.equal(e2.codePoint, 20013);
    assert.equal(e2.toString(), '中');

    // entity char
    let e3 = parser.parseString('\\*');
    assert.deepEqual(e3, new SimpleChar('*'));
    assert.equal(e3.value, '*');
    assert.equal(e3.codePoint, 42);
    assert.equal(e3.toString(), '\\*');
}

function testUnicodeChar() {
    let parser = new Parser();

    let e1 = parser.parseString('\\u{6587}');
    assert.deepEqual(e1, new UnicodeChar(0x6587));
    assert.equal(e1.value, '文');
    assert.equal(e1.codePoint, 0x6587);
    assert.equal(e1.toString(), '\\u{6587}');

    let e2 = parser.parseString('\\u{2764}');
    assert.deepEqual(e2, new UnicodeChar(0x2764));
    assert.equal(e2.value, '❤');
    assert.equal(e2.codePoint, 0x2764);
    assert.equal(e2.toString(), '\\u{2764}');
}

function testMetaChar() {
    let parser = new Parser();

    let e1 = parser.parseString('\\w');
    assert.deepEqual(e1, new MetaChar('w'));
    assert.equal(e1.meta, 'w');
    assert.equal(e1.toString(), '\\w');
}

function testCharSet() {
    let parser = new Parser();

    let e1 = parser.parseString('[abc]');
    assert.deepEqual(e1, new CharSet([
        new SimpleChar('a'),
        new SimpleChar('b'),
        new SimpleChar('c')]));

    assert.equal(e1.toString(), '[abc]');

    // 实体字符
    // 符号 `-` 仅在字符集的中间位置才需要编码
    let e2 = parser.parseString('[*+?.{}()[\\]^$\\\\|-]');
    assert.equal(e2.toString(), '[*+?.{}()[\\]^$\\\\|-]');

    // 字符范围
    let e3 = parser.parseString('[0-9]');
    assert.deepEqual(e3, new CharSet([
        new CharRange(
            new SimpleChar('0'),
            new SimpleChar('9')
        )
    ]));

    assert.equal(e3.toString(), '[0-9]');

    // 单字符与字符范围混合
    let e4 = parser.parseString('[+0-9A-F]');
    assert.equal(e4.toString(), '[+0-9A-F]');

    // 包含元字符
    let e5 = parser.parseString('[0-9\\w]');
    assert.equal(e5.toString(), '[0-9\\w]');

    // "非" 字符集
    let e6 = parser.parseString('[^ab]');
    assert.deepEqual(e6, new CharSet([
        new SimpleChar('a'),
        new SimpleChar('b')
    ], true));

    assert.equal(e6.toString(), '[^ab]');
}

function testSeqExp() {
    let parser = new Parser();

    let e1 = parser.parseString('abc');
    assert.deepEqual(e1, new AlternativeExp([
        new SimpleChar('a'),
        new SimpleChar('b'),
        new SimpleChar('c')
    ]));

    assert.equal(e1.toString(), 'abc');

    let e2 = parser.parseString('你好');
    assert.deepEqual(e2, new AlternativeExp([
        new SimpleChar('你'),
        new SimpleChar('好')
    ]));

    assert.equal(e2.toString(), '你好');

    // 单字符和范围字符混合

    let e3 = parser.parseString('0x[a-f]');
    assert.deepEqual(e3, new AlternativeExp([
        new SimpleChar('0'),
        new SimpleChar('x'),
        new CharSet([
            new CharRange(
                new SimpleChar('a'),
                new SimpleChar('f')
            )
        ])
    ]));

    assert.equal(e3.toString(), '0x[a-f]');
}

function testOrExp() {
    let parser = new Parser();
    let e1 = parser.parseString('a|b');

    assert.deepEqual(e1, new DisjunctionExp([
        new SimpleChar('a'),
        new SimpleChar('b')
    ]));

    assert.equal(e1.toString(), 'a|b');

    // 单字符和范围字符混合
    let e2 = parser.parseString('a|[0-9]');
    assert.deepEqual(e2, new DisjunctionExp([
        new SimpleChar('a'),
        new CharSet([
            new CharRange(
                new SimpleChar('0'),
                new SimpleChar('9')
            )
        ])
    ]));

    assert.equal(e2.toString(), 'a|[0-9]');
}

function testRepeatExp() {
    let parser = new Parser();

    // A*
    let e1 = parser.parseString('a*');
    assert.deepEqual(e1, new RepetitionExp(
        new SimpleChar('a'),
        new ZeroOrMoreQuantifier()
    ));

    assert.equal(e1.toString(), 'a*');

    // A+
    let e2 = parser.parseString('a+');
    assert.deepEqual(e2, new RepetitionExp(
        new SimpleChar('a'),
        new OneOrMoreQuantifier()
    ));

    assert.equal(e2.toString(), 'a+');

    // A?
    let e3 = parser.parseString('a?');
    assert.deepEqual(e3, new RepetitionExp(
        new SimpleChar('a'),
        new OneOrZeroQuantifier()
    ));

    assert.equal(e3.toString(), 'a?');

    // A{m, n}
    let e4 = parser.parseString('a{2,4}');
    assert.deepEqual(e4, new RepetitionExp(
        new SimpleChar('a'),
        new RangeQuantifier(2, 4)
    ));

    assert.equal(e4.toString(), 'a{2,4}');

    // A{m,}
    let e5 = parser.parseString('a{5,}');
    assert.deepEqual(e5, new RepetitionExp(
        new SimpleChar('a'),
        new ManyTimesOrMoreQuantifier(5)
    ));

    assert.equal(e5.toString(), 'a{5,}');

    // A{m}
    let e6 = parser.parseString('a{5}');
    assert.deepEqual(e6, new RepetitionExp(
        new SimpleChar('a'),
        new ManyTimesQuantifier(5)
    ));

    assert.equal(e6.toString(), 'a{5}');

    // 单字符和范围字符混合
    let e7 = parser.parseString('[a-z]+');
    assert.deepEqual(e7, new RepetitionExp(
        new CharSet([
            new CharRange(
                new SimpleChar('a'),
                new SimpleChar('z')
            )]
        ),
        new OneOrMoreQuantifier()
    ));

    assert.equal(e7.toString(), '[a-z]+');

    // 设定非贪婪模式
    let e8 = parser.parseString('a+?');
    assert.deepEqual(e8, new RepetitionExp(
        new SimpleChar('a'),
        new OneOrMoreQuantifier(false)
    ));

    assert.equal(e8.toString(), 'a+?');

}

function testGroupExp() {
    let parser = new Parser();

    let e1 = parser.parseString('(a)');
    assert.deepEqual(e1, new GroupExp(new SimpleChar('a')));
    assert.equal(e1.toString(), '(a)');

    let e2 = parser.parseString('([0-9])');
    assert.deepEqual(e2, new GroupExp(new CharSet([
        new CharRange(
            new SimpleChar('0'),
            new SimpleChar('9')
        )])
    ));

    assert.equal(e2.toString(), '([0-9])');
}

function testGroupExpComplex() {
    let parser = new Parser();

    let e1 = parser.parseString('(ab)');
    assert.equal(e1.toString(), '(ab)');

    let e2 = parser.parseString('(a|b)');
    assert.equal(e2.toString(), '(a|b)');

    let e3 = parser.parseString('(a*)');
    assert.equal(e3.toString(), '(a*)');
}

function testSeqExpComplex() {
    let parser = new Parser();

    // combine with repeat exp
    let e1 = parser.parseString('ab?');
    assert.equal(e1.toString(), 'ab?');

    // combine with group exp
    let e2 = parser.parseString('a(x|y)');
    assert.equal(e2.toString(), 'a(x|y)');
}

function testOrExpComplex() {
    let parser = new Parser();

    let e1 = parser.parseString('a|foo|bar');
    assert.equal(e1.toString(), 'a|foo|bar');

    let e2 = parser.parseString('a|b+');
    assert.equal(e2.toString(), 'a|b+');

    let e3 = parser.parseString('(foo)|(bar)');
    assert.equal(e3.toString(), '(foo)|(bar)');
}

function testRepeatExpComplex() {
    let parser = new Parser();

    let e1 = parser.parseString('(foo){1,3}')
    assert.equal(e1.toString(), '(foo){1,3}');
}

function testParser() {
    testChar();
    testMetaChar();
    testUnicodeChar();
    testCharSet();

    testSeqExp();
    testOrExp();
    testRepeatExp();
    testGroupExp();

    testGroupExpComplex();
    testSeqExpComplex();
    testOrExpComplex();
    testRepeatExpComplex();

    console.log('testParser() passed.')
}

export { testParser };
/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

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

import { Builder } from '../src/builder/index.js';

function testChar() {
    // simple char
    let e1 = Builder.char('a');
    assert.deepEqual(e1, new SimpleChar('a'));
    assert.equal(e1.value, 'a');
    assert.equal(e1.codePoint, 97);
    assert.equal(e1.toString(), 'a');

    let e2 = Builder.char('中');
    assert.deepEqual(e2, new SimpleChar('中'));
    assert.equal(e2.value, '中');
    assert.equal(e2.codePoint, 20013);
    assert.equal(e2.toString(), '中');

    // entity char
    let e3 = Builder.char('*');
    assert.deepEqual(e3, new SimpleChar('*'));
    assert.equal(e3.value, '*');
    assert.equal(e3.codePoint, 42);
    assert.equal(e3.toString(), '\\*');
}

function testMetaChar() {
    let e1 = Builder.metaChar('w');
    assert.deepEqual(e1, new MetaChar('w'));
    assert.equal(e1.meta, 'w');
    assert.equal(e1.toString(), '\\w');
}

function testUnicodeChar() {
    let e1 = Builder.unicodeChar(0x6587);
    assert.deepEqual(e1, new UnicodeChar(0x6587));
    assert.equal(e1.value, '文');
    assert.equal(e1.codePoint, 0x6587);
    assert.equal(e1.toString(), '\\u{6587}');

    let e2 = Builder.unicodeChar(0x2764);
    assert.deepEqual(e2, new UnicodeChar(0x2764));
    assert.equal(e2.value, '❤');
    assert.equal(e2.codePoint, 0x2764);
    assert.equal(e2.toString(), '\\u{2764}');
}

function testCharSet() {
    let e1 = Builder.charSet()
        .addChar('a')
        .addChar('b')
        .addChar('c')
        .build();

    assert.deepEqual(e1, new CharSet([
        new SimpleChar('a'),
        new SimpleChar('b'),
        new SimpleChar('c')]));

    assert.equal(e1.toString(), '[abc]');

    // 实体字符
    let e2 = Builder.charSet()
        .addChar('*')
        .addChar('+')
        .addChar('?')
        .addChar('.')
        .addChar('{')
        .addChar('}')
        .addChar('(')
        .addChar(')')
        .addChar('[')
        .addChar(']')
        .addChar('^')
        .addChar('$')
        .addChar('\\')
        .addChar('|')
        .addChar('-') // 符号 `-` 仅在字符集的中间位置才需要编码
        .build();

    assert.equal(e2.toString(), '[*+?.{}()[\\]^$\\\\|-]');

    // 字符范围

    let e3 = Builder.charSet()
        .addRange()
            .fromChar('0')
            .toChar('9')
            .build()
        .build();

    assert.deepEqual(e3, new CharSet([
        new CharRange(
            new SimpleChar('0'),
            new SimpleChar('9')
        )
    ]));

    assert.equal(e3.toString(), '[0-9]');

    // 单字符与字符范围混合

    let e4 = Builder.charSet()
        .addChar('+')
        .addRange()
            .fromChar('0')
            .toChar('9')
            .build()
        .addRange()
            .fromChar('A')
            .toChar('F')
            .build()
        .build();

    assert.equal(e4.toString(), '[+0-9A-F]');

    // "非" 字符集

    let e5 = Builder.charSet(true)
        .addChar('a')
        .addChar('b')
        .build();


    assert.deepEqual(e5, new CharSet([
        new SimpleChar('a'),
        new SimpleChar('b')
    ], true));

    assert.equal(e5.toString(), '[^ab]');
}

function testSeqExp() {
    let e1 = Builder.seqExp()
        .addChar('a')
        .addChar('b')
        .addChar('c')
        .build();

    assert.deepEqual(e1, new AlternativeExp([
        new SimpleChar('a'),
        new SimpleChar('b'),
        new SimpleChar('c')
    ]));

    assert.equal(e1.toString(), 'abc');

    // test addChars()

    let e2 = Builder.seqExp()
        .addChars('你好')
        .build();

    assert.deepEqual(e2, new AlternativeExp([
        new SimpleChar('你'),
        new SimpleChar('好')
    ]));

    assert.equal(e2.toString(), '你好');

    // 单字符和范围字符混合

    let e3 = Builder.seqExp()
        .addChar('0')
        .addChar('x')
        .addCharSet()
            .addRange()
                .fromChar('a')
                .toChar('f')
                .build()
            .build()
        .build();

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
    let e1 = Builder.orExp()
        .addChar('a')
        .addChar('b')
        .build();

    assert.deepEqual(e1, new DisjunctionExp([
        new SimpleChar('a'),
        new SimpleChar('b')
    ]));

    assert.equal(e1.toString(), 'a|b');

    // 单字符和范围字符混合

    let e2 = Builder.orExp()
        .addChar('a')
            .addCharSet()
                .addRange()
                    .fromChar('0')
                    .toChar('9')
                    .build()
                .build()
        .build();

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
    // A*
    let e1 = Builder.repeatExp()
        .char('a')
        .zeroOrMore()
        .build();

    assert.deepEqual(e1, new RepetitionExp(
        new SimpleChar('a'),
        new ZeroOrMoreQuantifier()
    ));

    assert.equal(e1.toString(), 'a*');

    // A+
    let e2 = Builder.repeatExp()
        .char('a')
        .oneOrMore()
        .build();

    assert.deepEqual(e2, new RepetitionExp(
        new SimpleChar('a'),
        new OneOrMoreQuantifier()
    ));

    assert.equal(e2.toString(), 'a+');

    // A?
    let e3 = Builder.repeatExp()
        .char('a')
        .oneOrZero()
        .build();

    assert.deepEqual(e3, new RepetitionExp(
        new SimpleChar('a'),
        new OneOrZeroQuantifier()
    ));

    assert.equal(e3.toString(), 'a?');

    // A{m, n}
    let e4 = Builder.repeatExp()
        .char('a')
        .range(2, 4)
        .build();

    assert.deepEqual(e4, new RepetitionExp(
        new SimpleChar('a'),
        new RangeQuantifier(2, 4)
    ));

    assert.equal(e4.toString(), 'a{2,4}');

    // A{m,}
    let e5 = Builder.repeatExp()
        .char('a')
        .manyTimesOrMore(5)
        .build();

    assert.deepEqual(e5, new RepetitionExp(
        new SimpleChar('a'),
        new ManyTimesOrMoreQuantifier(5)
    ));

    assert.equal(e5.toString(), 'a{5,}');

    // A{m}
    let e6 = Builder.repeatExp()
        .char('a')
        .manyTimes(5)
        .build();

    assert.deepEqual(e6, new RepetitionExp(
        new SimpleChar('a'),
        new ManyTimesQuantifier(5)
    ));

    assert.equal(e6.toString(), 'a{5}');

    // 单字符和范围字符混合
    let e7 = Builder.repeatExp()
        .charSet()
            .addRange()
                .fromChar('a')
                .toChar('z')
                .build()
            .build()
        .oneOrMore()
        .build();

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
    let e8 = Builder.repeatExp()
        .char('a')
        .oneOrMore(false)
        .build();

    assert.deepEqual(e8, new RepetitionExp(
        new SimpleChar('a'),
        new OneOrMoreQuantifier(false)
    ));

    assert.equal(e8.toString(), 'a+?');

}

function testGroupExp() {
    let e1 = Builder.groupExp()
        .char('a')
        .build();

    assert.deepEqual(e1, new GroupExp(new SimpleChar('a')));
    assert.equal(e1.toString(), '(a)');

    let e2 = Builder.groupExp()
        .charSet()
        .addRange()
        .fromChar('0')
        .toChar('9')
        .build()
        .build()
        .build();

    assert.deepEqual(e2, new GroupExp(new CharSet([
        new CharRange(
            new SimpleChar('0'),
            new SimpleChar('9')
        )])
    ));

    assert.equal(e2.toString(), '([0-9])');
}

function testGroupExpComplex() {
    let e1 = Builder.groupExp()
        .seqExp()
        .addChar('a')
        .addChar('b')
        .build()
        .build();

    assert.equal(e1.toString(), '(ab)');

    let e2 = Builder.groupExp()
        .orExp()
        .addChar('a')
        .addChar('b')
        .build()
        .build();

    assert.equal(e2.toString(), '(a|b)');

    let e3 = Builder.groupExp()
        .repeatExp()
        .char('a')
        .zeroOrMore()
        .build()
        .build();

    assert.equal(e3.toString(), '(a*)');
}

function testSeqExpComplex() {
    // combine with repeat exp
    let e1 = Builder.seqExp()
        .addChar('a')
        .addRepeatExp()
        .char('b')
        .oneOrZero()
        .build()
        .build();

    assert.equal(e1.toString(), 'ab?');

    // combine with group exp
    let e2 = Builder.seqExp()
        .addChar('a')
        .addGroupExp()
        .orExp()
        .addChar('x')
        .addChar('y')
        .build()
        .build()
        .build();

    assert.equal(e2.toString(), 'a(x|y)');
}

function testOrExpComplex() {
    let e1 = Builder.orExp()
        .addChar('a')
        .addSeqExp()
            .addChars('foo')
            .build()
        .addSeqExp()
            .addChars('bar')
            .build()
        .build();

    assert.equal(e1.toString(), 'a|foo|bar');

    let e2 = Builder.orExp()
        .addChar('a')
        .addRepeatExp()
            .char('b')
            .oneOrMore()
            .build()
        .build();

    assert.equal(e2.toString(), 'a|b+');

    let e3 = Builder.orExp()
        .addGroupExp()
            .seqExp()
                .addChars('foo')
                .build()
            .build()
        .addGroupExp()
            .seqExp()
                .addChars('bar')
                .build()
            .build()
        .build();

    assert.equal(e3.toString(), '(foo)|(bar)');
}

function testRepeatExpComplex() {
    let e1 = Builder.repeatExp()
        .groupExp()
            .seqExp()
                .addChars('foo')
                .build()
            .build()
        .range(1,3)
        .build();

    assert.equal(e1.toString(), '(foo){1,3}');
}

function testBuilder() {
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

    console.log('testBuilder() passed.')
}

export { testBuilder };
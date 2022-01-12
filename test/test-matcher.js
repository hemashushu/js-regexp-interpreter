/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { Matcher } from '../src/interpreter/index.js';

function testA() {
    assert.equal(Matcher.test('a', 'a'), true);
    assert.equal(Matcher.test('a', 'b'), false);
    assert.equal(Matcher.test('a', ''), false);

    assert.equal(Matcher.test('', ''), true);
    assert.equal(Matcher.test('', 'a'), false);

    assert.equal(Matcher.test('\\w', 'a'), true);
    assert.equal(Matcher.test('\\w', '8'), true);
    assert.equal(Matcher.test('\\w', '*'), false);

    assert.equal(Matcher.test('[a-f\\d]', 'c'), true);
    assert.equal(Matcher.test('[a-f\\d]', '5'), true);
    assert.equal(Matcher.test('[a-f\\d]', 'm'), false);

    assert.equal(Matcher.test('[文\\u{2764}]', '文'), true);
    assert.equal(Matcher.test('[文\\u{2764}]', '❤'), true);
    assert.equal(Matcher.test('[文\\u{2764}]', 'a'), false);

    assert.equal(Matcher.test('[^ab]', 'c'), true);
    assert.equal(Matcher.test('[^ab]', 'a'), false);
    assert.equal(Matcher.test('[^ab]', 'b'), false);
}

function testArepetition() {
    assert.equal(Matcher.test('a+', 'a'), true);
    assert.equal(Matcher.test('a+', 'aa'), true);
    assert.equal(Matcher.test('a+', 'ab'), false);
    assert.equal(Matcher.test('a+', 'ba'), false);

    assert.equal(Matcher.test('a?', 'a'), true);
    assert.equal(Matcher.test('a?', ''), true);
    assert.equal(Matcher.test('a?', 'b'), false);
    assert.equal(Matcher.test('a?', 'ba'), false);

    assert.equal(Matcher.test('a*', 'a'), true);
    assert.equal(Matcher.test('a*', 'aa'), true);
    assert.equal(Matcher.test('a*', ''), true);
    assert.equal(Matcher.test('a*', 'b'), false);
    assert.equal(Matcher.test('a*', 'ba'), false);
}

function testAB() {
    assert.equal(Matcher.test('ab', 'ab'), true);
    assert.equal(Matcher.test('ab', 'a'), false);
    assert.equal(Matcher.test('ab', 'b'), false);
    assert.equal(Matcher.test('ab', 'abc'), false);

    assert.equal(Matcher.test('a\\db', 'a5b'), true);
    assert.equal(Matcher.test('a\\db', 'a'), false);
    assert.equal(Matcher.test('a\\db', 'ab'), false);
    assert.equal(Matcher.test('a\\db', 'axb'), false);
    assert.equal(Matcher.test('a\\db', 'a5bc'), false);

    assert.equal(Matcher.test('ab*c', 'ac'), true);
    assert.equal(Matcher.test('ab*c', 'abc'), true);
    assert.equal(Matcher.test('ab*c', 'abbc'), true);
    assert.equal(Matcher.test('ab*c', 'a'), false);
    assert.equal(Matcher.test('ab*c', 'ab'), false);
    assert.equal(Matcher.test('ab*c', 'abcd'), false);
}

function testAorB() {
    assert.equal(Matcher.test('a|b', 'a'), true);
    assert.equal(Matcher.test('a|b', 'b'), true);
    assert.equal(Matcher.test('a|b', 'c'), false);
    assert.equal(Matcher.test('a|b', 'ab'), false);

    assert.equal(Matcher.test('a|xy|b+', 'a'), true);
    assert.equal(Matcher.test('a|xy|b+', 'xy'), true);
    assert.equal(Matcher.test('a|xy|b+', 'b'), true);
    assert.equal(Matcher.test('a|xy|b+', 'bb'), true);
    assert.equal(Matcher.test('a|xy|b+', '5'), false);
    assert.equal(Matcher.test('a|xy|b+', 'm'), false);
    assert.equal(Matcher.test('a|xy|b+', 'xyz'), false);
    assert.equal(Matcher.test('a|xy|b+', 'ab'), false);

}

function testGroup() {
    assert.equal(Matcher.test('(a)', 'a'), true);
    assert.equal(Matcher.test('(a)', 'b'), false);
    assert.equal(Matcher.test('(a)', ''), false);

    assert.equal(Matcher.test('a(b)', 'ab'), true);
    assert.equal(Matcher.test('a(b)', 'a'), false);
    assert.equal(Matcher.test('a(b)', 'b'), false);
    assert.equal(Matcher.test('a(b)', 'm'), false);
    assert.equal(Matcher.test('a(b)', 'ba'), false);

    assert.equal(Matcher.test('(a)(b)', 'ab'), true);
    assert.equal(Matcher.test('(a)(b)', 'a'), false);
    assert.equal(Matcher.test('(a)(b)', 'b'), false);
    assert.equal(Matcher.test('(a)(b)', 'm'), false);
    assert.equal(Matcher.test('(a)(b)', 'ba'), false);

    assert.equal(Matcher.test('(a(b)c)', 'abc'), true);
    assert.equal(Matcher.test('(a(b)c)', 'a'), false);
    assert.equal(Matcher.test('(a(b)c)', 'b'), false);
    assert.equal(Matcher.test('(a(b)c)', 'c'), false);
    assert.equal(Matcher.test('(a(b)c)', 'ac'), false);
    assert.equal(Matcher.test('(a(b)c)', 'acb'), false);
    assert.equal(Matcher.test('(a(b)c)', 'bac'), false);

    assert.equal(Matcher.test('(ab)|(xy)', 'ab'), true);
    assert.equal(Matcher.test('(ab)|(xy)', 'xy'), true);
    assert.equal(Matcher.test('(ab)|(xy)', 'abxy'), false);

    assert.equal(Matcher.test('(ab)*', 'ab'), true);
    assert.equal(Matcher.test('(ab)*', 'abab'), true);
    assert.equal(Matcher.test('(ab)*', ''), true);
    assert.equal(Matcher.test('(ab)*', 'abc'), false);
    assert.equal(Matcher.test('(ab)*', 'ababc'), false);
    assert.equal(Matcher.test('(ab)*', 'abcab'), false);
}

function testMatcher() {
    testA();
    testArepetition();
    testAB();
    testAorB();
    testGroup();
}

export { testMatcher };
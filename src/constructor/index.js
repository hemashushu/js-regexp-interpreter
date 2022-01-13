/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * 使用函数的方式构建正则表达式的语法树
 *
 * assertions
 * ----------
 *
 * startOfLine() -> ^
 * endOfLine() -> $
 * wordBoundary() -> \b
 * startsWith(S) -> (?<=) lookbehind, e.g. /(?<=0x)[a-f0-9]+/
 * notStartsWith(S) -> (?<!) lookbehind negative, e.g. /(?<!-)\d+/
 * endsWith(S) -> (?=) lookahead, e.g. /shift(?=left|right)/
 * notEndsWith(S) -> (?!) lookahead negative
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet#other_assertions
 *
 * meta
 * ----
 * anyChar -> .
 * ?newPage -> \f
 * newLine -> \n
 * return -> \r
 * tab -> \t
 * ?verticalTab -> \v
 * wordChar -> \w
 * nonWordChar -> \W
 * digit -> \d
 * nonDigit -> \D
 * space -> \s
 * nonSpace -> \S
 *
 * char set
 * --------
 * oneCharOf(Char[]/Range[]) -> [C1C2Cn]
 * notCharOf(Char[]/Range[]) -> [^C1C2Cn]
 * range(startChar, endChar) -> Range
 *
 * ? anything() -> .*
 * ? anythingBut(Char[]) -> [^C1C2Cn]*
 * ? something() -> .+
 * ? somethingBut(Char[]) -> [^C1C2Cn]+
 *
 * repetition
 * ----------
 * maybe(S) -> ?
 * oneOrMore(S) -> +
 * zeroOrMore(S) -> *
 * repeat(S, i) -> {i}
 * repeat(S, from, to) -> {m,n}
 * atLeast(S, i) -> {i,}
 *
 * expression(concat/or/group)
 * ---------------------------
 * then(S) -> S
 * or(S1, S2, ...Sn) -> |
 * group(S, name?, capture?) -> (...)
 *
 * 例子：
 * let ast = C
 *  .startOfLine()
 *  .then('http')
 *  .maybe('s')
 *  .then('://')
 *  .oneOrMore(C.wordChar)
 *  .endOfLine()
 *  .build();
 */
class Constructor {

}
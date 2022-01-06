/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Char } from './char.js';

const MetaChars = [
    '.',
    'f', 'r', 'n', 't', 'v', '0', 'b',
    's', 'S', 'w', 'W'];

/**
 *
 * 正则的元字符有：
 * - \f, \r, \n, \t, \v, \0, [\b] (backspace char)
 *   以上表示转义字符。
 *
 * - .
 *   在单行模式（single line, dot all）下，匹配包括 \n 在内的所有字符，否则匹配除了 \n 之外的字符。
 *
 * - \s, \S, \w, \W, \d, \D.
 *   \s 表示 [ \f\n\r\t\v]
 *   \S 表示 [^ \f\n\r\t\v]
 *   \w 表示 [A-Za-z0-9_]
 *   \W 表示 [^A-Za-z0-9_]
 *
 * 注意：
 * - 单独的 \b 和 \B 是断言，不是字符
 * - 元字符没有对应的 codePoint
 *
 * 参考：
 * https://github.com/DmitrySoshnikov/regexp-tree#meta-char
 */
class MetaChar extends Char {
    /**
     *
     * @param {*} meta 元字符（不带前缀反斜杠符号）
     */
    constructor(meta) {
        super();
        this.meta = meta;
    }

    toString() {
        return '\\' + this.meta;
    }
}

export { MetaChar, MetaChars };
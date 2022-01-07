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
    's', 'S', 'w', 'W', 'd', 'D'];

/**
 * 详细参考：
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
 *
 * 正则的元字符有：
 * - \f, \r, \n, \t, \v, \0, [\b] (backspace char)
 *   以上表示转义字符。
 *   https://www.asciitable.com/
 *   \f form-feed/new-page 12 0xC
 *   \r carriage-return 13 0xD
 *   \n new-line 10 0xA
 *   \t horizontal tab 9 0x9
 *   \v vertical tab 11 0xB
 *   \b backspace 8 0x8
 * - .
 *   在单行模式（single line, dot all）下，匹配包括 \n 在内的所有字符，否则匹配除了 \n 之外的字符。
 *
 * - \s, \S, \w, \W, \d, \D.
 *   \s 表示 [ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]
 *   \S 表示非 \s
 *   \w 表示 [A-Za-z0-9_]
 *   \W 表示非 \w
 *   \d 表示 [0-9]
 *   \D 表示非 \d
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

        if (!MetaChars.includes(meta)) {
            throw new Error(`Invalid meta character "${meta}".`);
        }
        this.meta = meta;
    }

    toString() {
        if (this.meta === '.') {
            return '.';
        } else {
            return '\\' + this.meta;
        }
    }
}

export { MetaChar, MetaChars };
/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CodePointChar } from './codepointchar.js';

const EntityChars = [
    '*', '+', '?', '.',
    '{', '}', '(', ')', '[', ']', '-',
    '^', '$', '\\', '|', '$'];

/**
 * 正则表达式里需要编码的实体字符：
 * \*, \+, \?, \.,
 * \{, \}, \(, \), \[, \], \-,
 * \^, \$, \\
 * \|, \#
 */
class EscapedChar extends CodePointChar {
    /**
     *
     * @param {*} value 实体字符，不带前缀反斜杠符号
     */
    constructor(value) {
        super(value, value.codePointAt(0));
    }

    toString() {
        return '\\' + this.value;
    }
}

export { EscapedChar, EntityChars };
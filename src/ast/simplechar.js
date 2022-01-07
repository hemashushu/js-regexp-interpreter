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
    '{', '}', '(', ')', '[', ']',
    '^', '$', '\\', '|'];

const EntityCharsInChatSet = [
    ']', '\\', '-'
];

/**
 * 正则表达式里需要编码（escape）的实体字符：
 * \*, \+, \?, \.,
 * \{, \}, \(, \), \[, \],
 * \^, \$, \\, \|
 *
 * 注意：
 * 在字符集里面，即在 `[...]` 里面，只有 `]`, `\`, 还有处于
 * 中间位置的 `-` 符号才需要编码（escape）。
 *
 * 详细参见：
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 */

class SimpleChar extends CodePointChar {
    constructor(value) {
        super(value, value.codePointAt(0));
    }

    toString() {
        if (EntityChars.includes(this.value)) {
            return '\\' + this.value;
        } else {
            return this.value;
        }
    }
}

export { SimpleChar, EntityChars, EntityCharsInChatSet };
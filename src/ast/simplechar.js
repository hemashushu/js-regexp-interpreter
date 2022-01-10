/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CodePointChar } from './codepointchar.js';

// 正则表达式里需要编码（escape）的实体字符
const EntityChars = [
    '*', '+', '?', '.',
    '{', '}', '(', ')', '[', ']',
    '^', '$', '\\', '|'];

// 在字符集里，即在 `[...]` 里面，必须编码的字符，
// 其中 `-` 符号只有处于中间位置才需要编码。
// 详细参见：
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const EntityCharsRequiredInChatSet = [
    ']', '\\', '-'
];

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

export { SimpleChar, EntityChars, EntityCharsRequiredInChatSet as EntityCharsInChatSet };
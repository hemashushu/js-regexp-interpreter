/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Symbol } from './symbol.js';
import { SimpleChar } from './simplechar.js';

/**
 * 字符集
 *
 * 比如 [...] 或者 [^...]
 */
class CharSet extends Symbol {
    constructor(chars = [], negative = false) {
        super();
        this.chars = chars;
        this.negative = negative; // 表示 [^...]
    }

    /**
     * 在字符集里，特殊符号（正则实体符号）只有 `]`, `\`, 以及不在
     * 头尾的 `-` 符号才需要编码。
     *
     * @returns
     */
    toString() {
        let ss = [];
        for (let idx = 0; idx < this.chars.length; idx++) {
            let char = this.chars[idx];
            if (char instanceof SimpleChar) {
                let value = char.value;
                if (
                    value === ']' ||
                    value === '\\' ||
                    (value === '-' && (idx >= 0 && idx < this.chars.length - 1))) {
                    ss.push('\\' + value);
                } else {
                    ss.push(value);
                }

            } else {
                ss.push(char.toString())
            }
        }

        return '[' +
            (this.negative ? '^' : '') +
            ss.join('') + ']';
    }

    includes(codePoint) {
        let found = false;
        for (let s of this.chars) {
            if (s.includes(codePoint)) {
                found = true;
                break;
            }
        }

        return this.negative ? !found : found;
    }
}

export { CharSet };
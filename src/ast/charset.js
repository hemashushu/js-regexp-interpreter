/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Symbol } from './symbol.js';

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

    toString() {
        let ss = [];
        for (const c of this.chars) {
            ss.push(c.toString())
        }

        return '[' +
            (this.negative ? '^' : '') +
            ss.join('') + ']';
    }

    includes(codePoint) {
        for(let s of this.chars) {
            if (!s.includes(codePoint)) {
                return false;
            }
        }

        return true;
    }
}

export { CharSet };
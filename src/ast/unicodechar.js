/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CodePointChar } from './codepointchar.js';

class UnicodeChar extends CodePointChar {
    /**
     * 字符的 Unicode 码值
     * 范围从 U+0000 到 U+D7FF 以及从 U+E0000 到 U+10FFFF 之间
     * 在正则表达式里使用 `\u{hhhh}` 或者 `\u{hhhhhh}` 的格式表示，
     * 比如 `\u{0061}` 表示 `a`。
     * 暂不支持 `\xhh` 和 `\uhhhh` 这两种写法。
     *
     * @param {*} codePoint
     */
    constructor(codePoint) {
        super(String.fromCodePoint([codePoint]), codePoint);
    }

    toString() {
        // unicode 的表示方式 \u{hhhh} 或者 \u{hhhhhh}
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#types
        let s = Number(this.codePoint).toString(16);
        if (s.length > 4) {
            s = s.padStart(6, '0');
        } else {
            s = s.padStart(4, '0');
        }
        return '\\u{' + s + '}';
    }
}

export { UnicodeChar };
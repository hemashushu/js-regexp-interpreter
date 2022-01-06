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
     * 在正则表达式里使用 /\u{hhhhhh}/ 的格式表示，比如 /\u{61}/u 表示 /a/
     *
     * @param {*} codePoint
     */
    constructor(codePoint) {
        super(String.fromCodePoint([codePoint]), codePoint);
    }

    toString() {
        return '\\u{' + this.codePoint + '}';
    }
}

export { UnicodeChar };
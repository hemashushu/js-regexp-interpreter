/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Char } from './char.js';

/**
 * 表示可显示的字符
 */
class CodePointChar extends Char {

    /**
     *
     * @param {*} value 字符
     * @param {*} codePoint 字符的 Unicode 码值
     */
    constructor(value, codePoint) {
        super();
        this.value = value;
        this.codePoint = codePoint;
    }

    toString() {
        return this.value;
    }

    includes(codePoint) {
        return this.codePoint === codePoint;
    }
}

export { CodePointChar };
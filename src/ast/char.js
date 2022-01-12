/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Symbol } from './symbol.js';

/**
 * 单个字符
 * 比如 /a/
 */
class Char extends Symbol {
    /**
     *
     * @param {*} value 字符
     * @param {*} codePoint 字符的 Unicode 码值
     */
    constructor(value, codePoint) {
        super();
        this.type = 'Char';
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

export { Char };
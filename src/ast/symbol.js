/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * 字符或者字符集
 */
class Symbol {
    constructor() {
        this.type = 'Symbol';
    }

    /**
     * 返回正则表达式的文本
     */
    toString() {
        throw new Error('Not implemented.');
    }

    /**
     * 检查指定的 codePoint 是否：
     * - 等于当前 symbol 的值；
     * - 属于当前的 symbol 范围之内。
     *
     * @param {*} codePoint
     */
    includes(codePoint) {
        throw new Error('Not implemented.');
    }
}

export { Symbol };
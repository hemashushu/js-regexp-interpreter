/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * 字符范围
 * 比如 a-z
 * 字符范围对象只能用于组建 CharSet
 */
class CharRange {
    constructor(charStart, charEnd) {
        this.type = 'CharRange';
        this.charStart = charStart;
        this.charEnd = charEnd;
    }

    toString() {
        return this.charStart.toString() + '-' + this.charEnd.toString();
    }

    includes(codePoint) {
        return codePoint >= this.charStart.codePoint &&
            codePoint <= this.charEnd.codePoint;
    }
}

export { CharRange };
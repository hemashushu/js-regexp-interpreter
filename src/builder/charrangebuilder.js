/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    CharRange,

    EscapedChar,
    SimpleChar,

    EntityChars
} from '../ast/index.js';

class CharRangeBuilder {
    constructor(parent, receiveFunc) {
        this.parent = parent;
        this.receiveFunc = receiveFunc;
    }

    /**
     *
     * @param {*} char CodePointChar
     * @returns
     */
    fromChar(char) {
        let c;
        if (EntityChars.includes(char)) {
            c = new EscapedChar(char);
        } else {
            c = new SimpleChar(char);
        }

        this.startChar = c;
        return this;
    }

    /**
     *
     * @param {*} char CodePointChar
     * @returns
     */
    toChar(char) {
        let c;
        if (EntityChars.includes(char)) {
            c = new EscapedChar(char);
        } else {
            c = new SimpleChar(char);
        }

        this.toChar = c;
        return this;
    }

    build() {
        let charRange = new CharRange(this.startChar, this.toChar);
        this.receiveFunc(charRange);
        return this.parent;
    }
}

export { CharRangeBuilder };
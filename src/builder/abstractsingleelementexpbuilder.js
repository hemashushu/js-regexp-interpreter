/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    SimpleChar,
    MetaChar,
    UnicodeChar,
} from '../ast/index.js';

import { CharSetBuilder } from './charsetbuilder.js';

class AbstractSingleElementExpBuilder {
    constructor(parent, receiveFunc) {
        this.parent = parent;
        this.receiveFunc = receiveFunc;

        this.element = null;
    }

    char(char) {
        let c = new SimpleChar(char);
        this.element = c;
        return this;
    }

    metaChar(char) {
        this.element = new MetaChar(char);
        return this;
    }

    unicodeChar(codePointInt) {
        this.element = new UnicodeChar(codePointInt);
        return this;
    }

    charSet(negative = false) {
        return new CharSetBuilder(negative, this, (charSet) => {
            this.element = charSet;
        });
    }
}

export { AbstractSingleElementExpBuilder };
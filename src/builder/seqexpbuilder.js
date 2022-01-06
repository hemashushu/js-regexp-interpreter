/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    SimpleChar,
    AlternativeExp
} from '../ast/index.js';

import { AbstractMultiElementExpBuilder } from './abstractmultielementexpbuilder.js';
import { RepeatExpBuilder } from './repeatexpbuilder.js';
import { GroupExpBuilder } from './groupexpbuilder.js';

class SeqExpBuilder extends AbstractMultiElementExpBuilder {
    constructor(parent, receiveFunc) {
        super(parent, receiveFunc);
    }

    addChars(string) {
        for (const c of string) {
            this.elements.push(new SimpleChar(c));
        }
        return this;
    }

    addRepeatExp() {
        return new RepeatExpBuilder(this, (exp) => {
            this.elements.push(exp);
        });
    }

    addGroupExp() {
        return new GroupExpBuilder(this, (exp) => {
            this.elements.push(exp);
        });
    }

    build() {
        let exp = new AlternativeExp(this.elements);
        if (this.parent === undefined) {
            return exp;
        } else {
            this.receiveFunc(exp);
            return this.parent;
        }
    }
}

export { SeqExpBuilder };
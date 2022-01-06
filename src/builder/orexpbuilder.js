/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DisjunctionExp } from '../ast/index.js';

import { AbstractMultiElementExpBuilder } from './abstractmultielementexpbuilder.js';
import { SeqExpBuilder } from './seqexpbuilder.js';
import { RepeatExpBuilder } from './repeatexpbuilder.js';
import { GroupExpBuilder } from './groupexpbuilder.js';

class OrExpBuilder extends AbstractMultiElementExpBuilder {
    constructor(parent, receiveFunc) {
        super(parent, receiveFunc);
    }

    addSeqExp() {
        return new SeqExpBuilder(this, (exp) => {
            this.elements.push(exp);
        });
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
        let exp = new DisjunctionExp(this.elements);
        if (this.parent === undefined) {
            return exp;
        } else {
            this.receiveFunc(exp);
            return this.parent;
        }
    }
}

export { OrExpBuilder };
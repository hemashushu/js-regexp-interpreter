/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    RepetitionExp,

    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier
} from '../ast/index.js';

import { GroupExpBuilder } from './groupexpbuilder.js';
import { AbstractSingleElementExpBuilder } from './abstractsingleelementexpbuilder.js';
import { SeqExpBuilder } from './seqexpbuilder.js';
import { OrExpBuilder } from './orexpbuilder.js';

class RepeatExpBuilder extends AbstractSingleElementExpBuilder {

    constructor(parent, receiveFunc) {
        super(parent, receiveFunc);
        this.quantifier = null;
    }

    groupExp() {
        return new GroupExpBuilder(this, (exp) => {
            this.element = exp;
        });
    }

    oneOrMore() {
        this.quantifier = new OneOrMoreQuantifier();
        return this;
    }

    oneOrZero() {
        this.quantifier = new OneOrZeroQuantifier();
        return this;
    }

    zeroOrMore() {
        this.quantifier = new ZeroOrMoreQuantifier();
        return this;
    }

    range(from, to) {
        this.quantifier = new RangeQuantifier(from, to);
        return this;
    }

    build() {
        let exp = new RepetitionExp(this.element, this.quantifier);
        if (this.parent === undefined) {
            return exp;
        } else {
            this.receiveFunc(exp);
            return this.parent;
        }
    }
}

export { RepeatExpBuilder };
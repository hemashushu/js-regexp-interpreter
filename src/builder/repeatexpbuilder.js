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
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
} from '../ast/index.js';

import { GroupExpBuilder } from './groupexpbuilder.js';
import { AbstractSingleElementExpBuilder } from './abstractsingleelementexpbuilder.js';

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

    oneOrMore(greedy = true) {
        this.quantifier = new OneOrMoreQuantifier(greedy);
        return this;
    }

    oneOrZero(greedy = true) {
        this.quantifier = new OneOrZeroQuantifier(greedy);
        return this;
    }

    zeroOrMore(greedy = true) {
        this.quantifier = new ZeroOrMoreQuantifier(greedy);
        return this;
    }

    range(from, to, greedy = true) {
        this.quantifier = new RangeQuantifier(from, to, greedy);
        return this;
    }

    manyTimes(times){
        this.quantifier = new ManyTimesQuantifier(times);
        return this;
    }

    manyTimesOrMore(times, greedy) {
        this.quantifier = new ManyTimesOrMoreQuantifier(times, greedy);
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
/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GroupExp } from '../ast/index.js';
import { AbstractSingleElementExpBuilder } from './abstractsingleelementexpbuilder.js';
import { SeqExpBuilder } from './seqexpbuilder.js';
import { OrExpBuilder } from './orexpbuilder.js';
import { RepeatExpBuilder } from './repeatexpbuilder.js';

class GroupExpBuilder extends AbstractSingleElementExpBuilder {

    constructor(parent, receiveFunc) {
        super(parent, receiveFunc);
    }

    seqExp() {
        return new SeqExpBuilder(this, (exp) => {
            this.element = exp;
        });
    }

    orExp() {
        return new OrExpBuilder(this, (exp) => {
            this.element = exp;
        });
    }

    repeatExp() {
        return new RepeatExpBuilder(this, (exp) => {
            this.element = exp;
        });
    }

    build() {
        let exp = new GroupExp(this.element);
        if (this.parent === undefined) {
            return exp;
        } else {
            this.receiveFunc(exp);
            return this.parent;
        }
    }
}

export { GroupExpBuilder };
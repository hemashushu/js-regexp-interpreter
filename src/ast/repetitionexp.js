/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Expression } from './expression.js';

/**
 * 重复表达式
 * 比如 /a+/
 */
class RepetitionExp extends Expression {
    constructor(exp, quantifier) {
        super();

        this.type = 'RepetitionExp';
        this.exp = exp;
        this.quantifier = quantifier;
    }

    toString() {
        return this.exp.toString() + this.quantifier.toString();
    }
}

export { RepetitionExp };
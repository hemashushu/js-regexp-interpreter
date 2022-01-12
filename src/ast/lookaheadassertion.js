/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Assertion } from "./assertion.js";

/**
 * 指定结尾部分的匹配表达式
 * 如 `do(?=ing)`，`do(?!ing)`
 */
class LookAheadAssertion extends Assertion {
    constructor(negative, exp) {
        super('lookahead');

        this.type = 'LookAheadAssertion';
        this.negative = negative;
        this.exp = exp;
    }
}

export { LookAheadAssertion };
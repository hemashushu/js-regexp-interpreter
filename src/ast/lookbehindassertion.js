/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Assertion } from "./assertion.js";

/**
 * 指定开头部分需要匹配
 * 如 `(?<=fo)od`，`(?<!fo)od`
 */
class LookBehindAssertion extends Assertion {
    constructor(negative, exp) {
        super('lookbehind');

        this.type = 'LookBehindAssertion';
        this.negative = negative;
        this.exp = exp;
    }
}

export { LookBehindAssertion };
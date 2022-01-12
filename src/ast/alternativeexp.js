/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Expression } from './expression.js';

/**
 * 连续的表达式
 * Alternative/Concatenation
 *
 * 比如 /abc/
 */
class AlternativeExp extends Expression {
    constructor(exps = []) {
        super();

        this.type = 'AlternativeExp';
        this.exps = exps;
    }

    toString() {
        let ss = [];
        for (const e of this.exps) {
            ss.push(e.toString());
        }
        return ss.join('');
    }
}

export { AlternativeExp };
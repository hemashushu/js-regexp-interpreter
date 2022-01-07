/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Expression } from './expression.js';

class GroupExp extends Expression {
    constructor(exp, number, name, capturing = true) {
        super();
        this.exp = exp;
        this.number = number; // 分组的索引
        this.name = name; // 分组的名称 `(?<name>...)`
        this.capturing = capturing; // 表示是否捕获 `(?:...)`
    }

    toString() {
        return '(' + this.exp.toString() + ')';
    }
}

export { GroupExp };
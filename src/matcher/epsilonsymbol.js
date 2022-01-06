/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Symbol } from '../ast/symbol.js';

/**
 * 表示空字符，不消费目标字符
 * 用于连接两个 State，相当于跳线/短接。
 */
class EpsilonSymbol extends Symbol {
    constructor() {
        super();
    }

    toString() {
        return 'ε';
    }
}

export { EpsilonSymbol };
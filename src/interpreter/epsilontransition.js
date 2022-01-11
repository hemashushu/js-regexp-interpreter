/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Transition } from './transition.js';

/**
 * 用于无条件连接两个 State，相当于跳线/短接。
 * EpsilonTransition 不消费目标字符，类似匹配空字符。
 * 一个 State 可以有多个 EpsilonTransition 目标 State。
 */
class EpsilonTransition extends Transition {
    constructor(nextState) {
        super(nextState);
    }

    toString() {
        return 'ε -> ' + this.nextState.index;
    }
}

export { EpsilonTransition };
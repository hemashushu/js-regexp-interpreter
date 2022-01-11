/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * 用于表示从一个 State 转到另外一个 State 的路径
 */
class Transition {
    constructor(nextState) {
        this.nextState = nextState; // 下一个 State
    }

    toString() {
        throw new Error('Not implemented.');
    }
}

export { Transition };
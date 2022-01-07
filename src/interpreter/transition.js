/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Transition {
    constructor(symbol, states = []) {
        this.symbol = symbol;
        this.states = states;
    }

    toString() {
        return this.symbol.toString();
    }
}

export { Transition };
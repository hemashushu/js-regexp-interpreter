/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Quantifier {
    constructor(greedy = true) {
        this.greedy = greedy; // 是否为贪婪模式
    }

    toString() {
        //
    }
}

class RangeQuantifier extends Quantifier {
    constructor(from, to, greedy = true) {
        super(greedy);
        this.from = from;
        this.to = to;
    }

    toString() {
        return '{' + this.from + ',' + this.to + '}' +
            (this.greedy ? '' : '?');
    }
}

class OneOrMoreQuantifier extends Quantifier {
    constructor(greedy = true) {
        super(greedy);
    }

    toString() {
        return '+' +
            (this.greedy ? '' : '?');
    }
}

class OneOrZeroQuantifier extends Quantifier {
    constructor(greedy = true) {
        super(greedy);
    }

    toString() {
        return '?' +
            (this.greedy ? '' : '?');
    }
}

/**
 * Kleene-closure
 */
class ZeroOrMoreQuantifier extends Quantifier {
    constructor(greedy = true) {
        super(greedy);
    }

    toString() {
        return '*' +
            (this.greedy ? '' : '?');
    }
}

export { Quantifier, RangeQuantifier, OneOrMoreQuantifier, OneOrZeroQuantifier, ZeroOrMoreQuantifier };
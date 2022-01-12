/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Quantifier {
    constructor(greedy = true) {
        this.type = 'Quantifier';
        this.greedy = greedy; // 是否为贪婪模式，默认为 True
    }

    toString() {
        throw new Error('Not implemented.');
    }
}

class RangeQuantifier extends Quantifier {
    constructor(from, to, greedy = true) {
        super(greedy);

        this.type = 'RangeQuantifier';

        if (to < from) {
            throw new Error('Quantifier range error.');
        }

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

        this.type = 'OneOrMoreQuantifier';
    }

    toString() {
        return '+' +
            (this.greedy ? '' : '?');
    }
}

class OneOrZeroQuantifier extends Quantifier {
    constructor(greedy = true) {
        super(greedy);

        this.type = 'OneOrZeroQuantifier';
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

        this.type = 'ZeroOrMoreQuantifier';
    }

    toString() {
        return '*' +
            (this.greedy ? '' : '?');
    }
}

class ManyTimesQuantifier extends Quantifier {
    constructor(times) {
        super(false);

        this.type = 'ManyTimesQuantifier';
        this.times = times;
    }

    toString() {
        return '{' + this.times + '}';
    }
}

class ManyTimesOrMoreQuantifier extends Quantifier {
    constructor(times, greedy = true) {
        super(greedy);

        this.type = 'ManyTimesOrMoreQuantifier';
        this.times = times;
    }

    toString() {
        return '{' + this.times + ',}';
    }
}

export {
    Quantifier,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
};
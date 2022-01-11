/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Parser } from '../parser/index.js';
import { Transformer } from './transformer.js';
import { Compiler } from './compiler.js';

class Matcher {
    match(states, testStr) {
        throw new Error('Not implemented.');
    }

    /**
     *
     * @param {*} expStr
     * @returns {inState, outState, states}
     */
    static compile(expStr) {
        let parser = new Parser();
        let transformer = new Transformer();
        let compiler = new Compiler();

        let tree = parser.parseString(expStr);
        let node = transformer.transform(tree); // 语法检查，转换元字符等
        let { inState, outState } = compiler.compile(node);
        let states = compiler.states;
        return { inState, outState, states };
    }

    static test(expStr, testStr) {
        let matcher = new Matcher();

        let state = Matcher.compile(expStr);
        return matcher.match(state, testStr);
    }
}

export { Matcher };
/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Parser } from '../parser/index.js';
import { Transformer } from '../transform/index.js';
import { Compiler } from './compiler.js';

class Matcher {
    match(state, str) {
        //
    }

    static compile(expression) {
        let parser = new Parser();
        let transformer = new Transformer();
        let compiler = new Compiler();

        let tree = parser.parseString(expression);

        // 语法检查，转换元字符等
        let node = transformer.transform(tree);
        return compiler.compile(node);
    }

    static test(expression, str) {
        let matcher = new Matcher();

        let state = Matcher.compile(expression);
        return matcher.match(state, str);
    }
}

export { Matcher };
/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { testLex } from './test-lex.js';
import { testRefactor } from './test-refactor.js';
import { testParser } from './test-parser.js';
import { testTransformer } from './test-transformer.js';
import { testCompiler } from './test-compiler.js';
import { testMatcher } from './test-matcher.js';

(() => {
    testLex();
    testRefactor();
    testParser();

    testTransformer();
    testCompiler();
    testMatcher();

    console.log('All passed.');
})();
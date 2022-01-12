/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Matcher } from '../src/interpreter/index.js';

let args = process.argv;

if (args.length === 4) {
    printMatchResult(args[2], args[3]);

} else {
    console.log('usage:\n\
    npm run match "expression_string" "test_string"\n\
    ');
    process.exit();
}

function printMatchResult(expStr, testStr) {
    console.log(`Expression: "${expStr}"`);
    console.log(`Test: "${testStr}"`);

    let result = Matcher.test(expStr, testStr);

    console.log(`Result: ${result}`);
}
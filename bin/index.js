/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Matcher } from '../src/interpreter/index.js';

let args = process.argv;

if (args.length === 3) {
    printStateTable(args[2]);

} else if (args.length === 4) {
    printMatchResult(args[2], args[3]);

} else {
    console.log('usage:\n\
    npm run match "expression_string"\n\
    npm run match "expression_string" "test_string"\n\
    ');
    process.exit();
}

function printStateTable(expStr) {
    console.log(`Expression: "${expStr}"`);
    console.log('='.repeat(20));

    let { inState, outState, states } = Matcher.compile(expStr);

    for (const state of states) {
        let line = state.toString();
        let pos = line.indexOf(':');
        let heading = line.substring(0, pos);
        console.log(heading.padStart(4, ' ') + ': ' + line.substring(pos + 1));
    }

    console.log('-'.repeat(20));
    console.log(`in state: ${inState.index}`);
    console.log(`out state: ${outState.index}`);
}

function printMatchResult(expStr, testStr) {
    console.log(`Expression: "${expStr}"`);
    console.log(`Test: "${testStr}"`);

    let result = Matcher.test(expStr, testStr);

    console.log(`Result: ${result}`);
}
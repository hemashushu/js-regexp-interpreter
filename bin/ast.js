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
    printAST(args[2]);

} else {
    console.log('usage:\n\
    npm run ast "expression_string"\n\
    ');
    process.exit();
}

function printAST(expStr) {
    console.log(`Expression: "${expStr}"`);
    console.log('='.repeat(20));

    let tree = Matcher.parse(expStr);

    console.log(JSON.stringify(tree, undefined, 4));
}

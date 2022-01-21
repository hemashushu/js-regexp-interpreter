/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Lex } from '../src/lex/index.js';

let args = process.argv;

if (args.length === 3) {
    printTokens(args[2]);

} else {
    console.log('usage:\n\
    npm run lex "expression_string"\n\
    ');
    process.exit();
}

function printTokens(expStr) {
    console.log(`Expression: "${expStr}"`);
    console.log('='.repeat(20));

    let chars = [];
    for (const c of expStr) {
        chars.push(c);
    }

    let lex = new Lex();
    let tokens = lex.lexChars(chars);

    console.log(JSON.stringify(tokens, undefined, 4));
}

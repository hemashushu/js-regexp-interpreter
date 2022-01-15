#!/usr/bin/env node

import { Matcher } from './src/interpreter/index.js';

let args = process.argv;

if (args.length === 4) {
    printMatchResult(args[2], args[3]);

} else {
    console.log(
'usage:\n\
    $ js-regexp-match "expression_string" "test_string"\n\
    \n\
e.g.\n\
    $ js-regexp-match "a*b" "aaaab"\n\
    ');
    process.exit();
}

function printMatchResult(expStr, testStr) {
    console.log(`Expression: "${expStr}"`);
    console.log(`Test: "${testStr}"`);

    let result = Matcher.test(expStr, testStr);

    console.log(`Result: ${result}`);
}
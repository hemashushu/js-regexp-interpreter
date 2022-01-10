/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Symbol } from './symbol.js';
import { Expression } from './expression.js';

import { CharSet } from './charset.js';
import { Char } from './char.js';

import { MetaChar, MetaChars, MetaCharDot } from './metachar.js';
import { CodePointChar } from './codepointchar.js';

import { SimpleChar, EntityChars } from './simplechar.js';
import { UnicodeChar } from './unicodechar.js';

import { AlternativeExp } from './alternativeexp.js';
import { DisjunctionExp } from './disjunctionexp.js';
import { GroupExp } from './groupexp.js';
import { RepetitionExp } from './repetitionexp.js';

import {
    Quantifier,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
} from './quantifier.js';

import { CharRange } from './charrange.js';

// AST （语法树）的各个元素
//
// 继承关系
//
// Symbol
//   |-- Char
//   |     |-- CodePointChar
//   |     |     |-- SimpleChar
//   |     |     \-- UnicodeChar
//   |     |
//   |     \--  MetaChar
//   |
//   \-- CharSet
//
// Expression
//   |-- AlternativeExp
//   |-- DisjunctionExp
//   |-- GroupExp
//   \-- RepetitionExp
//
// Quantifier
//   |-- RangeQuantifier
//   |-- OneOrMoreQuantifier
//   |-- OneOrZeroQuantifier
//   |-- ManyTimesQuantifier,
//   |-- ManyTimesOrMoreQuantifier
//   \-- ZeroOrMoreQuantifier

export {
    Symbol,

    Char,
    CodePointChar,
    SimpleChar,
    UnicodeChar,

    MetaChar,
    CharSet,

    Expression,
    AlternativeExp,
    DisjunctionExp,
    GroupExp,
    RepetitionExp,

    // 常量
    MetaChars,
    MetaCharDot,
    EntityChars,

    // 辅助
    CharRange,
    Quantifier,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
};
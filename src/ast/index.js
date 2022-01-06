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

import { MetaChar, MetaChars } from './metachar.js';
import { CodePointChar } from './codepointchar.js';

import { SimpleChar } from './simplechar.js';
import { EscapedChar, EntityChars } from './escapedchar.js';
import { UnicodeChar } from './unicodechar.js';

import { AlternativeExp } from './alternativeexp.js';
import { DisjunctionExp } from './disjunctionexp.js';
import { GroupExp } from './groupexp.js';
import { RepetitionExp } from './repetitionexp.js';

import { Quantifier, RangeQuantifier, OneOrMoreQuantifier, OneOrZeroQuantifier, ZeroOrMoreQuantifier } from './quantifier.js';
import { CharRange } from './charrange.js';

// 继承关系
//
// Symbol
//   |-- Char
//   |     |-- CodePointChar
//   |     |     |-- SimpleChar
//   |     |     |-- EscapedChar
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
//   \-- ZeroOrMoreQuantifier

export {
    Symbol,

    Char,
    CodePointChar,
    SimpleChar,
    EscapedChar,
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
    EntityChars,

    // 辅助
    CharRange,
    Quantifier,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
};
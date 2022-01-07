/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    SimpleChar,
    EscapedChar,
    UnicodeChar,
    MetaChar,

    MetaChars,
    EntityChars,

} from '../ast/index.js';

import { CharSetBuilder } from './charsetbuilder.js';
import { SeqExpBuilder } from './seqexpbuilder.js';
import { OrExpBuilder } from './orexpbuilder.js';
import { GroupExpBuilder } from './groupexpbuilder.js';
import { RepeatExpBuilder } from './repeatexpbuilder.js';

class Builder {
    /**
     *
     * @param {*} char 单独一个字符，或者
     *     正则表达式实体字符，比如 '^'（不带前缀反斜杠符号）
     * @returns
     */
    static char(char) {
        let c;
        if (EntityChars.includes(char)) {
            c = new EscapedChar(char);
        } else {
            c = new SimpleChar(char);
        }
        return c;
    }

    /**
     *
     * @param {*} char 元字符（不带前缀反斜杠符号）
     * @returns
     */
    static metaChar(char) {
        if (!MetaChars.includes(char)) {
            throw new Error(`Invalid meta char "${char}".`);
        }
        return new MetaChar(char);
    }

    /**
     * 用于表示表达式里诸如 '\u{hhhhhh}' 的 Unicode 码值
     *
     * @param {*} codePointInt 十进制整数
     */
    static unicodeChar(codePointInt) {
        return new UnicodeChar(codePointInt);
    }

    static charSet(negative = false) {
        return new CharSetBuilder(negative);
    }

    static seqExp() {
        return new SeqExpBuilder();
    }

    static orExp() {
        return new OrExpBuilder();
    }

    static repeatExp() {
        return new RepeatExpBuilder();
    }

    static groupExp() {
        return new GroupExpBuilder();
    }
}

export { Builder };
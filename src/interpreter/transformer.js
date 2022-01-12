/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    SimpleChar,
    UnicodeChar,

    MetaChar,
    CharSet,

    AlternativeExp,
    DisjunctionExp,
    GroupExp,
    RepetitionExp,

    // 辅助
    CharRange,
    RangeQuantifier,
    ManyTimesQuantifier,
} from '../ast/index.js';

/**
 * 对 AST （语法树）进行语法检查和必要的转换
 *
 * - 遇到元字符 `\0`, `[\b]` 和 `.` 抛出异常；
 * - 字符集里 `[...]` 出现 `\S`, `\W`, `\D` 时抛异常；
 * - 将字符集 `[...]` 里面的 `元字符` 相应的字符或字符范围；
 * - 将 `元字符` 转换为相应的字符或者字符集；
 * - 将 {m,m} 转为 {m}；
 */
class Transformer {

    constructor() {
        // \f form-feed/new-page 12 0xC
        // \r carriage-return 13 0xD
        // \n new-line 10 0xA
        // \t horizontal tab 9 0x9
        // \v vertical tab 11 0xB
        // \b backspace 8 0x8
        let charF = new UnicodeChar(12);
        let charR = new UnicodeChar(13);
        let charN = new UnicodeChar(10);
        let charT = new UnicodeChar(9);
        let charV = new UnicodeChar(11);
        let charB = new UnicodeChar(8);

        let charsS = [
            new SimpleChar(' '), charF, charN, charR, charT, charV,
            new UnicodeChar(0x00a0),
            new UnicodeChar(0x1680),
            new CharRange(new UnicodeChar(0x2000), new UnicodeChar(0x200a)),
            new UnicodeChar(0x2028),
            new UnicodeChar(0x2029),
            new UnicodeChar(0x202f),
            new UnicodeChar(0x205f),
            new UnicodeChar(0x3000),
            new UnicodeChar(0xfeff)
        ];

        let charSetS = new CharSet(charsS, false);
        let charSetNotS = new CharSet(charsS, true);

        let charsD = [
            new CharRange(new SimpleChar('0'), new SimpleChar('9'))
        ];

        let charSetD = new CharSet(charsD, false);
        let charSetNotD = new CharSet(charsD, true);

        let charsW = [
            new CharRange(new SimpleChar('A'), new SimpleChar('Z')),
            new CharRange(new SimpleChar('a'), new SimpleChar('z')),
            new CharRange(new SimpleChar('0'), new SimpleChar('9')),
            new SimpleChar('_')
        ];

        let charSetW = new CharSet(charsW, false);
        let charSetNotW = new CharSet(charsW, true);

        this.metaCharTable = new Map();

        this.metaCharTable.set('f', charF);
        this.metaCharTable.set('r', charR);
        this.metaCharTable.set('n', charN);
        this.metaCharTable.set('t', charT);
        this.metaCharTable.set('v', charV);
        this.metaCharTable.set('b', charB);
        this.metaCharTable.set('s', charSetS);
        this.metaCharTable.set('S', charSetNotS);
        this.metaCharTable.set('w', charSetW);
        this.metaCharTable.set('W', charSetNotW);
        this.metaCharTable.set('d', charSetD);
        this.metaCharTable.set('D', charSetNotD);

        this.metaCharTable.set('s_raw', charsS);
        this.metaCharTable.set('w_raw', charsW);
        this.metaCharTable.set('d_raw', charsD);
    }

    transform(exp) {
        if (exp === undefined) {
            // 正则表达式是空的情况，视为 `^$`
            return;
        }

        if (exp instanceof SimpleChar ||
            exp instanceof UnicodeChar) {
            return exp;

        } else if (exp instanceof MetaChar) {
            return this.transformMetaChar(exp);

        } else if (exp instanceof CharSet) {
            return this.transformCharSet(exp);

        } else if (exp instanceof AlternativeExp) {
            return this.transformAlternativeExp(exp);

        } else if (exp instanceof DisjunctionExp) {
            return this.transformDisjunctionExp(exp);

        } else if (exp instanceof GroupExp) {
            return this.transformGroupExp(exp);

        } else if (exp instanceof RepetitionExp) {
            return this.transformRepetitionExp(exp);
        } else {
            throw new Error('Unsupported AST node.');
        }
    }

    transformCharSet(charSet) {
        let chars = [];
        for (const char of charSet.chars) {
            if (char instanceof MetaChar) {
                let meta = char.meta;
                if (meta === 'S' ||
                    meta === 'W' ||
                    meta === 'D') { // 不支持在字符集里出现表示 "非" 的元字符。
                    throw new Error(`Unsupported meta character "${char.toString()}" within char set.`)
                }

                if (meta === 's' ||
                    meta === 'w' ||
                    meta === 'd') { // 将字符集里的 \s \w \d 展开。
                    let subChars = this.metaCharTable.get(meta + '_raw');
                    for (const subChar of subChars) {
                        chars.push(subChar);
                    }

                } else { // 转换元字符
                    chars.push(this.transformMetaChar(char));
                }

            } else { // 保持原样

                chars.push(char);
            }
        }

        return new CharSet(chars, charSet.negative);
    }

    transformMetaChar(metaChar) {
        let meta = metaChar.meta;

        if (meta === '.' ||
            meta === 'b' ||
            meta === '0') {
            throw new Error(`Unsupported meta character "${metaChar.toString()}".`);
        }

        return this.metaCharTable.get(metaChar.meta);
    }

    transformAlternativeExp(seqExp) {
        return new AlternativeExp(
            seqExp.exps.map(item => {
                return this.transform(item);
            })
        );
    }

    transformDisjunctionExp(orExp) {
        return new DisjunctionExp(
            orExp.exps.map(item => {
                return this.transform(item);
            })
        );
    }

    transformGroupExp(groupExp) {
        return new GroupExp(
            this.transform(groupExp.exp),
            groupExp.number,
            groupExp.name,
            groupExp.capturing
        );
    }

    transformRepetitionExp(repeatExp) {
        let quantifier = repeatExp.quantifier;
        if ((quantifier instanceof RangeQuantifier) &&
            (quantifier.from === quantifier.to)) {
            quantifier = new ManyTimesQuantifier(quantifier.from);
        }
        return new RepetitionExp(
            this.transform(repeatExp.exp),
            quantifier
        );
    }
}

export { Transformer };

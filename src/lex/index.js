/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharToken } from './chartoken.js';
import { UnicodeToken } from './unicodetoken.js';
import { CharSetToken } from './charsettoken.js';
import { EntityToken } from './entitytoken.js';
import { MetaToken } from './metatoken.js';
import { QuantityToken } from './quantitytoken.js';
import { GroupToken } from './grouptoken.js';

// 正则表达式里需要编码（escape）的实体字符，带 `\` 符号前缀
const EntityChars = [
    '*', '+', '?', '.',
    '{', '}', '(', ')', '[', ']',
    '^', '$', '\\', '|'];

// 正则表达式的元字符，带 `\` 符号前缀
const MetaChars = [
    'f', 'r', 'n', 't', 'v', '0', 'b',
    's', 'S', 'w', 'W', 'd', 'D'];

// 正则表达式的元字符 `.`
const MetaCharDot = '.';

/**
 * 将一行文本解析为 AST （语法树）。
 */
class Lex {

    /**
     * 1. 将字符解析为：
     *    - 普通字符符号 `CharToken`；
     *    - Unicode 字符符号 `UnicodeToken`；
     *    - 实体符号 `EntityToken`； (::TODO:: 挪到 Parser)
     *    - 元符号 `MetaToken`。 (::TODO:: 挪到 Parser)
     *
     * 2. 将字符集解析为字符集符号 CharSetToken (::TODO:: 挪到 Parser)
     * 3. 将重复数量解析为数量符号 QuantityToken (::TODO:: 挪到 Parser)
     *
     * @param {*} chars Unicode 字符数组
     */
    lexChars(chars) {
        let tokens = [];
        for (let idx = 0; idx < chars.length; idx++) {
            let char = chars[idx];
            if (char === '[') {                          // 当前是字符集表达式
                let { charSetToken, expressionLength: length } = this.lexCharSet(chars, idx);
                tokens.push(charSetToken);
                idx += (length - 1); // 跳过 length - 1 个字符 （因为 length 包括了 `[` 字符）

            } else if (char === '{') {                   // 当前是数量范围表达式
                let { quantityToken, expressionLength: length } = this.lexQuantity(chars, idx);
                tokens.push(quantityToken);
                idx += (length - 1); // 跳过 length - 1 个字符 （因为 length 包括了 `[` 字符）

            } else if (char === '\\') {
                let aheadChar = this.lookAhead(chars, idx, 1);
                if (MetaChars.includes(aheadChar)) {     // 当前是元字符
                    tokens.push(new MetaToken(aheadChar));
                    idx++; // 跳过 1 个字符

                } else if (
                    EntityChars.includes(aheadChar)) {   // 当前是被编码的实体字符
                    tokens.push(new CharToken(aheadChar));
                    idx++; // 跳过 1 个字符

                } else if (aheadChar === 'u') {          // 当前是 unicode 字符
                    let { unicodeToken, expressionLength: length } =
                        this.decodeUnicodeChar(chars, idx);

                    tokens.push(unicodeToken);
                    idx += (length - 1); // 跳过 length - 1 个字符 （因为 length 包括了 `\` 字符）

                } else {
                    throw new Error(`Unsupported char "\\${aheadChar}".`);
                }

            } else if (char === MetaCharDot) {           // 当前是元字符 `.`
                tokens.push(new MetaToken(char));

            } else if (['*', '+', '?'].includes(char)) { // 当前是数量字符
                let aheadChar = this.lookAhead(chars, idx, 1);
                // 检查后一个字符是否为 `?`
                if (aheadChar === '?') {
                    // 当前是 '??'
                    let token = new QuantityToken(char, false);
                    tokens.push(token);
                    idx++; // 跳过 1 个字符

                } else {
                    // 检查前一个字符是否为 `(`
                    let behindChar = this.lookBehind(chars, idx, 1);
                    if (behindChar === '(') {
                        // 当前是分组的属性，即 `(?...)`
                        let token = new EntityToken(char);
                        tokens.push(token);
                    }else {
                        // 当前是普通的数量字符即 `?`
                        let token = new QuantityToken(char);
                        tokens.push(token);
                    }
                }

            } else if (['(', ')', '|'] // 实体字符当中的 '^', '$' 还未支持
                .includes(char)) {                       // 当前是实体字符
                tokens.push(new EntityToken(char));

            } else {                                     // 当前是普通字符
                tokens.push(new CharToken(char));
            }
        }

        return tokens;
    }

    /**
     * 解析字符集表达式（即 [...]）为 CharSetToken
     *
     * @param {*} chars
     * @returns {charSetToken, expressionLength}
     */
    lexCharSet(chars, currentIdx) {

        /**
         * 先确定字符集表达式的有效范围，将范围内的字符存入 charSetChars 数组。
         */

        let charSetChars = [];
        let foundClosingBracket = false;

        let idx = currentIdx + 1;
        for (; idx < chars.length; idx++) {
            let char = chars[idx];

            // 寻找结束字符 `]`，但不能是 `\]`，但可以是 `\\]`
            if (char === ']' && (
                this.lookBehind(chars, idx, 1) !== '\\' ||
                this.lookBehind(chars, idx, 2) === '\\')) {
                foundClosingBracket = true;
                break;
            }
            charSetChars.push(char);
        }

        if (!foundClosingBracket) {
            throw new Error(`Can't find the closing bracket.`);
        }

        // 计算字符集表达式的总长度
        let expressionLength = (idx - currentIdx) + 1;

        /**
         * 解析 charSetChars 数组里的字符为 CharToken、UnicodeToken 以及 EntityToken。
         */

        let tokens = [];
        for (let idx = 0; idx < charSetChars.length; idx++) {
            let char = charSetChars[idx];
            if (char === '\\') {
                let aheadChar = this.lookAhead(charSetChars, idx, 1);
                if (MetaChars.includes(aheadChar)) {   // 当前是元字符
                    tokens.push(new MetaToken(aheadChar));
                    idx++; // 跳过 1 个字符

                } else if (
                    EntityChars.includes(aheadChar) || // 当前是被编码的实体字符
                    aheadChar === '-') {               // 当前是被编码的 `-` 符号（虽然不是实体字符，但在字符集里也会有可能被编码）
                    tokens.push(new CharToken(aheadChar));
                    idx++; // 跳过 1 个字符

                } else if (aheadChar === 'u') {        // 当前是 unicode 字符
                    let { unicodeToken, expressionLength: length } =
                        this.decodeUnicodeChar(charSetChars, idx);

                    tokens.push(unicodeToken);
                    idx += (length - 1); // 跳过 length - 1 个字符 （因为 length 包括了 `\` 字符）

                } else {
                    throw new Error(`Invalid escaped char "${aheadChar}".`);
                }

            } else if (char === '-') {
                if (idx === 0 || idx === charSetChars.length - 1) {
                    // 当 `-` 符号位于头尾时，仅表示字面上的 `-` 符号
                    tokens.push(new CharToken(char));
                } else {
                    // `-` 符号表示一个范围
                    tokens.push(new EntityToken('-'));
                }
            } else if (char === '^' && idx === 0) {
                // "非" 的字符集
                tokens.push(new EntityToken('^'));

            } else {
                // 普通字符
                tokens.push(new CharToken(char));
            }
        }

        let charSetToken = new CharSetToken(tokens);
        return { charSetToken, expressionLength };
    }

    /**
     * 解析数量表达式（即 {m,n}, {m,}, {m}）为 QuantityToken
     *
     * @param {*} chars
     * @param {*} currentIdx
     * @returns { quantityToken, expressionLength }
     */
    lexQuantity(chars, currentIdx) {
        /**
         * 先确定数量表达式的有效范围，将范围内的字符存入 quantityChars 数组。
         */

        let quantityChars = [];
        let foundClosingBracket = false;

        let idx = currentIdx + 1;
        for (; idx < chars.length; idx++) {
            let char = chars[idx];

            // 寻找结束字符 `}`
            if (char === '}') {
                foundClosingBracket = true;
                break;
            }
            quantityChars.push(char);
        }

        if (!foundClosingBracket) {
            throw new Error(`Can't find the closing bracket.`);
        }

        if (quantityChars.length === 0) {
            throw new Error('Empty quantity expression.');
        }

        // 检查是否存在 '?' 字符后缀
        let greedy = true;
        if (this.lookAhead(chars, idx, 1) === '?') {
            idx++;
            greedy = false;
        }

        // 计算字符集表达式的总长度
        let expressionLength = (idx - currentIdx) + 1;

        /**
         * 解析 quantityChars 数组里的字符为 QuantityToken
         */

        let commaPos = quantityChars.findIndex(item => {
            return item === ',';
        });

        let type;
        let from;
        let to;
        if (commaPos === -1) {
            from = this.decCharToInt(quantityChars);
            type = '{m}'

        } else if (commaPos === 0) {
            throw new Error('Invalid quantity expression.');

        } else {
            let fromChars = quantityChars.slice(0, commaPos);
            from = this.decCharToInt(fromChars);

            if (commaPos < quantityChars.length - 1) {
                let toChars = quantityChars.slice(commaPos + 1);
                to = this.decCharToInt(toChars);
                type = '{m,n}';

            } else {
                type = '{m,}'
            }
        }

        let quantityToken = new QuantityToken(type, greedy, from, to);

        return { quantityToken, expressionLength };
    }

    /**
     *
     * @param {*} chars
     * @param {*} startIdx Unicode 字符表达式的开始位置，即 '\' 符号的索引值
     * @returns {unicodeToken, expressionLength}
     *     expressionLength 是 Unicode 字符表达式的总长度，只能是 8 或者 10；
     *     比如 `\u{hhhh}` 为 8，`\u{hhhhhh}` 为 10。
     */
    decodeUnicodeChar(chars, startIdx) {
        let hexChars;
        let expressionLength;

        // 两种 unicode 字符的表示方式：
        // \u{hhhh}  \u{hhhhhh}
        // 01234567  0123456789

        if (this.lookAhead(chars, startIdx, 2) === null) {
            throw new Error('Invalid unicode expression.')
        }

        if (this.lookAhead(chars, startIdx, 7) === '}') {
            hexChars = chars.slice(startIdx + 3, startIdx + 3 + 4);
            expressionLength = 8;

        } else if (this.lookAhead(chars, startIdx, 9) === '}') {
            hexChars = chars.slice(startIdx + 3, startIdx + 3 + 6);
            expressionLength = 10;

        } else {
            throw new Error('Invalid unicode expression.')
        }

        // 将十六进制字符数组转成整数
        let intValue = this.hexCharsToInt(hexChars);

        /**
         * 当然也可以使用内置函数 Number.parseInt()，比如：
         * let hexString = hexChars.join('');
         * let intValue = Number.parseInt(hexString, 16);
         */

        let unicodeToken = new UnicodeToken(intValue);
        return { expressionLength, unicodeToken };
    }

    /**
     * 转换十六进制字符数组为整数，顺便检查字符是否有效
     * @param {*} hexChars
     * @returns
     */
    hexCharsToInt(hexChars) {
        if (hexChars.length === 0) {
            throw new Error('Empty hex number string.');
        }

        let value = 0;
        let upperCaseAOffset = 'A'.codePointAt(0);
        let lowerCaseAOffset = 'a'.codePointAt(0);
        let numberZeroOffset = '0'.codePointAt(0);

        // 去除前导空格
        let validPos = hexChars.length - 1;
        for (; validPos >= 0; validPos--) {
            if (hexChars[validPos] !== ' ') {
                break;
            }
        }

        if (validPos === -1) {
            throw new Error('Blank hex number string.');
        }

        for (let idx = 0; idx <= validPos; idx++) {
            let h = hexChars[hexChars.length - idx - 1]; // 从低位开始计算
            let digitalValue;
            if (h >= 'A' && h <= 'F') {
                let v = h.codePointAt(0) - upperCaseAOffset + 10;
                digitalValue = (v << (idx * 4));

            } else if (h >= 'a' && h <= 'f') {
                let v = h.codePointAt(0) - lowerCaseAOffset + 10;
                digitalValue = (v << (idx * 4));

            } else if (h >= '0' && h <= '9') {
                let v = h.codePointAt(0) - numberZeroOffset;
                digitalValue = (v << (idx * 4));

            } else {
                throw new Error('Invalid hex number expression.')
            }

            value += digitalValue;
        }

        return value;
    }

    /**
     * 转换十进制字符数组为整数，顺便检查字符是否有效
     * @param {*} decChars
     * @returns
     */
    decCharToInt(decChars) {
        if (decChars.length === 0) {
            throw new Error('Empty number string.');
        }

        let value = 0;
        let numberZeroOffset = '0'.codePointAt(0);

        // 去除前导空格
        let validPos = decChars.length - 1;
        for (; validPos >= 0; validPos--) {
            if (decChars[validPos] !== ' ') {
                break;
            }
        }

        if (validPos === -1) {
            throw new Error('Blank number string.');
        }

        for (let idx = 0; idx <= validPos; idx++) {
            let h = decChars[decChars.length - idx - 1]; // 从低位开始计算
            let digitalValue;
            if (h >= '0' && h <= '9') {
                let v = h.codePointAt(0) - numberZeroOffset;
                digitalValue = v * Math.pow(10, idx);
            } else {
                throw new Error('Invalid number expression.')
            }

            value += digitalValue;
        }

        return value;
    }

    lookAhead(elements, idx, /*uint*/ distance) {
        let pos = idx + distance;
        if (pos < elements.length) {
            return elements[pos];
        } else {
            return null;
        }
    }

    lookBehind(elements, idx, /*uint*/ distance) {
        let pos = idx - distance;
        if (pos >= 0) {
            return elements[pos];
        } else {
            return null;
        }
    }

}

export {
    Lex,
    EntityChars,
    MetaChars,
    MetaCharDot,

    CharToken,
    UnicodeToken,
    CharSetToken,
    EntityToken,
    MetaToken,
    QuantityToken,
    GroupToken,
};
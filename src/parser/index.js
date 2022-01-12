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

    CharRange,
    RangeQuantifier,
    OneOrMoreQuantifier,
    OneOrZeroQuantifier,
    ZeroOrMoreQuantifier,
    ManyTimesQuantifier,
    ManyTimesOrMoreQuantifier
} from '../ast/index.js';

import {
    Lex,
    CharToken,
    UnicodeToken,
    CharSetToken,
    EntityToken,
    MetaToken,
    QuantityToken,
    GroupToken,
} from '../lex/index.js';

import { Refactor } from './refactor.js';

class Parser {

    parseString(str) {
        // 将字符串转换为 Unicode 字符数组
        let chars = [];
        for (const c of str) {
            chars.push(c);
        }

        return this.parseChars(chars);
    }

    parseChars(chars) {
        let lex = new Lex();
        let tokens = lex.lexChars(chars);
        return this.parseTokens(tokens);
    }

    parseTokens(tokens) {
        // 将 tokens 转换为层叠型的结构
        let refactor = new Refactor();
        let { groupToken } = refactor.refactorTokens(tokens, 0);

        // 因为第 0 层 "组" 是虚拟的，所以直接提取其中的 tokens
        let cascadedTokens = groupToken.tokens;
        return this.parseOrExp(cascadedTokens);
    }

    parseGroupExp(token) {
        // 所以直接调用 parseOrExp() 方法。
        let tokens = token.tokens;

        // 不支持组命名、不捕获、往前看断言、往后看断言
        if (
            (tokens[0] instanceof EntityToken) &&
            tokens[0].value === '?') {
            throw new Error(`Unsupported group feature.`);
        }

        let node = this.parseOrExp(tokens);
        return new GroupExp(node);
    }

    /**
     * 解析 "或" 表达式。
     *
     * - 子表达式里可能存在 "或" 表达式。
     * - 当将顶层 tokens 转换成层次型分组的 tokens 后，应该先调用此方法，
     *   因为顶层 tokens 的集合可以视为在一个虚拟的组里面。
     *
     * @param {*} tokens
     * @returns AST node
     */
    parseOrExp(tokens) {

        // 查找 "或" 表达式

        let orPosArray = [];
        for (let idx = 0; idx < tokens.length; idx++) {
            let token = tokens[idx];
            if (token instanceof EntityToken &&
                token.value === '|') {
                orPosArray.push(idx);
            }
        }

        if (orPosArray.length === 0) {
            // 不存在 "或" 表达式
            return this.parseSeqExp(tokens);

        } else {
            // 存在 "或" 表达式
            // 以 `|` 符号将 tokens 分隔成 N 份子表达式

            let parts = [];
            let lastPos = 0;

            if (orPosArray[0] === 0 ||
                orPosArray[orPosArray.length - 1] === tokens.length - 1) {
                throw new Error('Invalid "|" position.');
            }

            for (const pos of orPosArray) {
                let part = tokens.slice(lastPos, pos);
                parts.push(part);
                lastPos = pos + 1;
            }

            // 添加最后一份
            parts.push(tokens.slice(lastPos));

            // 将每个子表达式转换为 AST node
            let nodes = parts.map(item => {
                return this.parseSeqExp(item);
            });

            // 封装成 DisjunctionExp
            return new DisjunctionExp(nodes);
        }
    }

    /**
     * 解析 "连接" 表达式
     *
     * - 子表达式里可能存在 "连接" 表达式
     * - 子表达式里可能存在 "组" 表达式
     * - 子表达式里可能存在 "重复" 表达式
     * - 子表达式里 **不存在** "或" 表达式
     *
     * @param {*} tokens
     * @returns AST node
     */
    parseSeqExp(tokens) {

        let nodes = [];

        // 转换每一个 token
        for (let idx = 0; idx < tokens.length; idx++) {
            let token = tokens[idx];
            let node;

            if (token instanceof CharToken) {
                node = new SimpleChar(token.value);
            } else if (token instanceof UnicodeToken) {
                node = new UnicodeChar(token.value);
            } else if (token instanceof CharSetToken) {
                node = this.parseCharSetToken(token);
            } else if (token instanceof MetaToken) {
                node = new MetaChar(token.value);
            } else if (token instanceof GroupToken) {
                node = this.parseGroupExp(token);
            } else {
                throw new Error('Invalid token in sequence expression: ' + JSON.stringify(token));
            }

            if (idx < tokens.length - 1) {
                let nextToken = tokens[idx + 1];
                if (nextToken instanceof QuantityToken) {
                    let quantifier = this.parseQuantityToken(nextToken);
                    node = new RepetitionExp(node, quantifier);
                    idx++; // 跳过一个 token
                }
            }

            nodes.push(node);
        }

        if (nodes.length > 1) { // 仅当 node 大于 1 个时，才是 "连接" 表达式
            return new AlternativeExp(nodes);
        } else {
            return nodes[0];
        }
    }

    /**
     * 解析 CharSetToken  为 AST node
     *
     * @param {*} charSetToken
     * @returns
     */
    parseCharSetToken(charSetToken) {
        // CharSetToken 里面存在：
        // MetaToken, CharToken, UnicodeToken, EntityToken（只有 `^` 和 `-` 两个）
        let chars = [];

        // 解析每一个 token
        let tokens = charSetToken.tokens;

        let idx = 0;
        let negative = false;

        // 检查第一个 token 是否为实体字符 `^`
        if (
            (tokens[0] instanceof EntityToken) &&
            (tokens[0].value === '^')) {
            negative = true;
            idx++;
        }

        for (; idx < tokens.length; idx++) {
            let token = tokens[idx];
            let nextToken = null;
            if (idx < tokens.length - 1) {
                nextToken = tokens[idx + 1];
            }

            if (
                (nextToken instanceof EntityToken) &&
                (nextToken.value === '-')) {
                // 字符范围
                let endToken = tokens[idx + 2];
                let startChar = this.parseCharToken(token);
                let endChar = this.parseCharToken(endToken);
                chars.push(new CharRange(startChar, endChar));

                idx += 2; // 跳过两个 token

            } else if (token instanceof MetaToken) {
                // 元字符
                chars.push(new MetaChar(token.value));

            } else {
                // 单个字符
                chars.push(this.parseCharToken(token));
            }
        }

        return new CharSet(chars, negative);
    }

    /**
     * 解析 CharToken 和 UnicodeToken 为 AST node
     *
     * @param {*} token
     */
    parseCharToken(token) {
        if (token instanceof CharToken) {
            return new SimpleChar(token.value);
        } else if (token instanceof UnicodeToken) {
            return new UnicodeChar(token.value);
        } else {
            throw new Error('Unexpected character token.');
        }
    }

    /**
     * 解析 QuantityToken 为 AST node
     *
     * @param {*} quantityToken
     * @returns
     */
    parseQuantityToken(quantityToken) {
        // quantityToken 的 kind 属性有：?,+,*,{m,n},{m,},{m}
        let quantifier;
        switch (quantityToken.kind) {
            case '?':
                quantifier = new OneOrZeroQuantifier(quantityToken.greedy);
                break;
            case '+':
                quantifier = new OneOrMoreQuantifier(quantityToken.greedy);
                break;
            case '*':
                quantifier = new ZeroOrMoreQuantifier(quantityToken.greedy);
                break;
            case '{m,n}':
                quantifier = new RangeQuantifier(quantityToken.from, quantityToken.to, quantityToken.greedy);
                break;
            case '{m,}':
                quantifier = new ManyTimesOrMoreQuantifier(quantityToken.from, quantityToken.greedy);
                break;
            case '{m}':
                quantifier = new ManyTimesQuantifier(quantityToken.from, quantityToken.greedy);
                break;
            default:
                throw new Error('Unexpected quantity token kind.')
        }

        return quantifier;
    }

}

export { Parser };
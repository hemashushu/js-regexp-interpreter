/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    EntityToken,
    GroupToken }
from '../lex/index.js';

class Refactor {

    /**
     * 将 tokens 按照 "组" 重构成有层叠型的结构。
     *
     * 注意：
     * - 既有可能存在平行组，也有可能存在嵌套组；
     * - 当检测到 '(' 符号时就调用此方法，currentIdx 为 '(' 符号的后一个字符的索引；
     * - 如果将顶层 tokens 传入此方法，需要假设在 tokens 的前后有一对虚拟的 `(` 和 `)` tokens。
     *
     * @param {*} tokens
     * @param {*} currentIdx '(' 符号的后一个字符的索引
     * @returns { groupToken, groupLength }
     *     groupLength 为组内有效的 token 数量，不包括 `)` token。
     */
    refactorTokens(tokens, currentIdx) {
        let cascadedTokens = [];

        let idx = currentIdx;
        for (; idx < tokens.length; idx++) {
            let token = tokens[idx];
            if ((token instanceof EntityToken) &&
                (token.value === '(')) {
                // 新一组的开始
                let { groupToken, groupLength: length } =
                    this.refactorTokens(tokens, idx + 1);

                cascadedTokens.push(groupToken);
                idx += (length + 1); // 跳过 length + 1 个 token，因为 length 不包括 `(` 和 `)`

            } else if (
                (token instanceof EntityToken) &&
                (token.value === ')')) {

                // 当前组的结束
                break;

            } else {
                cascadedTokens.push(token);
            }
        }

        // groupLength 为当前组内有效的 token （包括所有子组的 tokens）的数量。
        // 注意 groupLength 不包括当前组的 `)` token，其实也不包括当前组的 `(` token，
        // 这是因为当检测到 '(' 符号时才调用此方法，
        // currentIdx 为 `(` 符号后的第一个字符的位置，
        // idx 为 `)` 符号的位置，所以有效 token 的数量是 idx - currentIdx。
        let groupLength = idx - currentIdx;
        let groupToken = new GroupToken(cascadedTokens);

        return { groupToken, groupLength };
    }
}

export { Refactor };
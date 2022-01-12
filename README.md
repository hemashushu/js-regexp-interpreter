# JS-Regex

尝试实现一个极其简陋的正则表达式解析器（interpreter）。

语法参照 JavaScript 版本的 Regex。
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

不支持：

- 元字符 `.`，`\0`，`[\b]`；
- 字符集里的元字符 `\S`，`\W`，`\D`，比如 `[\Wabc]`，`[^\Wabc]`；
- 对分组命名，比如 `(?<name>...)`，`\k<name>`；
- 对分组设置为不捕获，比如 `(?:...)`；
- 反向引用，比如 `\1`；
- 所有断言 `^`，`$`，`\b`，`\B`，`(?=...)`，`(?!...)`，`(?<=...)`，`(?<!...)`；
- 暂不支持 `\xhh` 和 `\uhhhh` 这两种字符表示法。

支持：

- 单个字符，比如 `a`，`文`；
- Unicode 字符，比如 `\u{hhhh}` 和 `\u{hhhhhh}`；
- 字符集，比如 `[abc]`，`[a-z]`，`[0-9a-f]`；
- 元字符，比如 `\w`，`\d`；
- 重复，比如 `a+`，`a?`，`a*`，`a{2}`，`a{2，}`，`a{2，3}`，`[abc]+`，`[0-9]*`；
- 非贪婪模式的重复，比如 `a+?`，`a??`；
- "连接"，比如 `ab`，`a+b`，`0x[0-9a-f]+`；
- "或"，比如 `a|b`，`[0-9]+|0x[0-9a-f]+`。
- 分组，比如 `(a)`，`(a)(x)`

_请勿用于生产环境，仅供学习之目的。_

## 单元测试

`$ npm test`

项目无依赖，如无意外应该能看到 `All passed.` 字样。

## 命令行

### 获取符号

将表达式符号化：

`$ npm run token "0|(u[a-f\d]+)"`

输出结果：

```json
[
    {
        "type": "CharToken",
        "value": "0"
    },
    {
        "type": "EntityToken",
        "value": "|"
    },
    {
        "type": "EntityToken",
        "value": "("
    },
    {
        "type": "CharToken",
        "value": "u"
    },
    {
        "type": "CharSetToken",
        "tokens": [
            {
                "type": "CharToken",
                "value": "a"
            },
            {
                "type": "EntityToken",
                "value": "-"
            },
            {
                "type": "CharToken",
                "value": "f"
            },
            {
                "type": "MetaToken",
                "value": "d"
            }
        ]
    },
    {
        "type": "QuantityToken",
        "kind": "+",
        "greedy": true
    },
    {
        "type": "EntityToken",
        "value": ")"
    }
]
```

### 生成语法树

将上一步得到的一系列符号按照语法生成语法树：

`$ npm run tree "0|(u[a-f\d]+)"`

结果：

```json
{
    "type": "DisjunctionExp",
    "exps": [
        {
            "type": "SimpleChar",
            "value": "0",
            "codePoint": 48
        },
        {
            "type": "GroupExp",
            "exp": {
                "type": "AlternativeExp",
                "exps": [
                    {
                        "type": "SimpleChar",
                        "value": "u",
                        "codePoint": 117
                    },
                    {
                        "type": "RepetitionExp",
                        "exp": {
                            "type": "CharSet",
                            "chars": [
                                {
                                    "type": "CharRange",
                                    "charStart": {
                                        "type": "SimpleChar",
                                        "value": "a",
                                        "codePoint": 97
                                    },
                                    "charEnd": {
                                        "type": "SimpleChar",
                                        "value": "f",
                                        "codePoint": 102
                                    }
                                },
                                {
                                    "type": "MetaChar",
                                    "meta": "d"
                                }
                            ],
                            "negative": false
                        },
                        "quantifier": {
                            "type": "OneOrMoreQuantifier",
                            "greedy": true
                        }
                    }
                ]
            },
            "capturing": true
        }
    ]
}
```

### 生成状态结构

将上一步生成的语法树解析为 `有限自动机` 的状态结构：

`$ npm run table "0|(u[a-f\d])+"`

结果：

```text
====================
   0:  "0" -> 1
   1:  ε -> 9
   2:  "u" -> 3
   3:  ε -> 4
   4:  "[a-f0-9]" -> 5
   5:  ε -> 4, ε -> 7
   6:  ε -> 2
   7:  ε -> 9
   8:  ε -> 0, ε -> 6
  9*:  []
--------------------
in state: 8
out state: 9
```

### 测试字符串

使用目标字符串测试正则表达式：

- `$ npm run match "0|(u[a-f\d]+)" "0"`
  `true`

- `$ npm run match "0|(u[a-f\d]+)" "u0ac3"`
  `true`

- `$ npm run match "0|(u[a-f\d]+)" "21"`
  `false`

- `$ npm run match "0|(u[a-f\d]+)" "ok"`
  `false`

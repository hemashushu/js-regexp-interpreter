# JS Regexp Interpreter

一个极其简陋的正则表达式解析器（interpreter），用于学习之目的，代码当中有每一部分的详细说明。

语法参照 JavaScript 版本的 Regex。
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

**不支持：**

- 元字符 `.`，`\0`，`[\b]`；
- 字符集里的表示 "非" 的元字符 `\S`，`\W`，`\D`，比如 `[\Wabc]`，`[^\Wabc]`；
- 对分组命名，比如 `(?<name>...)`，`\k<name>`；
- 对分组设置为不捕获，比如 `(?:...)`；
- 反向引用，比如 `\1`；
- 所有断言 `^`，`$`，`\b`，`\B`，`(?=...)`，`(?!...)`，`(?<=...)`，`(?<!...)`；
- 暂不支持 `\xhh` 和 `\uhhhh` 这两种字符表示法。

**支持：**

- 单个字符，比如 `a`，`文`；
- Unicode 字符，比如 `\u{hhhh}` 和 `\u{hhhhhh}`；
- 字符集，比如 `[abc]`，`[a-z]`，`[0-9a-f]`；
- 元字符，比如 `\w`，`\d`；
- 重复，比如 `a+`，`a?`，`a*`，`a{2}`，`a{2，}`，`a{2，3}`，`[abc]+`，`[0-9]*`；
- 非贪婪模式的重复，比如 `a+?`，`a??`；
- "连接"，比如 `ab`，`a+b`，`0x[0-9a-f]+`；
- "或"，比如 `a|b`，`[0-9]+|0x[0-9a-f]+`。
- 分组，比如 `(a)`，`(a)(x)`

## 命令行测试

在当前项目源码的首层文件夹里可以执行下面命令解析器的各个阶段的功能。

### 符号化正则表达式字符串

将正则表达式字符串符号化：

`$ npm run lex "0|(u[a-f\d]+)"`

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

生成正则表达式对应的语法树：

`$ npm run ast "0|(u[a-f\d]+)"`

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

### 生成有限自动机的状态

生成正则表达式对应的 `非确定有限自动机` （`NFA`）的状态：

`$ npm run state "0|(u[a-f\d])+"`

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

使用 `目标字符串` 测试 `正则表达式`：

- `$ npm run match "0|(u[a-f\d]+)" "0"`
  结果： `true`

- `$ npm run match "0|(u[a-f\d]+)" "u0ac3"`
  结果： `true`

- `$ npm run match "0|(u[a-f\d]+)" "21"`
  结果： `false`

- `$ npm run match "0|(u[a-f\d]+)" "ok"`
  结果： `false`

## 单元测试

`$ npm test`

项目无依赖，如无意外应该能看到 `All passed.` 字样。

## 单步调试/跟踪

有时跟踪程序的运行过程，能帮助对程序的理解，启动单步调试的方法是：

在 vscode 里打开该项目，然后在单元测试文件里设置断点，再执行 `Run and Debug` 即可。

## 将本项目作为你的项目的库

使用下面命令可以将本项目作为依赖项添加到你的项目（你的项目也需要是一个 `npm` 项目）：

`$ npm i js-regexp-interpreter`

添加之后可以在你的项目源码的首层文件夹里执行下面命令测试正则表达式：

`$ npm exec js-regexp-match "a*" "aaa"`

## 安装 CLI 程序

首先安装本项目到全局：

`$ sudo npm install -g js-regexp-interpreter`

然后就可以在任意文件路径下使用命令 `js-regexp-match`，比如：

`$ js-regexp-match "a*" "aaa"`

### API

本项目（包、package）提供了 3 个常用的方法：

- test(expStr, testStr)
  检查 `正则表达式` 是否和 `目标字符串` 匹配。

- compile(expStr)
  编译 `正则表达式` 为 `NFA` 的状态对象。

- matchString(state, testStr)
  检查状态对象是否和 `目标字符串` 匹配。

示例：

```javascript
import { Matcher } from 'js-regexp-interpreter';

let result = Matcher.test('a*b', 'aaaab'); // true
```

编译过程比较耗时，如果需要使用同一个正则表达式多次匹配目标字符串，可以先把正则表达式编译成状态对象，然后保存起来。再重复使用这个状态对象跟目标字符串去匹配。

示例：

```javascript
import { Matcher } from 'js-regexp-interpreter';

// 编译
let {inState} = Matcher.compile('a*b');

// 匹配
let result = Matcher.matchString(inState, 'aaaab'); // true
```

## 字符串搜索算法系列项目

- JS Rabin-Karp Matcher
  https://github.com/hemashushu/js-rabin-karp-matcher

- JS Boyer-Moore-Horspool Matcher
  https://github.com/hemashushu/js-boyer-moore-horspool-matcher

- JS KMP Matcher
  https://github.com/hemashushu/js-kmp-matcher

- JS Aho-Corasick Matcher
  https://github.com/hemashushu/js-aho-corasick-matcher

- JS Regexp Interpreter
  https://github.com/hemashushu/js-regexp-interpreter

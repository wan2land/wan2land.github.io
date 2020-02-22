---
layout: post
title: "파서 만들기 (2) - JSON.parse"
summary: "JSON.parse 함수를 직접 만들어 봅시다."
date: 2020-02-22 17:02:51 +09:00
tags: ["javascript", "parser", "serializer", "compiler"]
---

지난 1편에서 만들어진 문자열을 자바스크립트 객체로 파싱하는 작업을 진행하겠습니다.

파싱([구문분석](https://ko.wikipedia.org/wiki/%EA%B5%AC%EB%AC%B8_%EB%B6%84%EC%84%9D))은 크게 두개의 과정을 통해 진행됩니다.

1. 어휘 분석(Lexical Analysis): 텍스트를 분석해서 토큰으로 만들어냅니다.
2. 구문 분석(Syntax Analysis) : 생성된 토큰의 구조를 분석하여 컴퓨터가 이해할 수 있는 자료구조인 파스 트리(Parse Tree)를 만듭니다.
3. 작성된 파스트리를 기반으로 원하는 작업을 만듭니다.

파싱의 꽃, 컴파일러의 꽃, 어휘분석부터 진행해보겠습니다.

### 어휘 분석(Lexical Analysis)

JSON을 분석하기전에 가장 기본적인 JSON 타입을 몇개 살펴보겠습니다.

- NULL - `null`
- 불리언 - `true`
- 문자열 - `"abc"`
- 숫자 - `3.1415`
- 배열 - `["foo"]`
- 객체 - `{"foo":null}`

컴퓨터는 이 각각의 문자열을 어떻게 구분할까요? 그 전에, 우리(사람)는 이 문자열이 어떤타입인지 어떻게 유추할까요?

불리언과 NULL은 문자열이 정해져있어서 간단히 찾을 수 있습니다. 문자열은 처음과 끝이 `"`로 되어있는 문자열을 찾으면 됩니다. 숫자는 `0-9`와 `.`으로 구성되어있습니다. 배열은 `[`, `]`, 객체는 `{`, `}`로 감싸져있습니다. 그리고 배열과 객체는 내부에 다시 저러한 타입을 재귀적으로 포함하고 있습니다.

이러한 규칙을 통해 구성되는 최소의 단위를 **토큰**이라고 합니다. 그리고 이렇게 토큰으로 처리하는 과정을 **어휘 분석(Lexical Analysis)**이라고 합니다. 컴파일러를 만들 때 토큰은 정규표현식으로 표현 가능합니다. JSON의 경우 다음과 같이 정리할 수 있습니다.

```
T_NULL = /null/
T_BOOLEAN = /false|true/
T_STRING = /"(?:[^"\\]*|\\")*"/
T_NUMBER = /(-?[0-9]+(?:\.[0-9]*)?)/
```

그리고, `{`, `}`, `[`, `]`, `:`, `,`와 같은 특수문자도 토큰이라고 할 수 있습니다.

다음과 같은 JSON 구문을 토큰으로 변환해보겠습니다.

```json
{
  "null": null,
  "string": "hello world",
  "array": ["string", true, false, 3.141592],
  "object": {
    "array": [1, 2, 3]
  }
}
```

```
{
  T_STRING: T_NULL,
  T_STRING: T_STRING,
  T_STRING: [T_STRING, T_BOOLEAN, T_BOOLEAN, T_NUMBER],
  T_STRING: {
    T_STRING: [T_NUMBER, T_NUMBER, T_NUMBER]
  }
}
```

### 구문 분석(Syntax Analysis)

다음의 JSON문장을 보면 모두 토큰으로 변환이 가능합니다.

```json
{
  "abcd", 50, true, ["abc": "def"]
}
```

```
{
  T_STRING, T_NUMBER, T_BOOLEAN, [T_STRING: T_STRING]
}
```

하지만, 우리는 잘못된 JSON 문법이란걸 알 수 있습니다. 이 문법이 잘못되었다는 것을 어떻게 알 수 있었을까요? 바로 순서입니다. 이 토큰간의 순서를 통해서 JSON 문법을 정의해야 합니다. 이러한 과정을 **구문 분석(Syntax Analysis)**라고 합니다.

JSON은 `null`, `boolean`, `number`, `string`, `array`, `object` 중 하나의 형태를 가집니다. 즉 다음과 같이 정의할 수 있습니다. 여기서 파이프문자(`|`)는 `or`을 의미합니다.

```
json = T_NULL
  | T_BOOLEAN
  | T_NUMBER
  | T_STRING
  | array
  | object
```

배열(`array`)은 어떻게 생겼을까요? 배열은 3개의 특수문자(`[`, `,`, `]`)와 내부에는 재귀적으로 `json`을 다시 포함할 수 있습니다.

```
array: '[' ']'         // 빈 배열
  | '[' values ']'     // 다른값이 열거된 형태의 배열

values: json
  | json ',' values   // values를 재귀로 사용합니다.
```

배열은 빈 배열과, 비어있지 않은 배열 두가지 방식으로 표현됩니다. 그리고 비어있지 않은 배열에는 값(`values`)이 들어갑니다. 값(`values`)의 표현식에는 재귀문이 포함되어있습니다. 재귀를 통해 1개부터 n개의 값(`json`)으로 표현할 수 있습니다. 여기서 `json`을 통해 재귀적으로 JSON 객체를 다시 가질 수 있다는 점을 보셔야 합니다.

객체(`object`)를 정의해봅시다.

```
object: '{' '}'
  | '{' objectpairs '}'

objectpairs: objectpair
  | objectpairs ',' objectpair

objectpair: T_STRING ':' json
```

객체는 Key-Value로 구성되어있고, 키(Key)값은 `string`과 규칙을 같이합니다. Key-Value는 `objectpair`를 이용하여 표현하였고, 1개부터 n개까지 포함할 수 있는 부분은 위의 배열 부분(`values`)과 굉장히 유사함을 알 수 있습니다.


### `JSON.parse` 만들기

이제 위 내용을 그대로 코딩하면 JSON 파서가 구현됩니다.

`Lexical Analyzer`, `Syntax Analyzer`라는 키워드를 이용해서 검색하면 언어별로 다양한 라이브러리가 나옵니다. 참고로, 라이브러리 문서에 LL파서, LR파서, LALR파서 등과 같은 용어가 나오는데, 이는 파싱 방법에 대한 내용입니다. 더 관심이 생긴다면 해당 키워드로 검색해보면 많은 자료를 찾아볼 수 있습니다.

자바스크립트에는 다음 3개를 가장 많이 사용하고 있습니다.

- [nearley](https://github.com/kach/nearley)
- [Jison](https://github.com/zaach/jison)
- [PEG.js](https://github.com/pegjs/pegjs)

이런 손쉬운 라이브러리들이 있음에도 불구하고, 파싱과정을 자세히 이해하기 위해 바닐라(!?!)로 작업하겠습니다. 정규표현식 없이 파서를 작성하였는데, 이는 실제 정규표현식이 어떤 원리로 동작하는지 이해하는데 도움이 될 것입니다. 만약에 파서를 만들고자 한다면, 이 글에서 작성하는 코드는 참고만 하시고, 위의 라이브러리를 이용하시는게 정신건강에 좋습니다.

기본적으로 파서는 주어진 문자열을 앞에서부터 읽으며 처리합니다. 가장 기본 코드는 다음과 같습니다. 다음 코드 중, 실제로 사용자 쪽에 노출되는 함수는 `parse`입니다.

```javascript
const WS_CHARS = new Set(['\r', '\n', '\t', ' '])

let buf = null // buffer에는 파싱할 문자열을 저장합니다.
let pos = 0    // 현재 확인 중인 문자열의 위치를 저장합니다.

// 공백 문자열이 있는 경우 무시합니다.
function white() {
  while (WS_CHARS.has(buf[pos])) {
    pos++
  }
}

// 에러처리
function error() {
  return new SyntaxError(`Unexpected ${buf[pos] ? `token ${buf[pos]}` : 'end'} in JSON at position ${pos}`)
}

function parse(ctx) {
  // buffer와 pos를 초기화합니다.
  buf = ctx
  pos = 0

  const result = json() // json 처리한 결과를 저장합니다.
  white()               // json 처리 후, 공백문자열을 제거합니다.
  if (buf.length !== pos) { // 구조상 더이상 파싱할 내용이 없는데, 파싱할 내용이 있으면 에러를 발생시킵니다.
    throw error()
  }
  return result // 문제가 없으면 json 처리한 결과를 반환합니다.
}
```

편의를 위해서 다음 함수도 하나 추가합니다. 현재 위치한 문자(`buf[pos]`)가 제시한 문자(`char`)와 같으면 정상처리하고, 아니라면 에러를 발생시킵니다.

```javascript
function consume(char) {
  if (buf[pos] === char) {
    pos++
    return
  }
  throw error()
}
```

`parse` 함수에 있는 `json()` 함수는 문법 규칙 중 다음 내용에 해당하는 함수입니다.

```
json = T_NULL
  | T_BOOLEAN
  | T_NUMBER
  | T_STRING
  | array
  | object
```

컴파일러는 현재 위치한 하나의 문자(`buf[pos]`)만을 읽어들여서 판단해야합니다. 각 토큰의 첫번째 문자를 통해 뒤에 어떤 내용이 나올지 예측할 수 있습니다.

```javascript
function json() {
  white()                  // 공백문자를 제거합니다.
  switch (buf[pos]) {
    case '{':
      return object()
    case '[':
      return array()
    case '"':
      return string()
    case '-':
    case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': {
      return number()
    }
    case 't': {
      pos++
      consume('r')
      consume('u')
      consume('e')
      return true
    }
    case 'f': {
      pos++
      consume('a')
      consume('l')
      consume('s')
      consume('e')
      return false
    }
    case 'n': {
      pos++
      consume('u')
      consume('l')
      consume('l')
      return null
    }
  }
  throw error()
}
```

`true`와 `false`, `null` 부분을 살펴봅시다. 현재 문자(`buf[pos]`)가 `t`라면 `true`가 나올거라고 예측할 수 있습니다. 그 뒤에 `r`, `u`, `e`를 순서대로 제대로 문자가 나타났는지 확인하고, 전부 정상적으로 등장했다면 `true`를 반환합니다.

```javascript
switch (buf[pos]) {
  ...
  case 't': {
    pos++
    consume('r')
    consume('u')
    consume('e')
    return true
  }
  ...
}
```

`number()` 함수는 다음과 같이 정의합니다.

```javascript
const NUM_CHARS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])

function number() {
  let result = ''
  let isNeg = false
  if (buf[pos] === "-") { // 문자열이 -로 시작하면 음수입니다.
    isNeg = true
    pos++
  }
  if (NUM_CHARS.has(buf[pos])) { // 그 뒤에는 숫자 문자 중에 하나의 값이 나와야 합니다.
    result += buf[pos]
    pos++
  } else {
    throw error()
  }
  while (NUM_CHARS.has(buf[pos])) {
    result += buf[pos]
    pos++
  }
  if (buf[pos] === ".") { // . 문자가 등장하면 소수점을 처리합니다.
    result += ".";
    pos++
    if (NUM_CHARS.has(buf[pos])) { // 소수점 뒤에는 반드시 숫자 문자 중 하나의 값이 나와야 합니다.
      result += buf[pos]
      pos++
    } else {
      throw error()
    }
    while (NUM_CHARS.has(buf[pos])) {
      result += buf[pos]
      pos++
    }
  }
  return isNeg ? -1 * +result : +result // 나온 결과를 숫자로 변경해서 반환합니다.
}
```

`string()` 함수는 다음과 같이 정의합니다.


```javascript
const STRING_ESC = {
  '"': '"',
  '\\': '\\',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t'
}

function string() {
  let result = ''
  pos++               // 첫번째 " 문자를 처리합니다.
  while (1) {
    if (buf[pos] === '"') { // 다시 " 문자가 나오면 문자열이 끝났음을 알 수 있습니다.
      pos++
      return result // 결과를 그대로 반환합니다.
    }
    if (buf[pos] === '\\') { // 백슬래시 문자를 처리합니다.
      pos++
      if (buf[pos] === 'u') { // 유니코드를 처리합니다.
        pos++
        let uffff = 0
        for (let i = 0; i < 4; i++) {
          let hex = parseInt(buf[pos], 16)
          if (!isFinite(hex)) {
            throw error()
          }
          pos++
          uffff = uffff * 16 + hex;
        }
        result += String.fromCharCode(uffff);
      } else if (STRING_ESC[buf[pos]]) { // 백슬래시와 함께 합쳐서 사용하는 경우를 처리합니다.
        result += STRING_ESC[buf[pos]]
        pos++
      } else {
        throw error()
      }
    } else {
      result += buf[pos]
      pos++
    }
  }
}
```

배열(`array()`)은 다음과 같이 처리합니다.

```javascript
function array() {
  pos++                 // 처음 등장한 [ 문자를 처리합니다.
  white()
  if (buf[pos] === ']') { // 바로 ] 문자로 끝나면 빈 배열을 반환합니다.
    pos++
    return []
  }
  const result = [json()]    // 빈배열이 아니라면 현재 값을 기준으로 json()를 다시 처리합니다.
  white()
  while (buf[pos] === ',') { // 콤마가 있으면 계속 반복합니다.
    pos++
    result.push(json())
    white()
  }
  if (buf[pos] === ']') { // 마지막에 ] 문자로 끝나면 정상적인 배열을 반환합니다.
    pos++
    return result
  }
  throw error()
}
```

객체(`object()`)는 다음과 같이 처리합니다.

```javascript
function object() {
  pos++
  white()
  if (buf[pos] === "}") {   // 빈 객체를 반환
    pos++
    return {}
  }
  const result = {}
  while (1) {
    const key = string()    // key는 string 처리와 같습니다.
    white()
    if (buf[pos] !== ':') { // key 뒤에 콜론(:)이 나오지 않으면 잘못된 문법입니다.
      throw error()
    }
    pos++
    result[key] = json()    // value는 json이 재귀적으로 포함될 수 있습니다.
    white()
    if (buf[pos] === ',') { // 콤마가 나오면 계속 반복합니다.
      pos++
      white()
      continue
    }
    if (buf[pos] === '}') {
      pos++
      return result
    }
    throw error()
  }
}
```

다 만들었습니다. :-) 정상적으로 동작하는지 확인해봅시다.

```javascript
console.log(parse(JSON.stringify({
  foo: "string!",
}))) // 제대로 출력됩니다. :-)
```

잘못된 문법을 넣어도 제대로된 에러가 발생합니다. (에러 메시지는 내장 `JSON.parse` 메시지와 동일하게 맞춰두었습니다.)

```javascript
parse('{"abc",}')
// Thrown: SyntaxError: Unexpected token , in JSON at position 6
```

## 파서 확장하기

지난번 글에서 시리얼라이저를 정규표현식, `Infinity`, `NaN`가 처리되도록 하였습니다. 일단 `json()` 함수를 다음과 같이 개선합니다.

```javascript
function json() {
  white()
  switch (buf[pos]) {
    ...
    case '/':                     // 정규표현식은 / 문자로 시작합니다.
      return regexp()
    ...
    case '-': case 'I': case 'N': // Infinity, NaN 처리를 위해서 이 부분에 케이스를 2개 추가합니다.
    case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': {
      return number()
    }
    ...
  }
  throw error()
}
```

정규표현식(`regexp()`)은 다음과 같이 구현할 수 있습니다.

```javascript
function regexp() {
  let result = ''
  pos++
  if (buf[pos] === '/') { // 정규표현식 시작하자마자 슬래시(/)가 등작하면 에러 발생.
    throw error()
  }
  while (1) {
    if (buf[pos] === '/') { // 슬래시가 등장하면 뒤에 플래그를 체크하고 정규표현식을 반환합니다. 여기서는 플래그를 igm으로만 한정하였습니다.
      pos++
      switch (buf[pos]) {
        case 'i': {
          pos++
          switch (buf[pos]) {
            case 'm': {
              pos++
              if (buf[pos] === 'g') {
                pos++
                return new RegExp(result, 'img')
              } else {
                return new RegExp(result, 'im')
              }
            }
            case 'g': {
              pos++
              if (buf[pos] === 'm') {
                pos++
                return new RegExp(result, 'igm')
              } else {
                return new RegExp(result, 'ig')
              }
            }
            default: {
              return new RegExp(result, 'i')
            }
          }
        }
        case 'm': {
          pos++
          switch (buf[pos]) {
            case 'i': {
              pos++
              if (buf[pos] === 'g') {
                pos++
                return new RegExp(result, 'mig')
              } else {
                return new RegExp(result, 'mi')
              }
            }
            case 'g': {
              pos++
              if (buf[pos] === 'i') {
                pos++
                return new RegExp(result, 'mgi')
              } else {
                return new RegExp(result, 'mg')
              }
            }
            default: {
              return new RegExp(result, 'm')
            }
          }
        }
        case 'g': {
          pos++
          switch (buf[pos]) {
            case 'm': {
              pos++
              if (buf[pos] === 'i') {
                pos++
                return new RegExp(result, 'gmi')
              } else {
                return new RegExp(result, 'gm')
              }
            }
            case 'i': {
              pos++
              if (buf[pos] === 'm') {
                pos++
                return new RegExp(result, 'gim')
              } else {
                return new RegExp(result, 'gi')
              }
            }
            default: {
              return new RegExp(result, 'g')
            }
          }
        }
      }
      return new RegExp(result)
    } else if (buf[pos] === '\\') { // 백슬래시가 등장하면 하나의 문자를 더 처리합니다.
      result += buf[pos]
      pos++
      result += buf[pos]
      pos++
    } else {
      result += buf[pos]
      pos++
    }
  }
}
```

숫자 처리(`number()`)는 다음과 같이 개선합니다.

```javascript
function number() {
  if (buf[pos] === 'N') { // NaN 처리
    pos++
    consume('a')
    consume('N')
    return NaN
  }

  let result = ''
  let isNeg = false
  if (buf[pos] === "-") {
    isNeg = true
    pos++
  }
  if (buf[pos] === 'I') { // Infinity 처리, 음수 처리 뒤에 위치하여 -Infinity도 처리하도록 합니다.
    pos++
    consume('n')
    consume('f')
    consume('i')
    consume('n')
    consume('i')
    consume('t')
    consume('y')
    return isNeg ? -Infinity : Infinity
  }
  if (NUM_CHARS.has(buf[pos])) {
    result += buf[pos]
    pos++
  } else {
    throw error()
  }
  while (NUM_CHARS.has(buf[pos])) {
    result += buf[pos]
    pos++
  }
  if (buf[pos] === ".") {
    result += ".";
    pos++
    if (NUM_CHARS.has(buf[pos])) {
      result += buf[pos]
      pos++
    } else {
      throw error()
    }
    while (NUM_CHARS.has(buf[pos])) {
      result += buf[pos]
      pos++
    }
  }
  if (buf[pos] === "e" || buf[pos] === "E") { // 3.0e+10 와 같은 숫자를 처리할 수 있도록 합니다.
    result += buf[pos]
    pos++
    if (buf[pos] === "-" || buf[pos] === "+") {
      result += buf[pos]
      pos++
    }
    if (NUM_CHARS.has(buf[pos])) {
      result += buf[pos]
      pos++
    } else {
      throw error()
    }
    while (NUM_CHARS.has(buf[pos])) {
      result += buf[pos]
      pos++
    }
  }
  return isNeg ? -1 * +result : +result
}
```

전체 동작하는 코드는 [Github](https://github.com/wan2land/json-by-js/blob/master/parse.js)에서 확인가능합니다. 이 코드를 이용하여 실제로 동작시켜보면 정상적으로 동작합니다.

이제 파서를 만들수 있게 되었습니다. (짝짝짝)

과거에 [Safen](https://github.com/wan2land/safen)이라는 Validation 라이브러리를 만든적이 있는데, 이때 이 파싱 기법을 활용하여 만들었습니다. 처음에는 어렵지만 한번 익혀두면 꽤 유용하게 사용할 수 있을겁니다. :^)

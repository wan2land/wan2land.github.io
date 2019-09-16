요즘의 웹개발자분들은 서버와 통신할 때 JSON을 자주 만나게 됩니다. 서버에서 내려주거나, 프론트앤드에서 보낼 때 JSON을 만들때 보통은 내장객체를 사용합니다.

```javascript
const obj = {foo: "string!", bar: 30}
const json = JSON.stringify(obj) // '{"foo":"string!","bar":30}'
JSON.parse(json) // === obj 와 동일한 값.
```

객체를 JSON으로 변경할 땐, `stringify`를, JSON을 다시 객체로 되돌릴 때는 `parse`를 사용합니다. 이 JSON 파서가 지원하는 타입은 겨우 `string`, `number`, `boolean`, `null` 타입정도입니다. 정규표현식은 물론, 심지어 `number`타입인 `Infinity`, `NaN`(놀랍게도 `typeof NaN === "number"` 입니다.)은 `null`처리됩니다.

```javascript
const obj = {
  isregexp: /email/,
  isinfinity: Infinity,
  isninfinity: -Infinity,
  isnan: NaN,
}

JSON.stringify(obj) // '{"isregexp": {}, "isinfinity":null,"isninfinity":null,"isnan":null}'
```

이러한 성질을 잘 이해하고 기본 타입만을 이용해서 REST를 사용하고 있다면 큰 문제는 없습니다. 근데 만약에 서버에서 정말로 `Infinity`나, 정규표현식 등을 내려주고 싶다면 어떻게할까요.

```json
{
  "infinity": "Infinity",
  "regexp": "/aaaa/"
}
```

보통은 문자열로 묶어서 전달할겁니다. 그리고 문자열을 비교해서 "Infinity" 문자열이라면 Infinity처럼 처리하겠지요. 뭔가 마음이 불편해집니다. 이 문제를 제대로 해결해야할 것 같습니다.(!!)

## `stringify` 만들기

`JSON.stringify`(이하 `stringify`) 함수는 Javascript Object를 `string`의 형태로 파싱합니다. 파싱의 과정을 요약하면 다음과 같습니다.

1. 어휘 분석(Lexical Analyze): 텍스트를 분석해서 토큰으로 만들어냅니다.
2. 구문 분석(Syntax Analyze) : 생성된 토큰의 구조를 분석하여 컴퓨터가 이해할 수 있는 자료구조인 AST(Abstract Syntax Tree)를 만듭니다.
3. 작성된 AST를 기반으로 원하는 작업을 만듭니다.

근데 정말 다행이도, `stringify` 작업은 자바스크립트 객체 자체를 실행하기 때문에 위 작업을 전혀 할 필요가 없습니다. 이미 자바스크립트 엔진이 위 작업을 전부 진행하였고, 그 최종 결과물이 자바스크립트 객체이기 때문입니다. `stringify`작업에서는 이 자바스크립트 객체를 AST로서 활용해봅시다.

우선은, 내장 함수 `JSON.stringify`와 동일하게 동작하는 `stringify` 함수를 만들어봅시다.

가장 간단한 기본 자료형(`string`, `number`, `boolean`, `null`)을 먼저 작성해봅시다.

```javascript
function stringify(value) {
  if (value === null) {
    return "null"
  }
  if (typeof value === "number") {
    return `${value}`
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }
  if (typeof value === "string") {
    return `"${value.replace('"', '\\"')}"` // " 문자는 escape 해야합니다.
  }
}

// test scalar
console.log(stringify(null) === "null") // true
console.log(stringify(true) === "true") // true
console.log(stringify(false) === "false") // true
console.log(stringify("hello") === "\"hello\"") // true
console.log(stringify("he\"llo") === "\"he\\\"llo\"") // true
```

그 다음은 덜 복잡한 `array`를 처리합니다. `array` 내부의 값은 재귀함수를 이용해 처리합니다.

```javascript
function stringify(value) {
  /* ...생략... */
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(",")}]` // 재귀함수로 처리합니다.
  }
}

// test array
console.log(stringify([1,2,3]) === "[1,2,3]") // true
console.log(stringify([1,[1,2,3],3]) === "[1,[1,2,3],3]") // true
console.log(stringify([true, false, "hello", null]) === "[true,false,\"hello\",null]") // true
```

그리고 복잡한 `object`를 처리합니다. 위에 일반적인 케이스는 다 처리했기 때문에 그외의 케이스는 전부 `object`로 봐도 무방합니다.

```javascript
function stringify(value) {
  /* ...생략... */
  return `{${Object.entries(value).map(([k, v]) => `"${k.replace('"', '\\"')}":${stringify(v)}`).join(",")
}}` // 키 값의 " 문자는 이스케이프 합니다. val 부분은 재귀함수로 처리합니다.
}

// test object
console.log(stringify({foo: "hello"}) === "{\"foo\":\"hello\"}") // true
console.log(stringify({
  foo: "string!",
  bar: 30.3333,
  baz: true,
  qux: {
    foo: {},
    bar: {
      foo: "string!!!",
    },
    baz: 20.2222,
  }
}) === "{\"foo\":\"string!\",\"bar\":30.3333,\"baz\":true,\"qux\":{\"foo\":{},\"bar\":{\"foo\":\"string!!!\"},\"baz\":20.2222}}") // true
```

내장함수 `JSON.stringify`와 동일하게 동작하는 `stringify`를 만들었습니다.

이제 우리가 하고 싶었던 작업을 추가해봅시다. `Infinite`, `-Infinity`, `NaN`을 추가합니다. 이 3가지 값은 모두 `number` 타입이니 해당하는 부분을 수정합니다.

```javascript
function stringify(value) {
  /* ...생략... */
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      return "NaN"
    }
    if (!Number.isFinite(value)) {
      return value > 0 ? "Infinity" : "-Infinity"
    }
    return `${value}`
  }
  /* ...생략... */
}

// test infinity & nan
console.log(stringify(Infinity) === "Infinity") // true
console.log(stringify(-Infinity) === "-Infinity") // true
console.log(stringify(NaN) === "NaN") // true
console.log(stringify({foo: Infinity}) === "{\"foo\":Infinity}") // true
```

정규표현식은 `instanceof`를 통해 확인할 수 있습니다. 또한 `toString` 메서드를 통해 쉽게 `string`으로 변환할 수 있습니다.

```javascript
function stringify(value) {
  /* ...생략... */
  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(",")}]`
  }
  if (value instanceof RegExp) {
    return value.toString()
  }
  return `{${Object.entries(value).map(([k, v]) => `"${k.replace('"', '\\"')}":${stringify(v)}`).join(",")
}}`
}

// test regexp
console.log(stringify(/asdf/) === "/asdf/") // true
console.log(stringify(new RegExp("asdf")) === "/asdf/") // true
console.log(stringify(/asdf/gi) === "/asdf/gi") // true
console.log(stringify(new RegExp("asdf", "gi")) === "/asdf/gi") // true
```

제대로 동작하는지 한번 돌려봅시다.

```javascript
stringify({
  string: "foo",
  number: 30,
  number2: 3.14156,
  true: true,
  false: false,
  null: null,
  infinity: Infinity,
  ninfinity: -Infinity,
  nan: NaN,
  re: /hello/gi,
  array: [1,2,3],
  object: {
    foo: "hello"
  }
})
// {"string":"foo","number":30,"number2":3.14156,"true":true,"false":false,"null":null,"infinity":Infinity,"ninfinity":-Infinity,"nan":NaN,"re":/hello/gi,"array":[1,2,3],"object":{"foo":"hello"}}
```

아직은 이렇게 만들어진 문자열을 자바스크립트 객체로 바꿀 수 있는 파서가 없습니다. 파서를 만들기 위해서는 이번에는 생략했던 1~3번 과정을 정확히 이해해야합니다.

2편에서 계속 이야기해보겠습니다. :-)



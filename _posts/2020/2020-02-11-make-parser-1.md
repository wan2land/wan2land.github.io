---
layout: post
title: "파서 만들기 (1) - JSON.stringify"
summary: "JSON.stringify 함수를 직접 만들어 봅시다."
date: 2020-02-11 18:52:55 +09:00
tags: ["javascript", "parser", "serializer", "compiler"]
---

프로그래밍을 하다보면 규칙을 가진 문자열에서 필요한 형태로 가공해야할 때가 있습니다. 간단하게는 URL에서 부터 복잡하게는 XML, JSON 등이 있습니다. 다른사람들도 다 사용하고 있는 표준화된 경우 라이브러리를 쉽게 구할 수 있습니다. 하지만 해당 표준이 유명하지 않거나, 또 내가 그 표준을 정의했다면 어쩔 수 없이 파서(Parser)를 만드는 일이 벌어지곤 합니다.

예를들어, 배열과 유사한 문자열을 배열로 파싱해봅시다.

```javascript
const text = '[1, 2, 3]'
const parsed = text.slice(1, -1).split(',').map(chunk => +chunk.trim())
```

이와 반대로, 배열을 문자열로 바꿔야하는 경우도 있습니다.

```javascript
const array = [1, 2, 3]
const serialized = '[' + array.join(',') + ']'
```

문자열에서 원하는 형태로 가공하는 것을 파싱(Parsing)이라고 하고, 객체에서 문자열로 바꾸는 과정을 시리얼라이즈(Serialize / 직렬화)한다고 합니다. 파싱을 하기 위해서는 파서(Parser)를 만들어야하고, 시리얼라이즈하기 위해서는 시리얼라이저(Serializer)를 만들어야 합니다.

위의 예시처럼 규칙이 단순하다면, 문자열 함수를 통해 쉽게 처리가 가능합니다. 하지만 복잡한 규칙을 만들어야 한다면 어떻게 될까요?

```javascript
const text = '[1, 2, 3, [4, 5]]'
// parsed = ?
```

```javascript
const array = [1, 2, 3, [4, 5]]
// serialized = ?
```

단순히 재귀를 추가했을 뿐인데 어떻게 만들어야 할지 바로 감이 오지 않습니다. 그런데 자바스크립트의 내장 함수인 `JSON.stringify`, `JSON.parse`는 이 작업을 해주고 있고, 우리는 쉽게 가져다 쓰고 있습니다.

```javascript
const text = '[1, 2, 3, [4, 5]]'
const parsed = JSON.parse(text)
```

```javascript
const array = [1, 2, 3, [4, 5]]
const serialized = JSON.stringify(array)
```

이 우리 눈에 익숙한 `JSON.stringify`, `JSON.parse`를 직접 구현하면서 파서와 시리얼라이저의 원리를 알아보도록 하겠습니다. :-)

## 시리얼라이저(`JSON.stringify`) 만들기

내장 함수 `JSON.stringify`와 동일하게 동작하는 `stringify` 함수 즉, 시리얼라이저를 만들어봅시다.

시리얼라이저를 만들기에 앞서 JSON의 구조를 살펴보겠습니다. JSON은 스칼라 자료형 `string`, `number`, `boolean`, `null` 4개, 여기에 배열(`array`)과 객체(`object`)가 추가된 총 6개의 자료형을 지원합니다.

여기서 가장 단순한 자료형인 스칼라 자료형(`string`, `number`, `boolean`, `null`)을 먼저 작성해봅시다.

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

그 다음은 배열(`array`)을 만들어 봅시다. 배열내부는 재귀함수를 활용하면 쉽게 처리할 수 있습니다.

```javascript
function stringify(value) {

  /* ...생략... */

  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(",")}]` // 재귀함수
  }
}

// test array
console.log(stringify([1,2,3]) === "[1,2,3]") // true
console.log(stringify([1,[1,2,3],3]) === "[1,[1,2,3],3]") // true
console.log(stringify([true, false, "hello", null]) === "[true,false,\"hello\",null]") // true
```

그리고 마지막으로 객체(`object`)를 만들어봅시다. 위에 스칼라 자료형과 배열을 처리했기 때문에 그외의 케이스는 전부 객체(`object`)라고 생각해도 괜찮습니다. 물론, 함수(`function`)도 있긴 한데, 여기서는 무시하겠습니다.

```javascript
function stringify(value) {

  /* ...생략... */

  // 키 값의 " 문자는 이스케이프 합니다. val 부분은 재귀함수로 처리합니다.
  return `{${Object.entries(value).map(([k, v]) => `"${k.replace('"', '\\"')}":${stringify(v)}`).join(",")}}`
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

내장함수 `JSON.stringify`와 동일하게 동작하는 `stringify`를 쉽게 만들 수 있었습니다.

## 시리얼라이저 확장하기

JSON 중에는 좀 더 많은 기능을 지원하는 [JSON5](https://json5.org)라는 표준이 있습니다. 위에서 만든 함수를 확장하여 JSON5와 같이 `number`타입인 `Infinity`, `NaN`을 추가로 구현해봅시다. 또, JSON5에서는 지원하지 않는 정규표현식 자료형도 지원하도록 개선해봅시다.

`Infinite`, `-Infinity`, `NaN`를 추가합니다. 이 3가지 값은 모두 `number` 타입이니 해당하는 부분을 수정합니다.

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
  return `{${Object.entries(value).map(([k, v]) => `"${k.replace('"', '\\"')}":${stringify(v)}`).join(",")}}`
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

**전체 소스**

```javascript
function stringify(value) {
  if (value === null) {
    return "null"
  }
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      return "NaN"
    }
    if (!Number.isFinite(value)) {
      return value > 0 ? "Infinity" : "-Infinity"
    }
    return `${value}`
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }
  if (typeof value === "string") {
    return `"${value.replace('"', '\\"')}"` // " 문자는 escape 해야합니다.
  }

  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(",")}]`
  }
  if (value instanceof RegExp) {
    return value.toString()
  }
  return `{${Object.entries(value).map(([k, v]) => `"${k.replace('"', '\\"')}":${stringify(v)}`).join(",")}}`
}
```

이 시리얼라이즈를 통해서 만들어진 문자열은 해석할 수 있는 파서가 없어 아직은 자바스크립트 객체로 바꿀 수 없습니다. 시리얼라이저에 비해 파서를 만드는 작업은 더 복잡합니다. 하지만, 이 작업은 프로그래밍의 **꽃**인 컴파일러를 만드는 과정 중의 일부일 뿐입니다. 파서를 만드는 일은 곧 컴파일러의 동작을 이해하게 되고, 이로서 프로그래밍 그 자체를 더 잘 알게되는 계기가 될 것입니다.

파서는 2편에서 만들어보도록 하겠습니다. :-)

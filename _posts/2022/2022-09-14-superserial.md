---
layout: post
title: "superserial 라이브러리 개발기"
summary: "이 글은 superserial이라는 라이브러리를 어떻게, 왜 만들게 되었는지를 소개하는 글입니다."
date: 2022-09-14 17:07:08 +09:00
tags: ["superserial", "serialize", "typescript"]
thumbnail: "/images/2022/2022-09-14-superserial/thumbnail.png"
---

[github.com/denostack/superserial](https://github.com/denostack/superserial)

업무를 하다가 오래걸리는 로직을 별도의 프로세스에서 처리하도록 분리할 일이 생겼고, [Job Queue](https://en.wikipedia.org/wiki/Job_queue)를 활용해서 구현하였습니다. Job을 Queue로 전달 할 때, Job 데이터를 전달할 때 객체 그대로 전달 할 수 없기 때문에 직렬화(Serialized)된 데이터로 변경해야합니다. 자바스크립트로 구현 할 땐, JSON을 주로 사용합니다.

하지만 JSON을 사용하다 보면 부족한 부분이 종종 있습니다. Number 타입의 경우 `Infinity` 같은 값이 존재합니다. 이를 JSON으로 변경하게 되면 `null`로 변경됩니다. 이를 실제로 활용하려면 직렬화(Serialize) 할 때 문자열(혹은 JSON이 지원하는 다른 Object 형태)로 변경해주어야 합니다. 그리고 이 값을 역직렬화(Deserialize) 할 때 다시 `Infinity`에 매핑해서 사용해야합니다.

```typescript
// 두번째 매개변수인 Replacer를 활용
const serialized = JSON.stringify(data, (key, value) => {
  if (value === Infinity) {
    return "Infinity"
  }
  return value
}) // {"value":"Infinity"}

const deserialized = JSON.parse(serialized, (key, value) => {
  if (value === 'Infinity') {
    return Infinity
  }
  return value
})
```

위와 같이 사용한다고 했을 때, 직렬화된 데이터(`{"value":"Infinity"}`)에서 `Infinity`를 표현한 숫자와, `"Infinity"`를 표현한 문자열을 어떻게 구분할 수 있을까요? 편의를 위해서 다양한 객체를 위와 같이 변경해서 사용한다고 했을 때 변경된 객체인지, 단순 오브젝트의 변경형인지 어떻게 구분할 수 있을까요? 이를 위해서는 문법의 확장이 필요해보였습니다.

이미 기존에 만들어져있는 라이브러리가 있는지 탐색하고, 원하는 기능이 있는지 정리하였습니다.

1. [JSON5](https://json5.org/) : `undefined`, `Infinity`, `NaN` 등의 특수한 값 사용가능
2. [flatted](https://github.com/WebReflection/flatted) : Circular 형식의 데이터 제공, JSON 형식의 확장
3. [v8.serialize](https://nodejs.org/api/v8.html#v8serializevalue) : Circular 사용 가능, 내장객체(Map, Set 등) 사용가능, 완전한 의미의 Serialize, Node.js에서만 사용가능. 사용자 정의 클래스 안됨.
4. [esserializer](https://github.com/shaochuancs/esserializer) : `BigInt`, `RegExp`, `Set` 객체 지원 (circular, Map은 유료..)

Circular한 맵, 사용자 정의 클래스를 사용하고 싶은데, 만족스러운 라이브러리를 찾을 수 없었습니다. 만족스런 라이브러리가 없으니... (올커니) 한번 만들어보기로 했습니다.

### Undefined, Infinity, NaN

이 부분은 과거에 한번 만들었던 적 있습니다. 또한 과거에 만들었던 코드를 기반으로 확장했습니다.

[파서 만들기 (1) - JSON.stringify](https://wan2.land/posts/2020/02/11/make-parser-1/)


### Circular

가장 해결하고 싶었던(=가장 재미있어 보이는 🤩) 문제는 Circular 였습니다. 객체(Object)와 배열(Array)은 자바스크립트 내에서도 Call by Reference를 통해 사용됩니다. Call by Reference를 통해 사용되는 객체는 직렬화 실행 이후에도 참조할 위치를 보내주면 되겠다고 생각했습니다. 이러한 방식을 구현하기 위해, JSON구조를 세미콜론을 이용해 묶고, `$0`, `$1` 와 같은 형식의 문법을 추가해서 접근할 객체의 위치를 표현하였습니다.

```typescript
const data1 = {} as any
const data2 = {} as any
data1.ref = data2
data2.ref = data1

const serialized = serializer.serialize(data1) // {"ref":$1};{"ref":$0}

serializer.deserialize(serialized) // <ref *1> { ref: { ref: [Circular *1] } }
```

배열은 다음과 같이 나타낼 수 있습니다.

```typescript
const arr = [
  { name: 'wan2land', pet: { name: "boririce" } },
  { name: 'wan3land' },
  { name: 'wan4land' },
  { name: 'wan5land' },
  { name: 'wan6land' },
]

serializer.serialize(arr)
// [$1,$2,$3,$4,$5];{"name":"wan2land","pet":$6};{"name":"wan3land"};{"name":"wan4land"};{"name":"wan5land"};{"name":"wan6land"};{"name":"boririce"}
```

가장 구현하면서 머리가 아팠던 부분은 자기 자신을 참조하는 형태입니다. 이 경우도 `$0`을 이용하면 쉽게 표현할 수 있었습니다.

```typescript
const data = {} as any
data.data = data

const serialized = serializer.serialize(data) // {"data":$0}

serializer.deserialize(serialized) // <ref *1> { data: [Circular *1] }
```

**조금 더 극단적인 상황**

다음과 같은 케이스도 고민해보았습니다.

```typescript
serializer.deserialize('$0')
```

말하자면, 나 자신을 바라보는 포인터인데 애초에 자바스크립트에서는 이런 형태의 객체는 불가능했고, 다른 언어라고 하더라고 필요 없어보여서 문법 에러(Syntax Error) 처리하였습니다.

```
Uncaught SyntaxError: Unexpected token $ in SuperSerial at position 0
```

### 추가 자료형 (BigInt, RegExp, Date, Map, Set)

BigInt와 RegExp는 실제 자바스크립트에서 사용하는 표현 그대로 사용하였습니다.

```typescript
serializer.serialize(100n) // 100n
serializer.serialize(/abc/gmi) // /abc/gmi
```

Date 객체는 타임존에 따라서 시간이 다르게 노출됩니다. 하지만 타임스탬프는 전세계 어느 런타임 환경에서도 고유의 값이 보장됩니다. Date 객체의 본질은 타임스탬프라고 생각하여 이를 사용했습니다.

```typescript
serializer.serialize(new Date("2022-02-02")) // Date(1643760000000)
```

Map의 경우 키 값에 객체가 들어올 수 있습니다. 따라서 새로운 문법을 만들어야 했습니다. Map을 `console.log`로 찍어보면 다음과 같이 나옵니다.

```typescript
console.log(new Map([[1, 2], [3, 4]]))
// Map { 1 => 2, 3 => 4 }
```

이러한 표현 방법을 사용했습니다.

```typescript
const map =  new Map()
map.set({}, "object value")
map.set("string", "string value")

serializer.serialize(map)
// Map($1=>"object value","string"=>"string value");{}
```

Set 또한 유사하게 구현하였습니다.

```typescript
const set = new Set([1, 2, 3, 4])
serializer.serialize(set)
// Set(1,2,3,4)
```


### 클래스 지원

클래스를 생각하기에 앞서, 원래는 함수 자체를 직렬화 하고 싶었습니다. 함수의 `toString` 메서드를 이용하면 쉽게 문자열로 받을 수 있습니다. 이를 응용하면 되지 않을까 생각했습니다.

```typescript
function hello() {
  return "world!"
}

console.log(hello.toString()) // 위의 함수 그대로 출력됨
```

테스트를 진행하다가, 해결할 수 없는 문제에 맞닥뜨리게 되었습니다. 바로 클로져 영역 바깥의 변수였습니다. 다음의 예시를 보면, 함수 `add`가 있는데 이를 문자열로 변환해서 보게되면 내부에 `ADDED_VALUE`라는 내용이 포함되어있습니다. 이 문자열을 다시 함수로 변환하게 되면 `ADDED_VALUE`라는 변수에 접근할 수 있어야 하는데 이 클로져 변수를 설정할 수가 없습니다.

```typescript
const ADDED_VALUE = 10
function add(n: number) {
  return n + ADDED_VALUE
}
```

함수를 직렬화해서 얻을 수 있는 이점이 무엇인지, 본질이 무엇인지 고민해보았습니다. 함수는 행동이고, 이 행동을 전달할만한 요소는 함수 말고도 클래스가 있습니다. 클래스 내부에도 메서드가 있기 때문입니다. 따라서 직렬화 할 때 클래스 내부 프로퍼티를 직렬화하고, 역직렬화 할 때 해당 클래스에 매핑해주면 쉽게 이용할 수 있겠다 싶었습니다. 즉, 클로져 변수를 인스턴스 내부에 가둬버리고 이 인스턴스를 직렬화하는 겁니다.

```typescript
class Adder {
  constructor(
    public n: number
  ) {
  }

  add(n: number) {
    return this.n + n;
  }
}
```

위와 같은 클래스를 선언하고, `Serializer`를 선언할 때, 사용할 클래스를 매개변수로 전달해주어야 합니다.

```typescript
const serializer = new Serializer({ classes: { Adder } });

const serialized = serializer.serialize(new Adder(100));
// Adder{"n":100}

const deserialized = serializer.deserialize(serialized)
deserialized.add(200) // 300
```

### toSerialize, toDeserialize

객체를 다루다보면 Private 값에는 접근할 수 없습니다. 위의 예시에서 n값을 `private` 프로퍼티로 변경하고 직렬화하면 내부 n값이 출력되지 않습니다.

```typescript
class Adder {
  #n: number
  constructor(
    n: number
  ) {
    this.#n = n
  }

  add(n: number) {
    return this.#n + n;
  }
}

const serializer = new Serializer({ classes: { Adder } });

serializer.serialize(new Adder(100));
// Adder{} - private에는 접근할 수 없음
```

이 또한 JSON에서 이미 해결할 수 있는 방법이 있었습니다. `toJSON`을 사용하면 됩니다. (잡설. `toString`이나, `toJSON`과 같은 과거의 특수 메서드들은 이름을 문자열로 제공해왔습니다. 이는 과거에는 심볼타입이 없던 시절에 구현되었기 때문입니다. 요즘에는 이러한 특수 메서드는 심볼 형식으로 제공하고 있습니다. `Symbol.iterator`가 대표적인 예입니다.) 이를 응용해서 특수메서드인 `toSerialize`, `toDeserialize`를 구현하였습니다. 이 두 특수메서드는 심볼로 제공됩니다.

```typescript
import { toSerialize, toDeserialize } from "superserial";

class Adder {
  #n: number
  constructor(
    n: number
  ) {
    this.#n = n
  }

  add(n: number) {
    return this.#n + n;
  }

	[toSerialize]() {
    return { n: this.#n };
  }

  [toDeserialize](data: { n: number }) {
    this.#n = data.n;
  }
}

const serializer = new Serializer({ classes: { Adder } });

// serialize 호출 시, toSerialize가 정의되어있으면 이를 사용함.
const serialized = serializer.serialize(new Adder(100)); // Adder{"n":100}

// deserialize 호출 시, toDeserialize가 정의되어있으면 이를 사용함.
const deserialized = serializer.deserialize(serialized)
deserialized.add(200) // 300
```

자바스크립트에서는 객체를 생성할 때 생성자(`constructor`)를 무조건 호출합니다. (우회 방법을 찾지 못했습니다.) 따라서 생성자에 특수한 처리가 있다면 `toDeserialize`에도 동일한 처리가 필요합니다.


## 마무리

.. 그리하여 쓸만한 직렬화 라이브러리를 만들었습니다. 굉장히 저수준의 라이브러리라서 쓰임이 많지는 않을 거 같습니다. 다만, 아마도 저와 비슷한 문제를 겪은 사람이라면 꽤나 좋아할만한 라이브러리라고 생각합니다. (사실, 프레임워크 만드는 사람이 가져다가 사용하면 정말 기분좋을 거 같습니다. 🤣)

실제 내부에 파서 만드는 과정은 복잡해서 생략하였는데 더 자세한 과정이 궁금하시면, 과거에 파서에 관한 글([파서 만들기 (2) - JSON.parse](https://wan2.land/posts/2020/02/22/make-parser-2/))을 한번 읽어보시는 걸 추천드립니다. 파서에서는 어떻게 표현하게 만드는지가 중요하지, 만드는 방법 자체는 크게 다르지 않기 때문입니다.

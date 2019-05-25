---
layout: post
title: "JS 꼴랑이거(2) - setTimeout에서 발생하는 Exception 잡아내기"
date: 2015-03-09 16:23:14 +09:00
tags: ["javascript"]
---

자바스크립트에서도 예외처리가 가능한데 단순하게 다음과 같이 사용할 수 있습니다.

```javascript
function throwException() {
    throw new Error("Hi");
}

try {
    throwException();
} catch(e) {
    console.log("Error:)", e);
}
```
 아마도 실행하면 다음과 같이 나올 것입니다.
 
 ```
$ node exception.js
Error:) [Error: Hi]
```

다른 언어와 똑같이 실행이 가능합니다. 그런데 자바스크립트에서 예외처리를 조심히 사용해야할 때가 있는데요, 바로 이벤트 안에서 발생시키는 예외가 그 녀석입니다.

위의 소스를 다음과 같이 바꿔보도록 합니다.

```javascript
function throwException() {
    throw new Error("Hi");
}

try {
    setTimeout(throwException, 1000);
} catch(e) {
    console.log("Error:)", e);
}

// 혹은 다음과 같이 시도해도 마찬가지입니다.

try {
    function throwException() {
        throw new Error("Hi");
    }
    setTimeout(throwException, 1000);
} catch(e) {
    console.log("Error:)", e);
}
```

그러면 다음과 같이 에러를 발생시켜버립니다.

```
$ node exception.js
/your-work-directory/exception.js:3
    throw new Error("Hi");
          ^
Error: Hi
    at throwException [as _onTimeout] (/your-work-directory/exception.js:3:11)
    at Timer.listOnTimeout [as ontimeout] (timers.js:112:15)
```

이 녀석 때문에 때로는 서버가 죽어버리기도 하고, 웹 어플리케이션이 멎어버리기도 합니다. 다른언어에서는 처리하지 않은 예외가 발생을 대비하여 `main`함수 전체를 `try-catch`로 묶어버리기도 합니다. 그러나 자바스크립트는 소용이 없는 일이지요.  이벤트내의 영역이 메인 바깥에 있기 때문입니다.

이러한 문제 때문에 조금 편하게 `try-catch`를 덮어 씌워서 사용하면 어떨까 생각해보았습니다.

그 예제는 다음과 같습니다.

```javascript
// 우선 다음과 같이 함수를 선언하고..
var tryable = function(closure, catchCallback) {
    closure(function(callback) {
        return function() {
            try {
                callback();
            } catch(e) {
                catchCallback(e);
            }
        };
    });
};

// try-catch문을 다음과 같이 바꿔서 사용합니다.
function throwException() {
    throw new Error("Hi");
}
tryable(function(catchable) {
    setTimeout(catchable(throwException), 1000);
}, function(e) {
    console.log("Error:)", e);
});
```

중간에 wrapper 함수들이 추가로 등장하였지만 실행하였을 때 다음과 같이 깔끔하게 try-catch가 실행되는 것을 볼 수 있습니다.

```
$ node exception.js
Error:) [Error: Hi]
```

네. 끝입니다. : )
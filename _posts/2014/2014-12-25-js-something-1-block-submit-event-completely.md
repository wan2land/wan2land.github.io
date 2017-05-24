---
layout: post
title: JS 꼴랑이거(1) - Submit 이벤트 완전히 막기!
date: 2014-12-25 22:52:30 +09:00
tags: ['Javascript']
---

오늘 갑자기 프로그램을 처리하다가 재밌는 아이디어가 떠올라서 바로 급하게 적어봅니다. 이미 누군가는 사용하고 있을수도 있고, 어디선가 기본으로 사용할 수도 있는 작~~~은 팁입니다. (소심)

보통 jQuery를 통해서 `form`의 `submit`이벤트를 바인드해서 사용하고 마지막에 이벤트 발생을 막기 위해서 `return false;`를 많이 사용할 것입니다.

```javascript
var submitAction = function() {
	/* do something with Error */
    return false;
};
$('form').bind('submit', submitAction);
```

바로 위와 같은 형태로요.

근데 이녀석은 `/* do something wieh Error */` 부분에서 에러가 발생하면 Form이 넘어가 버리는 문제가 발생합니다. 완벽하게 디버깅을 했고 해당부분에서 에러가 안나겠지! 했는데 이후에 작은 에러라도 발생해버리면 페이지가 넘어가버리는 문제가 발생합니다. **Single Page Application**를 만들어 보신 분들이라면 누구나 다 겪어봤을 거라고 생각합니다. (불과 몇 시간전의 제가 그랬습니다.)

해결책은 단순합니다.

```javascript
var
doSomething = function() {
	/* do something with Error */
},
submitAction = function() {
	setTimeout(doSomething, 0);
    return false;
};
$('form').bind('submit', submitAction);
```

이렇게 처리하면 됩니다.

원리도 단순합니다. `doSomething`을 `timeout`으로 처리해서 `return false;`를 종료 한 이후 실행하도록 바꿔버리는 것입니다. 자바스크립트의 언어 특성상 가능한 것이지요. :)

어라 만약에 `doSomething`매서드 내에서 `jQuery`에서 넘어온 `this`와 `매개변수`를 그대로 사용하고 싶으시다고요?

위의 과정을 조금만 응용하시면 됩니다.

```javascript
var
doSomething = function() {
	/* do something with Error */
},
submitAction = function() {
    var
    self = this,
    args = [].slice.apply(arguments);
    setTimeout(function() {
        doSomething.apply(self, args);
    }, 0);
    return false;
};
$('form').bind('submit', submitAction);
```

참 쉽죠? 이제 `submit`이벤트에서 안심하고 에러 발생(?!)시킵시다. 절대!! `form`이 넘어가는 일은 없을 것입니다.




##조금 더 이야기하면..

~~사실.. 더 간단한 방법이 있습니다.~~

```javascript
var submitAction = function(e) {
	e.preventDefault();
    e.stopPropagation();
	/* do something with Error */
};
$('form').bind('submit', submitAction);
```


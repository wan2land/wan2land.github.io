---
layout: post
title: "QUnit으로 브라우저, 노드 통합 유닛테스트 환경 구축하기"
date: 2015-02-04 10:16:36
categories: Dev QUnit
tags: ['Javascript', 'Unittest', 'Qunit']
---

작업하는 몇몇 소스가 브라우저에서도 사용이 되고, 노드(혹은 io.js도 가능할 듯.)에서도 사용이 됩니다. 통합된 환경에서 어떻게 하면 유닛테스트를 할 수 있을까 고민을 해보았습니다.

그러던 중 QUnit이라는 도구가 눈에 띄었습니다.

![QUnit](/images/dev/qunit/logo.png)

[qunitjs.com](http://qunitjs.com)

간단히 얘기하자면 jQuery팀에서 사용하는 테스트 도구입니다. 기존에 하는 유닛테스트와 가장 유사한 것 같아서 선택 한 것 같습니다.

그외에 몇가지 테스트 도구를 간단히 소개하자면..

- [Jasmine](http://jasmine.github.io) : Test-Driven이 아닌 Behavior-Driven 테스트 도구입니다. 루비에서 RSpec이 익숙하시면 이쪽도 봐두시면 좋습니다.
- [Mocha.js](http://mochajs.org) : TDD, BDD 두 스타일 모두를 지원하는 간단한 테스트 도구입니다. 국내 쪽 소개글은 [여기](http://blog.outsider.ne.kr/770)서 볼 수 있습니다.

~~이 글 작성하면서 다른 도구들을 찾아봤는데 더 재밌어보이는게 많아보이네요.~~ 그래도 QUnit으로 작성하기로 했기 때문에 QUnit을 계속 이야기 하도록 하겠습니다.

QUnit의 장점이 무엇이냐. 하면.. ~~제가 사용할 수 있다는 것?~~ 그만큼 봐야할 문서도 적고 단순하다는걸 장점으로 꼽을 수 있을 것 같습니다. 테스트 하는데 이것저것 다 필요없고 `assertEqual`, `assertTrue`만 필요하다면 사용하기 좋은 도구인 것 같습니다.

## 시작하기에 앞서..

환경을 구축하는데 가장 많이 고민 한 것이 소스의 모듈화 였습니다. 지금 현재 개발하는 프로그램이 많은 소스로 구성되어있고 해당 파일 하나당 하나의 테스트 모듈을 갖게 하는것이 목표였습니다. 그렇다면 Node와 Browser환경에서 공통 모듈을 작성할 수 있는 방법이 뭐가 있을까 고민을 했습니다.

노드에서는`module.exports = myModule;`의 형태를 사용해야 할 것이고, 브라우저에서는 AMD 즉, `define(function() { return myModule; }`의 형태를 사용해야 합니다.

물론, 통합된 모듈을 만들때 쓰는 패턴이 있긴 합니다.

```javascript
;(function(global, factory){
	if (typeof exports === "object") {
		module.exports = factory();
	}
	else if ( typeof define === 'function' && define.amd ) {
		define(factory);
	}
	else {
		global.MyModule = factory();
	}
})(this, function() {
	/* Source ... */
	return myModule;
});
```

그러나 위의 소스를 매 테스트파일마다 넣는 것도 굉장히 복잡한 느낌이었습니다. 그래서 [requirejs](http://requirejs.org)를 노드에도 도입해서 사용하기로 했습니다.

덧붙여, `node-qunit`이라는 녀석이 이미 있습니다. 그러나 저녀석으로 하면 파일별로 모듈화 하고 브라우저랑 동시에 사용할 수 없습니다. (AMD를 사용하지 않기 때문.)

## 간단한 구조

일단 두가지 프로그램을 설치합시다.

```bash
$ npm install requirejs --save-dev
$ npm install qunitjs --save-dev
```

그리고 저는 다음과 같이 파일을 구성하였습니다.

- `/node_modules/*` : 여기에는 방금 npm을 통해 설치한 경로.
- `/tests/bootstrap.js` : 테스트 시작하기전에 실행할 내용들.
- `/tests/sample-test.js` : 테스트 모듈(모든 파일은 `*-test.js` 의 형태를 따릅니다.).
- `/src/sample.js` : 우리가 만든 모듈.
- `/qunit.html` : 웹 테스트 시작 파일입니다.
- `/qunit.js` : 노드 테스트 시작 파일입니다.
```

`qunit.html` 파일은 웹에서 실행하면 유닛테스트가 실행됩니다. `qunit.js`파일은 노드에서 유닛테스트가 실행됩니다. 그리고 각각 파일은 공통적으로 `/tests/bootstrap.js`파일을 불러오면 테스트가 실행됩니다. `tests`및에 있는 테스트 모듈의 경우 `*-test.js`의 파일명을 붙였고 여기서 `*`에 해당하는 파일은 `/src/*`에 1:1로 매칭됩니다.

## Browser에서 QUnit 설정

`qunit.html`파일 내용은 다음과 같이 구성합니다.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>QUnit Example</title>
<link rel="stylesheet" href="./node_modules/qunitjs/qunit/qunit.css" />
</head>
<body>

<div id="qunit"></div>

<script src="./node_modules/requirejs/require.js"></script>
<script type="text/javascript">
requirejs.config({
    baseUrl: "./tests",
    paths: {
        qunit: "../node_modules/qunitjs/qunit/qunit",
        src: "../src"
    },
    shim: {
        qunit: {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});
requirejs(['bootstrap']);
</script>
</body>
</html>
```

requirejs 설정에서 baseUrl을 `./tests`로 정했기 때문에 `qunit`은 상대경로인 `../node_modules/qunitjs/qunit/qunit`으로 정해주어야 합니다. 그리고 AMD를 통해 실행되어야 하기 때문에 `shim`에서 `exports`를 설정해야합니다.(`QUnit`은 AMD를 아직 지원하지 않습니다.) 그리고 `QUnit`은 기본적으로 소스를 불러올 때마다 실행하기 때문에 `autoload`와 `autostart`설정을 꺼줘야 합니다.

## Node에서 QUnit 설정

`qunit.js`파일은 다음과 같이 구성합니다.

```javascript
var QUnit = require('qunitjs');
var requirejs = require('requirejs');
var StyledConsole = require('styled-console');

requirejs.config({
    baseUrl: "./tests",
    paths: {
        src: "../src"
    }
});

requirejs.define('qunit', QUnit); // requirejs에서 qunit 을 사용할 수 있도록 직접설정.

QUnit.config.autoload = false;
QUnit.config.autostart = false;

QUnit.log(function( details ) {
    if ( details.result ) {
        return;
    }

    var output = "<c:red>FAILED:</c:red> " + 
        (details.module ? details.module + ': ' : '') +
        (details.name ? details.name + ': ' : '') +
        (details.message ? details.message : '' );

    if (details.actual) {
        output += "expected: " + details.expected + ", actual: " + details.actual;
    }
    if (details.source) {
        output += "\n<c:sblack>" + details.source + '</c:sblack>';
    }
    console.log(StyledConsole(output).parse());
});

requirejs(['bootstrap']);
```

위의 브라우저 설정과 비슷합니다. 다만 여기서는 브라우저에서 실행하는 것이 아니라 `requirejs`에서 `shim`설정이 불가능합니다. 그래서 `requirejs.define`을 통해 직접 선언해주어야 합니다. 마찬가지로 `autoload`, `autostart`를 꺼주셔야 합니다. 그리고 `QUnit`은 브라우저 용으로 제작된 유닛테스트 도구라서 어떤 형태로 로그를 찍어줘야할지 함수를 설정해주어야 합니다. 그것이 `QUnit.log`라는 부분입니다. 저는 콘솔을 예쁘게 (나름) 색깔을 갖추기 위해 [styled-console](https://www.npmjs.com/package/styled-console)을 사용했습니다. 필요하신 분들은 다음 명령어를 통해 설치 가능합니다.

```bash
$ npm install styled-console --save-dev
```

## `/tests/bootstrap.js` 구성

```javascript
requirejs(['qunit', 'sample-test', 'other-sample-test', ... ], function(QUnit) {
	QUnit.load();
	QUnit.start();
});
```

단순히 `QUnit`(`requirejs.config`에서 설정한 이름)을 불러오고 테스트할 파일들을 위 형태에 맞춰 나열만 하면 됩니다.

## `/tests/sample-test.js`구성

```javascript
requirejs(
    ['qunit', 'src/sample'],
    function(QUnit, Sample) {
        QUnit.test('Sample Test Suite', function(assert) {
            assert.ok(Sample.getTrue());
            assert.equal(Sample.getTwo(), 1); // 일부러 에러날 경우.
       });
    }
);
```

위와 같이 `src/sample.js` 파일을 불러와서 자유롭게 테스트 내용을 작성하면 됩니다. 기본적으로 `QUnit`은 전역함수를 사용할 수 있도록 편의를 제공합니다만 (`test`라던가 `ok`라던가..) 저는 저런 단순한 이름은 전역변수를 사용했을 때 함수의 내용을 보장(작은 규모에선 괜찮으나 큰 규모로 커졌을 때..)할 수 없다고 생각이 들어 변수로 받아온 녀석만을 사용했습니다.

더 많은 Assert 관련 함수는 [여기](http://api.qunitjs.com/category/assert/)에서 찾아 볼 수 있습니다.

## 결과

### 브라우저 테스트

![QUnit Browser test](/images/dev/qunit/browser-test.png)

### Node 테스트

![QUnit Node test](/images/dev/qunit/node-test.png)

노드의 경우는 `QUnit.log`를 작성할 때, 성공한 것은 아예 출력을 막았기 때문에 실패한 결과만을 출력해줍니다.

## 마무리

굉장히 기본소스만을 활용해서 유닛테스트 환경을 만들었기 때문에 조금만 응용하면 다양하게 활용할 수 있을 것이라 생각됩니다. 일단 지금은 브라우저 테스트는 일일이 해야하지만 다음에 시간이 되면 다양한 브라우저 환경까지 자동화 해보려고 합니다. :)
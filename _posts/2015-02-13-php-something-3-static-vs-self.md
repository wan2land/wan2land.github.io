---
layout: post
title: "PHP 꼴랑이거(3) - static과 self의 차이"
date: 2015-02-13 05:32:11 +09:00
tags: ['PHP', 'static', 'self']
---

원래 본글은 2013년 12월 26일날 포스팅 된 글을 꼴랑이거 시리즈로 묶으면 좋겠다 생각되어 이쪽으로 이전된 글입니다. :)

PHP 객체지향에서 static은 상속이 됩니다. 그리고 그 static메서드 안에서 자기 자신 클래스를 생성하고 싶을때가 있습니다.
그때 사용할 수 있는 것이 static 일까요 self 일까요?

```php
<?php

class Foo {
	public static function func1() {
		return new Foo;
	}
	public static function func2() {
		return new static;
	}
	public static function func3() {
		return new self;
	}
}

class Bar extends Foo {}

var_dump( Bar::func1() );
var_dump( Bar::func2() );
var_dump( Bar::func3() );
```

출력결과는 다음과 같습니다.

```bash
$ php new-static.php 
object(Foo)#1 (0) {
}
object(Bar)#1 (0) {
}
object(Foo)#1 (0) {
}
```

`Bar::func2()` 의 경우와 `Bar::func3()`를 비교하시면 이해하기 편할겁니다. 하나는 `Bar`객체를 담고있고, 나머지 하나는 `Foo`객체를 담고있습니다. :)

아래 코드는 위의 방식을 활용해서 제가 자주 사용하는 패턴입니다.

```php
<?php
namespace Wandu;

class Base {

	/**
	 * 객체를 생성하는 static Method입니다. 실행과 동시에 __make메서드를 호출합니다.
	 * @param mixed $v,... 생성할때 필요한 변수들. __make에서 받아옵니다.
	 * @return Wandu\Base 생성된 객체를 반환.
	 */

	public static function make() {

		$instance = new static;

		if ( method_exists($instance, "__make") ) {
			call_user_func_array(array($instance, "__make"), func_get_args());
		}

		return $instance;
	}

```

모든 클래스에서 Base를 상속받아서 다음과 같이 사용하고 있습니다.

```php
<?php
// #1
InheretedObject::make()->foo();
// #2
(new InheretedObject)->foo();
```

굳이 사용할 필요는 없지만 #2보다 #1 직관적이라서 자주 사용하고 있습니다.

##참고자료

- <http://www.programmerinterview.com/index.php/php-questions/php-self-vs-static>


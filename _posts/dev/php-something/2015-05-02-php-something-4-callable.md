---
layout: post
title: "PHP 꼴랑이거(4) - Callable"
date: 2015-05-02 12:47:16
categories: Dev PHP
tags: ['PHP', 'callable', 'Closure']
---

PHP에서 오늘 살펴볼 녀석은 `callable`이라는 녀석입니다.

그전에 잠깐 `array_walk()`라는 함수를 보자면 다음과 같이 사용합니다.

```php
array_walk([1,2,3,4,5], function ($item) {
    echo $item, " ";
}); // print 1 2 3 4 5
```

현대 언어의 필수적 개념인 클로져(Closure)를 사용해서 함수를 불러 올 수 있습니다. 근데 참 재미난게 PHP에서는 클로져라는
개념이 `5.3` 버전부터 탑재가 되었습니다. 그렇다면 "`array_walk()`라는 함수는 PHP 5.3부터 지원되기 시작했나요?" 라고
묻는다면 그건 또 아닙니다. 무려 PHP4때부터 지원을 해왔습니다. 어떤 형태로 지원을 했는지 다음과 같습니다.

```php

function arrayWalkHandler($item) {
    echo $item, " ";
}

array_walk([1,2,3,4,5], "arrayWalkHandler"); // print 1 2 3 4 5

```

바로 함수의 명을 문자열을 통해 불러오게 합니다. 평상시라면 일반적인 문자열이지만 특정 상황이 되면 호출 가능한 객체,
그것이 바로 오늘 이야기할 `callable`입니다.

## callable?

PHP에서는 Scalar타입(이를테면, string, int, bool...)의 타입힌트를 지원하지 않습니다만, 몇몇 상황에 한정되어 지원하는
타입힌트가 있습니다. 가장 많이 사용되는 `array`가 있고, 오늘 이야기하고 있는 `callable`이 있습니다. 백문이
불여일견이라고 어떻게 사용되는지 살펴봅시다. 해당 `callable`객체를 부르기 위한 `Caller`라는 클래스와 그의 메서드
`call`을 다음과 같이 정의합시다.

```php
class Caller
{
    public static function call(callable $x)
    {
        echo "Can I call ?";
        echo is_callable($x) ? "yes!\n" : "nope!\n";
        call_user_func($x, 'foo', 'bar'); // 모든 callable은 call_user_func를 통해 호출이 가능합니다.
    }
}
```

그리고 테스트 할 callable의 내용을 작성하려고 하는데, callable이 가능한 형태에는 6가지가 있는 것 같습니다. (직접
분류한 것이라 사람마다 다를 수도 있어서 "같습니다"와 같은 애매한 표현을 썼습니다 ^^;;)

1. 함수를 나타내는 문자열
2. 클래스와 정적함수를 나타내는 문자열
3. 클래스와 정적함수를 나타내는 배열
4. 객체와 정적함수를 나타내는 배열
5. `__invoke`를 내장한 객체
6. 클로져

그래서 각각에 대해서 테스트 하기 위해 다음과 같이 함수 및 클래스를 정의해봅시다.

```php
function callableAsAFunction()
{
    echo "callableAsAFunction!\n";
    echo "call with params ". implode(', ', func_get_args()) ."\n\n";
}

class CallableAsInvokerClass
{
    public function __invoke()
    {
        echo "CallableAsInvokerClass!\n";
        echo "call with params ". implode(', ', func_get_args()) ."\n\n";
    }
}

class CallableAsAClass
{
	public static function andStaticMethod()
    {
		echo "CallableAsAClass::andStaticMethod!\n";
        echo "call with params ". implode(', ', func_get_args()) ."\n\n";
	}

	public function andMethod()
    {
		echo "CallableAsAClass::andMethod!\n";
        echo "call with params ". implode(', ', func_get_args()) ."\n\n";
	}
}

$callableAsClosure = function () {
    echo "\$callableClosure!\n";
    echo "call with params ". implode(', ', func_get_args()) ."\n\n";
};
```

그리고 각 상황에 대해서 테스트를 해봅시다.

```php
// 1. 함수를 나타내는 문자열
Caller::call("callableAsAFunction");

// 2. 클래스와 정적함수를 나타내는 문자열
Caller::call("CallableAsAClass::andStaticMethod");

// 3. 클래스와 정적함수를 나타내는 배열
Caller::call(array('CallableAsAClass', 'andStaticMethod'));

// 4. 객체와 정적함수를 나타내는 배열
Caller::call(array(new CallableAsAClass, 'andStaticMethod'));
Caller::call(array(new CallableAsAClass, 'andMethod'));

// 5. `__invoke`를 내장한 객체
Caller::call(new CallableAsInvokerClass);

// 6. 클로져
Caller::call($callableAsClosure);
```

그리고 그 실행결과는 다음과 같습니다. 모두 문제 없이 실행됩니다.

```
Can I call ?yes!
CallableAsAClass::andStaticMethod!
call with params foo, bar

Can I call ?yes!
CallableAsAClass::andStaticMethod!
call with params foo, bar

Can I call ?yes!
CallableAsAClass::andStaticMethod!
call with params foo, bar

Can I call ?yes!
CallableAsAClass::andMethod!
call with params foo, bar

Can I call ?yes!
CallableAsInvokerClass!
call with params foo, bar

Can I call ?yes!
$callableClosure!
call with params foo, bar
```

## callable의 호출

위의 예시에서는 `call_user_func()`라는 매서드를 통해서 호출을 했습니다. 그런데! callable은 특정 상황에서 다른방식으로
호출이 가능합니다.

함수를 나타내는 문자열(1)은 다음과 같이도 호출이 가능합니다. (실제 프로그램상에선 가급적 사용하면 안됩니다.)

```php
$func = "callableAsAFunction";
$func();
```

`__invoke`를 내장한 객체(5)와 클로져(6)는 `__invoke()`를 통해서 호출이 가능합니다.

```php
$func1 = new CallableAsInvokerClass;
$func1->__invoke();

$func2 = $callableAsClosure;
$func2->__invoke();
```

그리고 어떤 `callable`이 호출될지 모르는 상태에서는 그냥 `call_user_func()`를 사용하는게 정신건강에 이롭습니다.

## 주의사항

위에서 이야기한 다양한 상황을 응용해서 코딩하는 건 참 즐거운 일입니다. 그러나 주의해야할 점이 있습니다. 매개변수로서 함수를 전달할때는 가급적 클로져를 사용하는 것을 권해드리고 싶습니다. 그리고 객체 내부의 매서드 같은 경우도 정말 특별한 경우가 아니고서는 `call_user_func()`를 통해서가 아니라 직접 호출을 하는 것이 좋습니다. 나중에 프로그램 단위가 커졌을 때 엄청난 디버깅의 부담을 받고 싶지 않다면요. :-)

## 함께 보면 더 좋은 내용들

특정 매서드나 함수를 포함할 수 있는 `Reflection`객체를 이용하면 `callable`을 더 재미있게 요리가능합니다. `Reflection`을 다루기엔 너무 내용이 방대하기 때문에 이번 글에서 이야기 하지 않았으나, `Reflection`을 한번쯤 읽어보는 것도 좋을 것 같습니다.

- http://php.net/manual/book.reflection.php

## 참고자료

- http://php.net/manual/language.types.callable.php

---
layout: post
title: PHP 꼴랑이거 (2) - callable에 대한 고찰
---
Interactive shell

php > $x = function() {};
php > var_dump($x);
object(Closure)#1 (0) {
}
php > var_dump(is_callable($x));
bool(true)
php > $x = "..";
php > var_dump(is_callable($x));
bool(false)
php > function foo() {};
php > foo();
php > var_dump(is_callable($x));
bool(false)
php > $x = 'foo';
php > var_dump(is_callable($x));
bool(true)
php > $x = 'bar';
php > var_dump(is_callable($x));
bool(false)
php > function bar() {}
php > var_dump(is_callable($x));
bool(true)
php > $x();
php > function baz() { echo "....."; }
php > $y = "baz";
php > $y();
.....
php >


PHP는 참 재밌는 언어입니다.

그때그때 필요함에 따라서 언어가 진화함에 따라서 재밌는 문법들이 많습니다. 뭐 그 중에 하나 떠오르는 함수는 `array_walk`입니다.

보통 이렇게 사용합니다.

```prettyprint lang-php
$array = [1,2,3,4,5];
array_walk(
	$array,
    function ($item) {
    	echo $item, "\n";
    }
);
```

요즘 현대 언어에서는 함수를 쓰려면 Closure라는 개념이 필수적입니다. 그런데 재밌는건 바로 이부분입니다.

![](/content/images/2014/Dec/_____2014_12_05____12_29_00.png)

이건 `array_walk` PHP4부터 지원하고 있습니다.

![](/content/images/2014/Dec/_____2014_12_05____12_29_15.png)

그리고 이것은 Closure입니다. PHP5.3부터 지원하고 있습니다. 저런 함수 형태를 쓰려면 익명함수가 필수적일텐데 과거에 PHP는 어떻게 callable객체를 넘겨주었을까요?

```prettyprint lang-php
function arrayWalkIterator($item)
{
	echo $item, "\n";
}

$array = [1,2,3,4,5];

array_walk($array, "arrayWalkIterator");
```

과거에는 이런형태로 적었습니다. 해당 함수의 이름을 문자열의 형태로 불러들였었죠. 이게 가능한 것은 PHP가 스크립트 언어였기 때문이라고 생각합니다.

```prettyprint lang-php
$text = "arrayWalkIterator";
$text(3);
```

~~심지어 이렇게 해도 프로그램이 돌아갑니다..~~

자 그럼 본론으로 들어가봅시다. `array_walk`함수에서 보면 매개변수의 타입힌트에 `callable`이라는 녀석이 들어가있습니다. 간단히 하나의 프로그램을 설계해봅시다.

```prettyprint lang-php
class Caller
{
	public static function call(callable $x)
	{
		print_r(func_get_args());
	}
}
```

그리고 바로 아래에 함수를 호출해봅시다.

```prettyprint lang-php
Caller::call("hello");
```

![](/content/images/2014/Dec/_____2014_12_05____12_38_48.png)

너무나 당연한 에러입니다. 그런데 `hello`라는 함수를 선언하는 순간 에러가 없어져버립니다. 

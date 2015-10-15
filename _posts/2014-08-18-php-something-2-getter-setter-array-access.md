---
layout: post
title: PHP 꼴랑이거(2) - __get, __set에서 바로 배열 접근.
date: 2014-08-18 18:02:01 +09:00
categories: Dev PHP
---

본 글의 경우 일일이 읽기 귀찮은 분들은 **문제점**과 **결론**만 읽으시면 됩니다.


```php
<?php
// MyModel.class.php
class MyModel {
	private $_value = array();
    
    public function __set( $name, $value ) {
    	$this->_value[ $name ] = $value;
    }
    
    public function __get( $name ) {
    	return $this->_value[ $name ];
    }
}
```

위와 같은 클래스 선언은 클래스 값을 넣고, 가져올 때 해당 값을 후킹의 형태로 사용하기에 좋습니다.

```php
<?php
include "MyModel.class.php";

$mymodel = new MyModel;

$mymodel->foo = "Foo!!";
echo $mymodel->foo; // print Foo!!
```

그래서 위와 같은 코드는 별 이상없이 작동합니다. 

## 문제점

하지만 다음 코드는 어떻게 작동할까요?

```php
<?php
include "MyModel.class.php";

$mymodel->bar = array(); // #1
$mymodel->bar['key1'] = "Bar[0]"; // #2

echo $mymodel->bar['key1']; // #3
```

```
PHP Notice:  Indirect modification of overloaded property MyModel::$bar has no effect in ~

Notice: Indirect modification of overloaded property MyModel::$bar has no effect in ~
PHP Notice:  Undefined index: key1 in ~

Notice: Undefined index: key1 in ~
```

뭐 대충 이딴 에러를 발생하면서 프로그램이 제대로 죽어버립니다.

그렇습니다. 오늘 이 글에서 다룰 부분은 바로 위와 같은 코드를 사용하고 싶다는 것!

뭐.. 원인을 이야기 하자면 `#2`, `#3` 부분이 문제입니다. `#2` 부분의 코드는 내부적으로 다음과 같이 수행합니다.

```php
<?php
$mymodel->__get('bar')['key1'] = "Bar[0]";
```

`$mymodel->__get('bar')`은 array를 리턴하는데 이녀석은 reference로 전달되지 않습니다. 즉, 그런 배열값의 `key1`값에 `"Bar[0]"`값을 넣어봤자 아무런 작동을 하지 않는 것이 당연합니다.

## 결론

`__get()`에서 Reference를 반환해주면 됩니다.

```php
<?php
// MyModel.class.php
class MyModel {
	private $_value = array();
    
    public function __set( $name, $value ) {
    	$this->_value[ $name ] = $value;
    }
    
    public function &__get( $name ) {
    	return $this->_value[ $name ];
    }
}
```


끝.

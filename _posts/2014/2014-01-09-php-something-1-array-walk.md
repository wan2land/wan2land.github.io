---
layout: post
title: PHP 꼴랑이거(1) - 배열 순환에서 참조 변수 사용 시 주의사항
date: 2014-01-09 10:35:46 +09:00
tags: ["php"]
---

보통 배열을 순회하고자 할때 크게 두가지 방법이 있습니다.

```php
<?php
$items = array(.....);

// 이게 첫번째 방법
foreach ($items as $item) {
	do_something($item);
}

// 이게 두번째 방법
array_walk($items, function($item) {
	do_something($item);
});
```


그리고 만약에 이렇게 순환하고 난 후 그 결과를 다시 `$items`에 반영시키고 싶을때가 있는데, 그럴때는 간단하게 참조변수를 사용하였습니다.

```php
<?php
// 첫번째
foreach ($items as &$item) {
	$item = do_something( $item );
}

// 두번째
array_walk($items, function (&$item) {
	$item = do_something($item);
});
```

보통은 위 두종류를 모두 혼용해서 사용하였지만 오늘로서 두번째 방법만 남게 되었습니다. 그리고 다음 소스는 오늘 저지른 실수(?!)입니다. :)

```php
<?php
foreach ($items as &$item) {
	$item = do_something($item);
}

// unset($item); // 없으면 문제 발생.

foreach (array_diff($items, $others) as $item) {
	do_something($item);
}

```

첫번째 foreach는 제대로 순환하였지만 두번째 foreach가 제대로 순환하지 않는 것이었습니다.

자바 같은 경우에는 `$item`이라는 변수가 블록안에서만 사용되어야 하지만 php의 foreach같은 경우 그 바깥쪽 영역으로 선언이 잡혀버리는 것이었죠.. 같은 클로저(?, 보통은 함수 블록) 영역에서 공유되는 변수로 선언이 되어버리다니..

물론 저 중간에 `unset($item);` 한줄만 넣어줘도 되지만.. 소스가 아름답지 못하기 때문에 앞으로는 그냥 다음과 같이 사용하게 되었습니다. 아예 Closure를 사용하여 바깥쪽으로 영향을 미치지 못하게 잡아버렸습니다.

```php
<?php
// 바른 사용 :)
array_walk($items, function(&$item) {
	$item = do_something($item);
});

foreach (array_diff($items, $others) as $item) {
	do_something($item);
}
```

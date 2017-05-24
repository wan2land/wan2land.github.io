---
layout: "post-design-pattern"
chapter: "1.2"
title: "디자인패턴 공부하기 - 2. Static Factory"
date: 2017-05-25 08:07:01 +09:00
tags: ['designpattern', 'php']
---

1. [단순팩토리 (Simple Factory)](/posts/2017/05/25/php-design-pattern-1-simple-factory)
1. **[정적팩토리 (Static Factory)](/posts/2017/05/25/php-design-pattern-2-static-factory)**
1. 추상팩토리 (Abstract Factory)
1. 팩토리 메서드 (Factory Method)
1. 빌더 (Builder)
1. 단일체/싱글턴 (Singleton)
1. 멀티턴 (Multiton)
1. 원형/프로토타입 (Prototype)
1. 풀 (Pool)

## 정적팩토리 (Static Factory)

정적팩토리(Static Factory)의 경우 단순팩토리를 그저 정적함수(static method)를 통해서 호출하는 것 뿐이기 때문에 아주 간단합니다.

```php
<?php

class User
{
    /* ... */
}

class UserFactory
{
    public static function factory(): User
    {
        return new User();
    }
}
```

그리고 사용할 때는 다음과 같습니다.

```php
<?php
$user = UserFactory::factory();
```

별도의 `UserFactory`의 객체를 생성할 필요가 없어 쉽게 사용할 수 있고, 어디서나 접근할 수 있는 장점을 가지고 있습니다. 이 정적팩토리의 경우 인스턴스화가 필요없기 때문에 헬퍼함수(Helper Function)를 만들 때 더욱 유용합니다.

```php
<?php
function createUser() {
    return UserFactory::factory();
}
```

단순팩토리와 정적팩토리에 대해서 알아봤는데요, 이 두가지 결정적 차이는 바로 "인스턴스"에 차이가 있었습니다. 이쯤 오면 아마도 이런 의문이 들 수 있습니다.

왜 굳이 인스턴스를 만들어서 사용하지? 정적팩토리 사용하면 편할텐데..

바로, 그 이야기를 다음 내용인 추상팩토리(Abstract Factory)에서 다룰 것입니다.

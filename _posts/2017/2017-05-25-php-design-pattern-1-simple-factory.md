---
layout: "post-design-pattern"
chapter: "1.1"
title: "디자인패턴 공부하기 - 1. 단순팩토리 (Simple Factory)"
date: 2017-05-25 07:54:24 +09:00
tags: ['designpattern', 'php']
---

일반적인 팩토리 패턴은 무언가 객체를 생성하고자 할 때 사용하는 패턴입니다. 특히나 이 중, 단순팩토리(Simple Factory)는 그 중 가장 기본이 됩니다. 표현하면 다음과 같습니다.

<div class="mermaid width-33">
classDiagram
UserFactory --> User : create user
UserFactory : +factory()
</div>

```php
<?php

class User
{
    /* ... */
}

class UserFactory
{
    public function factory(): User
    {
        return new User();
    }
}
```

그리고 사용할 때는 다음과 같습니다.

```php
<?php
$factory = new UserFactory;
$user = $factory->factory();
```

아주 쉽습니다. 위의 예시에서는 단순히 설명하기 위해서 바로 `new User()`를 반환했지만, 실제로는 `User` 클래스의 생성자가 특정 매개변수를 필요로 하는 경우 그에 대한 값들을 넣어줍니다. 바로 다음과 같이요.

```php
<?php

class User
{
    public function __construct(string $username, array $config)
    {
        /* ... */
    }
}

class UserFactory
{
    public function factory(string $username): User
    {
        return new User($username, [
            /* ... */
        ]);
    }
}
```

단순하기 때문에, 위와 같은 팩토리 패턴의 경우 모던한 프레임워크에 다 구현되어있어서 들어있습니다만, 보통은 `Container`라는 객체 안에 포함되어있습니다.

라라벨의 예시를 보면 다음과 같습니다.

- 참고 : [라라벨5.4 - 서비스 컨테이너, 바인딩](https://laravel.kr/docs/5.4/container#binding)

```php
<?php
$this->app->bind('HelpSpot\API', function ($app) {
    return new HelpSpot\API($app->make('HttpClient'));
});
```

위 소스는 `$this->app->make('HelpSpot\Api')`를 호출하게 되면 해당하는 객체를 생성하게 됩니다.

물론, 컨테이너에서 이러한 기능을 제공한다고 해서 팩토리를 만들지 않는 것은 아닙니다.

팩토리를 사용 할 때는 별도로 만들어야 합니다. 보통은 프레임워크가 아닌 별도 패키지를 만들 때 사용합니다. 어떤 프레임워크에 이식될지 모르기 때문에 별도의 팩토리를 만들고, 프레임워크가 패키지에서 제공해주는 팩토리를 통해서 객체를 생성할 수 있도록 하고 있습니다.

Wandu Http의 `ServerRequestFactory`를 살펴보면 다음과 같습니다.

- 참고 : [Wandu/Http - ServerRequestFactory](https://github.com/Wandu/Http/blob/24d37e1277d18cc1f2994f329634a4a5b174cfe1/Factory/ServerRequestFactory.php)

```php
<?php
class ServerRequestFactory
{
    /* ... 생략 ... */

    /**
     * @return \Psr\Http\Message\ServerRequestInterface
     */
    public function createFromGlobals()
    {
        return $this->create($_SERVER, $_GET, $_POST, $_COOKIE, $_FILES, new PhpInputStream());
    }

    /* ... 생략 ... */
}
```

이제 다음에는 이 단순팩토리(Simple Factory)를 기반으로 어떻게 다양하게 사용되는지 알아보도록 하겠습니다.

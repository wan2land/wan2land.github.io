---
layout: post
title: "더 강력해진 DI Container, Wandu DI"
date: 2016-11-15 01:50:15 +09:00
tags: ['PHP', 'Wandu', 'DI', 'annotation', 'autowiring']
---

과거 [Wandu DI를 이용한 레거시 리팩토링](http://blog.wani.kr/posts/2015/08/07/wandu-di/)라는 포스팅으로
[Wandu Framework](http://wandu.github.io)의 Wandu DI를 소개한적이 있습니다.

현재 Wandu Framework 는 v3.1을 준비하는 과정인데요, 더욱 강력해진 DI Container를 소개합니다.

DI가 무엇인지, IoC 개념을 알고 있다는 전제하에 작성된 포스팅입니다.


## Doctrine Annotation을 이용한 오토와이어링(Auto Wiring)

오토와이어링(Auto Wiring)을 간단히 설명해야할 것 같습니다. 컨테이너(DI Container)에는 다양한 값들이 들어있습니다.
내가 생성해야하는 클래스 A가 있다고 합시다. 그리고 그 안에는 `private` 변수인 `$depend`가 있다고 합시다.

```php
<?php

class A
{
    private $depend;
}
```

이 `$depend`에 값을 넣는 방법은 일반적으로 2가지가 있습니다. 생성자(`__construct()`)를 사용하거나,
Setter(`setDepend()`)를 사용하거나. 물론, 마틴 파울러는
[3가지 방법](http://www.martinfowler.com/articles/injection.html#FormsOfDependencyInjection)을 제안하였지만,
일반적으로는 2가지 방법을 많이 사용합니다.

그런데, 위 2가지 방법이 아니고 바로 `$depend`에 값을 주입 받아야 할 때가 있습니다. 그럴때 사용하는 것이 바로
오토와이어링입니다.

Wandu DI에서는 오토와이어링을 위해서 Annotation을 사용합니다. (참고,
[doctrine/annotation](https://github.com/doctrine/annotations))

```php
<?php

use Wandu\DI\Annotations\AutoWired;
use Your\Own\Package\DepenencyInterface;

class A
{
    /**
     * @AutoWired(DepenencyInterface::class)
     */
    private $depend;

    public function getDepend()
    {
        return $this->depend;
    }
}
```

위와 같이 주입할 객체의 이름을 정의해주면 됩니다. 실제로 값이 들어갔는지 확인하기 위해서 `getDepend` 메서드도
생성하였습니다. 그리고 다음과 같이 'string'도 사용가능합니다.

```php
<?php

use Wandu\DI\Annotations\AutoWired;

class A
{
    /**
     * @AutoWired("Your\Own\Package\DepenencyInterface")
     */
    private $depend;

    /* ... getDepend 생략  ... */
}
```

컨테이너에 정의는 다음과 같이 할 수 있습니다. 각 부분에 주석을 달아 설명을 해놓았습니다.

```php
<?php

use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Annotations\Reader;
use Wandu\DI\Container;
use Your\Own\Package\DepenencyInterface;
use Your\Own\Package\Depenency;

$container = new Container();

// Annotation을 사용하기 위해서 Doctrine을 내부에 정의.
$container->bind(Reader::class, AnnotationReader::class); 

// A 클래스는 auto wiring을 사용해야 하기 떄문에 명시적으로 `wire()`를 호출합니다.
$container->bind(A::class)->wire();

// 주입할 객체를 컨테이너에 선언합니다.
$container->bind(DepenencyInterface::class, Depenency::class);

$object = $container->get(A::class);
$object->getDepend(); // 이 값은 DependencyInterface 객체가 들어있습니다.

```

왜 오토와이어링을 해야하는지, 의문이 생길 겁니다. 가장 큰 이점은 클래스 A를 사용하는 도중 `$depend`값이 오염되는 것을
막을 수 있습니다. 누군가가 저 값을 Setter를 통해서 갈아치워버릴 수도 있으니까요. 겨우 이것 때문에 저렇게 복잡한 일을
해야하느냐고 물을수도 있습니다. 이 오토와이어링을 통해서 더 재밌는 일을 할 수 있습니다.


## 상호의존(Circular Dependency) 객체 생성하기

**일반적으로 상호의존은 디자인 패턴에서는 "지양"해야합니다.**

A클래스와 B클래스가 상호 의존할 수도 있습니다. 쉽게 이야기 하면 다음과 같습니다.

```php
<?php

class A
{
    public function __construct(B $b) {}
}

class B
{
    public function __construct(A $b) {}
}
```

아무리 Auto Resolve를 잘한다고 하더라도 위와 같은 상황은 에러를 내보냅니다. 이는 제가 알고 있는 PHP Container
모든 라이브러리에서 동일한 현상입니다. 이걸 풀 수 있는 방법은 Setter를 이용하면 됩니다.

```php
<?php

class A
{
    public function setB(B $b) {
        $this->b = $b;
    }
}

class B
{
    public function setA(A $a) {
        $this->a = $a;
    }
}

$a = new A();
$b = new B();
$a->setB($b);
$b->setA($a);
```

하지만 위와같이 선언한다면 컨테이너의 Auto Resolve를 통한 지연효과는 누릴 수가 없게됩니다. A객체를 사용할지 안할지도
모르는 상태에서 반드시 객체를 만들어야 하기 때문입니다.

Wandu DI에서 지원하는 오토와이어링을 통해 좀더 쉽게 풀어봅시다.

```php
<?php

class A
{
    /**
     * @AutoWired(B::class)
     */
    private $b;

    public function getB()
    {
        return $this->b;
    }
}

class B
{
    /**
     * @AutoWired(A::class)
     */
    private $a;

    public function getA()
    {
        return $this->a;
    }
}

```

위와 같이 선언하고 다음과 같이 사용할 수 있습니다.

```php
<?php

$container->bind(A::class)->wire();
$container->bind(B::class)->wire();

$a = $container->get(A::class);

$a->getB(); // B
$a->getB()->getA(); // === $a
```

컨테이너가 알아서 이 문제를 해결해 줄 것입니다. :-)

## 팁, PHP Storm에서는 Annotation을 기본적으로 지원해줍니다.

Annotation은 기본 PHP에서 제공하는게 아니라서 사용하기 애매해보일 수도 있습니다. 하지만 PHP Storm 플러그인 설치가
가능합니다.

<div class="video-wrap">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/hACeHnUbHYo" frameborder="0" allowfullscreen></iframe>
</div>
그리고 Wandu DI의 `@AutoWired`는 PHP Storm의 PHP Annotations 플러그인을 완벽하게 지원합니다.

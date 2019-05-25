---
layout: post
title: "Reflection을 활용한 Private Method Test"
date: 2015-05-07 11:50:35 +09:00
tags: ["php", "php-reflection"]
---

ModernPUG모임에서 발표한 내용으로서 발표자료와 소스코드는 다음 링크에서 확인할 수 있습니다.

- [ModernPUG May, 2015 : Mockery, Reflection, 성공적](https://github.com/ModernPUG/meetup/tree/master/2015_05/01_Mockery_Reflection_Successful)

---

최근, TDD에 미쳐서 테스트가능한 코드를 미친듯이 작성하고 있습니다. 그러던 중 몇가지 상황에서 테스트하기 힘든 경우가
있었습니다. 그 중 하나가 바로 Private 테스트입니다. 잘 짜여진 코드에서는 Private 매서드를 테스트할 일이 벌어지면
안된다고 합니다만, 아무래도 모든 상황이 다 그렇게 완벽할 수 만은 없으니까요 :)

테스트하기 위한 코드의 예제는 다음과 같습니다. 손님(Customer)이 있고, 인사하는 사람(?)(Greeter)이 있습니다. 인사하는
사람(?)은 손님에게 `Hello`하고 인사하는 아주 단순한 내용의 코드입니다. 그리고 인사하는 매서드는 하나는 `public`, 또
하나는 `private`으로 작성을 해보았습니다.

(참고로, 다음 모든 예시는 PHP 5.5 이상에서 돌아가도록 작성되었습니다.)

```php
<?php
namespace Wandu\PugSample;

class Customer
{
    /** @var string */
    private $name;

    /**
     * @param string $name
     */
    public function __construct($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return ucfirst($this->name);
    }
}
```

```php
<?php
namespace Wandu\PugSample;

use Closure;

class Greeter
{
    /** @var Customer */
    private $customer;

    /**
     * @param Customer $customer
     */
    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    /**
     * @return string
     */
    public function sayHelloPublic()
    {
        return "Hello, {$this->customer->getName()}! (public)";
    }

    /**
     * @return string
     */
    private function sayHelloPrivate()
    {
        return "Hello, {$this->customer->getName()}! (private)";
    }
}
```

일단은 생성자(`__construct`)를 테스트하도록 하겠습니다. 내부 `customer`에 값을 넣는 일이 전부다입니다. 해당 동작이
확실히 하려면 `private` 변수를 확인해야합니다. 이는 PHPUnit에서 기본적으로 제공하는 동작입니다. `assertAttribute*`
계열 매서드를 사용하면 됩니다. PHPStorm에서 자동완성을 지원하니 한번 훑어보시면 바로 이해가 될겁니다. 다음 예시에서는
해당 `customer` 변수의 타입체크와 원하는 값이 올바르게 들어갔는지를 확인합니다.

```php
<?php
namespace Wandu\PugSample;

use PHPUnit_Framework_TestCase;
use Mockery;

class GreeterTest extends PHPUnit_Framework_TestCase
{
    public function testConstructor()
    {
        $mockCustomer = Mockery::mock(Customer::class);
        $mockCustomer->shouldReceive('getName')->andReturn('Changwan');

        $greeter = new Greeter($mockCustomer);

        $this->assertAttributeInstanceOf(Customer::class, 'customer', $greeter);
        $this->assertAttributeSame($mockCustomer, 'customer', $greeter);
    }
}
```

`private`변수의 경우 PHPUnit에서 기본기능을 사용하면 되지만 매서드의 경우는 다른 방법을 사용해야합니다. 바로 이때
필요한 것이 Reflection입니다.

Reflection을 자세히 보시려면 다음 두 문서를 참고하시면 됩니다.

- [php.net/manual/class.reflectionclass.php](http://php.net/manual/class.reflectionclass.php)
- [php.net/manual/class.reflectionmethod.php](http://php.net/manual/class.reflectionmethod.php)

물론 위 링크의 상위문서인 Reflection전체를 봐두시면 나중에 도움이 될 것이지만 본 포스팅에서는 위 두가지만 사용합니다.
Reflection을 간단히 얘기하면 다음과 같습니다.


> Reflection은 PHP 버전 5에 추가되어 프로그램이 스스로 자신의 코드를 검사할 수 있도록 한다. Reflection API는 함수나
> 오브젝트, 그것이 어디에 정의되어 있는지(파일과 줄번호의 범위)를 포함하여, 파라미터 목록, 함수이름, 도큐먼트, 주석
> 등등에 관한 많은 정보를 우리에게 알려줄 것이다. 

- 참고 : [데이터로서의 코드: PHP의 Reflection](http://www.hanbit.co.kr/network/view.html?bi_id=1383)

다음 코드는 `sayHelloPublic`이라는 매서드와 `sayHelloPrivate`라는 매서드 두개를 테스트합니다. 그리고 여기서는
`Mockery`라는 라이브러리를 사용하는데 어느정도 사용할 줄 안다고 가정하고 굳이 `Mockery`에 관련된 내용은 설명하지
않도록 하겠습니다.

```php
<?php
namespace Wandu\PugSample;

use PHPUnit_Framework_TestCase;
use Mockery;
use ReflectionClass;
use Closure;

class GreeterTest extends PHPUnit_Framework_TestCase
{
    public function tearDown()
    {
        Mockery::close();
    }

    public function testSayHelloPublic()
    {
        $mockCustomer = Mockery::mock(Customer::class);
        $mockCustomer->shouldReceive('getName')->andReturn('Changwan');

        $greeter = new Greeter($mockCustomer);

        $this->assertEquals('Hello, Changwan! (public)', $greeter->sayHelloPublic());
    }

    public function testSayHelloPrivate()
    {
        $mockCustomer = Mockery::mock(Customer::class);
        $mockCustomer->shouldReceive('getName')->andReturn('Wandu');

        $greeter = new Greeter($mockCustomer);
        
        // 이부분이 Reflection을 사용하는 부분입니다. (#1)
        $classReflection = new ReflectionClass(Greeter::class);
        $sayHelloPrivateMethod = $classReflection->getMethod('sayHelloPrivate')->getClosure($greeter);

        // getClosure를 통해 가져온 것은 Closure타입을 지닙니다.
        $this->assertInstanceOf(Closure::class, $sayHelloPrivateMethod); 
        $this->assertEquals('Hello, Wandu! (private)', $sayHelloPrivateMethod->__invoke());
    }
}
```

아마도 우리가 주목해야 하는 부분은 위의 소스에서 `#1`이라고 표기해놓은 부분입니다. `ReflectionClass`의 생성자
매개변수는 클래스의 이름을 받습니다. 그리고 클래스 Reflection 객체의 `getMethod`매서드를 통해 ReflectionMethod를
객체에 접근합니다. Reflection에서는 `public`이든 `private`이든 관계없이 해당 객체에 접근할 수 있습니다. 그리고
마지막으로 ReflectionMethod에서 `getClosure`매서드를 통해 클로져를 가져옵니다. 이때 필요한 매개변수는 클래스 매서드를
클로져로 가져오기 때문에 바인딩될 객체가 필요합니다. 그래서 여기서 위에서 생성한 `$greeter`를 넣기로 합니다.

그러면 `$sayHelloPrivateMethod` 안에는 우리가 접근하고자 했던 `ssayHelloPrivate` 매서드가 클로져 타입으로 들어있게
됩니다. 클로져타입은 일반적으로 `__invoke`를 통해서 호출이 가능합니다. 그러면 바로 호출을 하면
`Hello, Wandu! (private)`라는 메시지를 확인할 수 있습니다.

끝입니다. `Reflection`이나 `Mockery`를 처음 보신분들이라면 해당 코드를 읽기가 난해할 수도 있습니다. 그러나 TDD에서
`Mockery`라는 라이브러리는 (`Reflection`은 안보더라도..) 매우 중요한 일을 하기 때문에 한번쯤 익혀두시는 것도 좋을 것
같습니다. :)

## 참고자료

- http://www.hanbit.co.kr/network/view.html?bi_id=1383
- http://php.net/manual/book.reflection.php

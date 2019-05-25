---
layout: post
title: "Reflection을 활용한 Closure Mockery"
date: 2015-05-17 11:26:55 +09:00
tags: ["php", "phpunit", "mockery"]
---

ModernPUG모임에서 발표한 내용으로서 발표자료와 소스코드는 다음 링크에서 확인할 수 있습니다.

- [ModernPUG May, 2015 : Mockery, Reflection, 성공적](https://github.com/ModernPUG/meetup/tree/master/2015_05/01_Mockery_Reflection_Successful)

---

지난번에는 Reflection을 Private Method를 테스트하는 방법에 대해 이야기 했었습니다. 오늘은 지난번 했던 내용을 조금 더
심층화 시켜서 Closure를 Mocking하는 방법에 대해 이야기 해보도록 하겠습니다. :)

PHP Mockery는 클래스, 인터페이스 등을 가리지 않고 자유자재로 Mocking할 수 있습니다. 그러나 Mockery를 통해 Mocking할 수
없는 몇가지 경우가 있는데, 그 중의 하나가 바로 Final Class입니다.

- [http://docs.mockery.io/en/latest/reference/final_methods_classes.html](http://docs.mockery.io/en/latest/reference/final_methods_classes.html)

> One of the primary restrictions of mock objects in PHP, is that mocking classes or methods marked final is hard. The
> final keyword prevents methods so marked from being replaced in subclasses (subclassing is how mock objects can
> inherit the type of the class or object being mocked.

> The simplest solution is not to mark classes or methods as final!

간단히 얘기해서 Final 클래스는 Mocking할 수 없다는 이야기입니다. 갑자기 Closure 이야기를 하다가 왜 Final 클래스를
이야기 했냐하면, 내장 클래스인 Closure가 바로 Final로 선언이 되어있어서 상속을 할수 없습니다. 즉 Mocking이
불가능합니다.

```bash
PHP Fatal error:  Class SubClosure may not inherit from final class (Closure) in /Users/wani/Workspace/php/samples/language/closure/inherit.php on line 6
```

PHP에서 Closure를 상속했을 때 발생하는 에러.. ~~망했어.. 아마 안될거야..~~

## Mockery없이 Closure를 테스트하기

간단히 다음과 같은 클래스가 있다고 가정을 해봅시다.

```php
<?php
namespace Wandu\PugSample;

class Customer
{
    /**
     * @param  Closure $handler
     * @return mixed
     */
    public function doSomething(Closure $handler)
    {
        return $handler->__invoke($this);
    }
}
```

Closure를 어떻게 테스트 했는지 고민을 해보았습니다. 아마 일반적인 상황이면 다음과 같이 작성을 하면 될 것입니다.

```php
<?php
namespace Wandu\PugSample;

use PHPUnit_Framework_TestCase;

class CustomerTest extends PHPUnit_Framework_TestCase
{
    public function testDoSomething()
    {
        $customer = new Customer();

        $this->assertEquals(30, $customer->doSomething(function ($param1) use ($customer) {
            $this->assertSame($customer, $param1);
            return 30;
        }));
    }
}
```

위의 테스트의 치명적인 문제가 있습니다. 바로 클로져 내부의 `assertSame()`라는 테스트가 진행이 될 것이라는 보장이
없습니다.

이게 무슨말인고 하니, `doSomething()`이라는 메서드가 다음과 같으면 위의 테스트는 그냥 패스해버리고 맙니다.

```php
<?php
namespace Wandu\PugSample;

class Customer
{
    /**
     * @param  Closure $handler
     * @return mixed
     */
    public function doSomething(Closure $handler)
    {
        return 30;
    }
}
```

내부에 `assertSame()`을 넣었음에도 실행조차 되지 않았으니 성공했는지 실패했는지 알 수 조차 없게 됩니다.

그리고 문득 Mockery에 있는 `once()` 라던가 하는 매서드를 이용해서 해당 클로져가 내부에서 몇번 호출 되었는지 카운트도
해보고 싶었습니다. Javascript쪽에서는 Jasmine에서 이미 아주 잘 구현되어있는데, 이러한 기법들을 PHP에서도 적용해보고
싶었습니다.

## Mockery+Reflection을 사용해서 Closure Mocking하기.

Closure객체는 Final이라서 Mocking하는 것이 불가능합니다. 그러나, 지난 포스팅에서 Private Method를 Closure로 가지고 올
수 있다는 것을 알 수 있었습니다.

- [Reflection을 활용한 Private Method Test](http://blog.wani.kr/dev/php/mockery-reflection)

그렇습니다. 클래스 내부에 있는 모든 매서드는 클로져로 가지고 올 수 있습니다. 이걸 활용해보기로 했습니다. 일단 목업을
하나 만듭시다. 파일을 만들어도 되고 여기서는 편의를 위해서 그냥 테스트 소스 밑에 하나 만들기로 합니다. 그러면 테스트
코드를 다음과 같이 작성할 수 있습니다.

```php
<?php
namespace Wandu\PugSample;

use PHPUnit_Framework_TestCase;
use Mockery;
use ReflectionClass;
use Closure;

class CustomerTest extends PHPUnit_Framework_TestCase
{

    public function tearDown()
    {
        Mockery::close();
    }

    public function testDoSomething()
    {
        $customer = new Customer();

        $mockHandler = Mockery::mock(Dummy::class);
        $mockHandler->shouldReceive('handler')
            ->once()->with($customer)->andReturn(30);

        $classReflection = new ReflectionClass(get_class($mockHandler));
        $handler = $classReflection->getMethod('handler')->getClosure($mockHandler);

        $this->assertEquals(30, $customer->doSomething($handler));
    }
}

class Dummy
{
    public function handler() {}
}
```

Mockery에서 Dummy클래스를 Mocking합니다. 그리고 그 안에 `handler()`라는 메서드를 호출 했다고 가정합니다. 그리고 그
안에 자유롭게 Mockery에서 제공하는 메서드를 이용하여 테스트 소스를 작성합니다. 그리고 Mockery를 통해 생성한 객체에서
Reclection을 이용하여 해당 클래스의 Reflection을 가지고 옵니다. 그리고 그 안에서 `handler()` 메서드의 클로져를 가지고
옵니다. 그리고 그 클로져를 주입해줍니다.

테스트 해보면 아주 완벽하게 돌아가는 것을 볼 수 있습니다. :-)

## 참고자료

- http://php.net/manual/book.reflection.php
- http://docs.mockery.io/en/latest

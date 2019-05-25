---
layout: "post-design-pattern"
chapter: "a.1.1"
title: "디자인패턴 공부하기 - 부록1.1. SRP"
date: 2017-07-09 01:06:45 +09:00
tags: ['designpattern', 'php']
---

## LSP : Liskov Substitution Principle (리스코브 치환의 원칙)

서브타입에 관한 이야기.
서브타입을 구현을 해도 마치 원래 클래스를 사용하는 것처럼 그대로 구성이 되어야함.(핵심))
OCP와 함께 봐야함.
즉, LSP위반시 서브타입 추가할때 마다 원본 클래스가 수정되어야 함.

위험의 징조
instanceof / downcasting 사용시 LSP 위반의 징조.

PHP는?
sample1.php
PHP에서는 다운캐스팅이라는 개념이 없어서 잠재적 위험을 가질 수 밖에 없지 않나?

사각형과 정사각형의 관계라는 예시

https://code.tutsplus.com/tutorials/solid-part-3-liskov-substitution-interface-segregation-principles--net-36710

## ISP : Interface Segregation Principle (인터페이스 분리 원칙)

??? 아마도 슈퍼 인터페이스 만들지 말란 얘긴듯.

하나 긴능 바뀌면 다른 클라이언트에 옇ㅇ향 미침.

슈퍼클래스가 있다면 인터페이스를 쪼개자.

```php
<?php
interface Readable
{
	public function read();
}

interface Writeable
{
	public function write();
}

class HardDisk implements Readable, Writeable
{
	public function write()
	{
		echo "HardDisk :: Write!\n";
	}
	public function read()
	{
		echo "HardDisk :: Read!\n";
	}
}


class CompactDisk implements Readable
{
	public function read()
	{
		echo "CD :: Read!\n";
	}
}

class Client
{
	public function read(Readable $disk)
	{
		$disk->read();
	}

	public function write(Writeable $disk)
	{
		$disk->write();
	}
}


$client = new Client();
$client->read(new HardDisk);
$client->read(new CompactDisk);

$client->write(new HardDisk);
// $client->write(new CompactDisk); // Error :)

$client->crush(new HardDisk);
$client->crush(new CompactDisk);
```

## DIP : Dependency Inversion Principle (의존 역전 원칙)

OCP와 다른 것,
OCP는 확장이 필요한 행위에 대해 추상화했다면.
DIP는 Low Level에 의존성을 갖지 않도록 추상화.
Goal은 비슷하지만 목적이 다름. :)
뭐.. 이해하기 귀찮으면 그냥 이렇게 쓰면 이득이란 뜻임.


OCP와 조금 비슷한 얘기지만,
바라보는 입장의 차이.

결합도 줄이자.

결론은 인터페이스 쓰란 얘기.


https://code.tutsplus.com/tutorials/solid-part-4-the-dependency-inversion-principle--net-36872



왜 인터페이스를 자꾸 강요하는지 의아할 수 있습니다. PHP에서는 크게 와닿지 않을 수도 있습니다. 다른 언어에서는,
이를테면 자바나, C++ 같은, 컴파일이라는 과정이 선행되기 떄문입니다. 패키지의 특정 부분을 수정했다면 해당
패키지만 컴파일하라는 의미와도 일맥상통합니다. A 패키지를 수정했는데, A에 의존하고 있는 B / C 등을 재 컴파일
해야한다면 이는 굉장히 소모적인 일이 아닐 수 없습니다. 이를 달성하기 위해서 인터페이스를 사용하란 뜻입니다.
물론, 컴파일하지 않은 언어인 PHP라서 위반해도 괜찮다는 의미는 아닙니다. 이미 PHP도 많은 패키지에 의존하고
있습니다. 그리고 충분히 대규모 프로젝트도 많습니다. 앞으로의 큰 규모를 관리하기 위해서라도 인터페이스를 통한
설계는 반드시 필요하다고 생각합니다.


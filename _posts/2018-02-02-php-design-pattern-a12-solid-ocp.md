---
layout: "post-design-pattern"
chapter: "a.1.2"
title: "디자인패턴 공부하기 - 부록1.2. SOLID, 계방폐쇄원칙(OCP)"
date: 2018-02-02 12:01:06 +09:00
tags: ['designpattern', 'php']
---

> 소프트웨어 개체(클래스, 모듈, 함수 등등)는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다.

개방-폐쇄 원칙(OCP, Open-Closed Principle)은 새로운 요구사항이 추가되었을 때, 어떻게 코드를 작성해야하는지
그 가이드라인을 제시하고 있습니다.

"확장에는 열려 있다"는 것은 추가 기능이 필요하면 해당 동작만을 확장하라는 이야기입니다. 이 문제를 달성하기
위해서는 사전에 인터페이스(혹은 추상클래스)가 작성되어있어야 합니다.

"수정에 대해서는 닫혀 있다"는 것은 요구사항을 수정할 때 원하는 곳만 수정해야한다는 이야기입니다. 수정해야
하는 클래스를 다른 클래스에서 의존하고 있을 수 있습니다. 그럴 때, 의존하고 있는 클래스도 수정되면 안된다는
의미이기도 합니다. 그리고 이를 달성하기 위해서도 인터페이스(혹은 추상클래스)가 필요합니다.

예를 들어봅시다. 우리의 웹사이트에 접속했을 때, 사용자의 정보를 로그로 쌓기로 하였습니다. 파일 시스템을
사용하기로 했습니다.

```php
<?php
class HomeController
{
	public function welcome($user)
	{
		$this->log("{$user['name']}님이 방문했습니다.");
	}

	protected function log(string $message)
	{
		$fp = fopen('abc.log', 'a');
		fwrite($fp, $message . "\n");
		fclose($fp);
	}
}
```

아주 심플합니다. 여기서 추가 요구사항이 들어옵니다. 저 로그를 슬랙으로도 받고 싶다고 합니다.

```php
<?php
class HomeController
{
	protected $slack;

	public function __construct(Slack $slack)
	{
		$this->slack = $slack;
	}

	public function welcome($user)
	{
		$this->log("{$user['name']}님이 방문했습니다.");
		$this->logToSlack("{$user['name']}님이 방문했습니다.");
	}

	protected function log(string $message)
	{
		$fp = fopen('abc.log', 'a');
		fwrite($fp, $message . "\n");
		fclose($fp);
	}

	protected function logToSlack(string $message)
	{
		$this->slack->sendMessage($message);
	}
}
```

이런식으로 소스를 확장하면 로그를 추가할 때 마다 로그를 사용하는 모든 소스를 다 찾아서 고쳐야 합니다.
클래스를 분리해서 만들었으면 더 유지보수하기 더 수월합니다.

일단 `LoggerInterface`를 정의합니다.

```php
<?php
interface LoggerInterface
{
	public function log(string $message);
}
```

그리고 기존의 `FileLogger`는 다음과 같이 작성할 수 있습니다. 

```php
<?php
class FileLogger implements LoggerInterface
{
	protected $fp;

	public function __construct($path)
	{
		$this->fp = fopen($path, 'a');
	}

	public function log(string $message)
	{
		fwrite($this->fp, $message . "\n");
	}
}
```

그리고 컨트롤러는 다음과 같이 작성할 수 있습니다.

```php
<?php
class HomeController
{
	protected $logger;

	public function __construct(LoggerInterface $logger)
	{
		$this->logger = $logger;
	}

	public function welcome($user)
	{
		$this->logger->log("{$user['name']}님이 방문했습니다.");
	}
}
```

여기서 슬랙으로 로그를 받고 싶은 추가 요구사항을 반영해봅시다.

```php
<?php
class SlackLogger implements LoggerInterface
{
	protected $slack;

	public function __construct(Slack $slack)
	{
		$this->slack = $slack;
	}

	public function log(string $message)
	{
		$this->slack->sendMessage($message);
	}
}
```

그리고 컴포지트 패턴으로 이 FileLogger, SlackLogger를 감쌉니다.

```php
<?php
class CompositeLogger implements LoggerInterface
{
	protected $loggers;

	public function __construct(array $loggers = [])
	{
		$this->loggers = $loggers;
	}

	public function addLogger(LoggerInterface $logger)
	{
		$this->loggers[] = $logger;
	}

	public function log(string $message)
	{
		foreach ($this->loggers as $logger) {
			$logger->log($message);
		}
	}
}
```

기존의 홈컨트롤러는 아마 다음과 같이 불렀을 겁니다.

```php
<?php
$logger = new FileLogger('somewhere/log/hello.log');

$controller = new HomeController($logger);
```

여기가 다음과 같이 수정됩니다.

```php
<?php
$logger = new CompositeLogger();
$logger->addLogger(new FileLogger('somewhere/log/hello.log'));
$logger->addLogger(new SlackLogger(new Slack()));

$controller = new HomeController($logger);
```

Slack으로 로그 남기는 기능은 `SlackLogger`라는 클래스가 추가되면서 문제가 해결되었습니다. 또한 나중에
`EmailLogger`와 같은 기능들이 추가된다면 마찬가지로 `LoggerInterface`를 구현한 객체만 만들면 됩니다.
추가한 클래스는 마찬가지로 `CompositeLogger`에 추가하기만 하면 됩니다. "확장에는 열려있다"는 것은 "기존에
작성한 클래스에는 영향을 미치지 않고 계속해서 기능을 확장할 수 있다"는 것을 의미합니다.

Slack으로 로그를 남길 수 있는 기능이 추가 되면서 `HomeController`는 바뀌지 않았습니다. 그리고 당연한
이야기지만 `FileLogger`도 아무것도 수정되지 않았습니다. "수정에 대해서는 닫혀있다"는 것은 기능이 추가되면서
자신과 관계 없다면 수정하면 안된다는 것을 의미합니다. 

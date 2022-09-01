---
layout: post
title: "Typescript SOLID (2) - 개방폐쇄원칙(OCP)"
summary: "개방-폐쇄 원칙(OCP, Open-Closed Principle)이란, 소프트웨어 개체는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다."
date: 2022-09-01 22:37:12 +09:00
tags: ["cleancode", "solid", "designpattern", "typescript"]
---

개방-폐쇄 원칙(OCP, Open-Closed Principle)이란,

> 소프트웨어 개체는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다.

위 정의에서 이야기하는 개체는 함수단위가 아닌 클래스(혹은 객체)를 이야기합니다. 좀 더 크게 보면 모듈까지 확장할 수 있습니다.

"확장에는 열려 있다"는 말은 기존 기능에 새로운 기능을 확장하기 쉬워야 한다는 의미입니다. "수정에 대해서는 닫혀 있다"는 말은 새로운 기능을 확장하면서 기존의 코드에는 변화가 없어야 한다는 의미입니다. 이를 위해서는 인터페이스(혹은 추상클래스)를 잘 활용해야합니다.

예를 들어봅시다. 웹 컨트롤러를 호출 했을 때, 사용자 정보에 대한 로그를 쌓고, 메시지를 반환하는 프로그램이 있다고 해봅시다.

```typescript
class HomeController {

	welcome(user: User) {
		this.#log(`${user.name}님이 방문했습니다.`)
		return "hello world!"
	}

	#log(message: string) {
		this.writeMessageToFile(message, 'info.log')
	}
}
```

아주 단순하게 작성하였습니다. 이제 여기에 추가 요구사항이 들어옵니다. 파일에 작성하는 로그 메시지를 슬랙으로도 전달 받고 싶다고 합니다. 그렇다면 다음과 같이 코드가 추가됩니다.

```typescript
class HomeController {
	constructor(public slack: Slack) {
	}

	welcome(user: User) {
		this.#log(`${user.name}님이 방문했습니다.`)
		this.slack.sendMessage(`${user.name}님이 방문했습니다.`)
	}

	#log(message: string) {
		this.writeMessageToFile(message, 'info.log')
	}
}
```

기능을 확장하는데 있어서 수정에는 닫혀있어야 하는데, HomeController 코드 전체가 수정되었습니다. 지금은 HomeController에 welcome 한곳에서만 Log를 사용하니까 한곳만 수정하면 됩니다. 만약에 로그를 사용하는 곳이 여러곳이 있다면 모든 부분을 찾아서 슬랙 코드를 삽입해주어야 합니다. 그리고 이 과정에서 누락이 있을 수 있겠지요.

어떤 식으로 코드를 작성하면 OCP를 만족할 수 있을까요? 인터페이스를 통해서 로그를 사용하고, 이 인터페이스를 구현하였다면 더 프로그램이 유연해집니다. 인터페이스를 사용하게 되면 기존 기능은 수정하지 않아도 새로운 기능을 확장할 수 있습니다.

다음과 같이 Logger를 정의해봅시다.

```typescript
interface Logger {
	log(message: string): void
}
```

그리고 기존의 HomeController는 다음과 같이 작성할 수 있습니다.

```typescript
class HomeController {
	constructor(public logger: Logger) {
	}

	welcome(user: User) {
		this.logger.log(`${user.name}님이 방문했습니다.`)
	}
}
```

그리고 파일에 로그를 작성하는 `FileLogger`는 다음과 같이 작성할 수 있습니다. 

```typescript
class FileLogger implements Logger {
	constructor(public path: string) {
	}

	log(message: string): void {
		this.#writeToFile(message)
	}

	#writeToFile(message: string) {
		// 생략
	}
}
```

메인은 아마도 다음과 같을겁니다.

```typescript
const logger = new FileLogger('./output.log')
const controller = new HomeController(logger)

/* .. 생략 .. */

controller.welcome(user)
```

이제 슬랙으로 로그를 받고싶다는 요구사항을 반영해봅시다. SlackLogger는 다음과 같이 구현할 수 있습니다.

```typescript
class SlackLogger implements Logger {
	constructor(public slack: SlackClient) {}

	log(message: string): void {
		this.slack.sendMessage(message)
	}
}
```

복수의 Logger를 호출하기 위해 컴포지트 패턴(Composite Pattern)으로 이 FileLogger, SlackLogger를 감쌉니다. 여기서도 FileLogger, SlackLogger를 직접 호출하지 않고 Logger 인터페이스를 호출 하고 있다는 점에 유의합시다.

```typescript
class CompositeLogger implements Logger {
	loggers: Logger[] = []

	addLogger(logger: Logger) {
		this.loggers.push(logger)
	}

	log(message: string): void {
		this.loggers.forEach(logger => logger.log(message))
	}
}
```

이제 메인은 다음과 같이 변경됩니다.

```typescript
const logger = new CompositeLogger()
logger.addLogger(new FileLogger('./output.log'))
logger.addLogger(new SlackLogger(slackClient))

const controller = new HomeController(logger)

/* .. 생략 .. */

controller.welcome(user)
```

주요 프로그램인 HomeController는 변경하지 않았지만 기능이 확장되었습니다. 만약에 로그를 이메일로 받고 싶다고 하면, 이와 같은 식으로 EmailLogger만 추가하면 됩니다.

물론, 이를 위해서 메인코드가 변경되었지만 이또한 DI Container를 활용하게 되면 메인 코드도 최소한의 변경을 통해 쉽게 기능을 변경 또는 확장할 수 있습니다.

---
layout: post
title: "Typescript SOLID (1) - 단일책임원칙(SRP)"
summary: "객체지향에서 가장 모호한게 클래스의 크기를 규정하는 일입니다. 단일 책임 원칙(SRP, Single Responsibility Principle)은 이 문제를 해결 할 수 있도록 가이드라인을 제시합니다."
date: 2020-03-10 22:38:12 +09:00
tags: ["cleancode", "solid", "designpattern", "typescript"]
---

객체지향에서 가장 모호한게 클래스의 크기를 규정하는 일입니다. 단일 책임 원칙(SRP, Single Responsibility Principle)은 이 문제를 해결 할 수 있도록 가이드라인을 제시합니다.

> 한 클래스는 하나의 책임만 가져야 한다.

정의는 한문장으로 명확하지만, 막상 정의에 따라 코딩하려고 하면 막막해집니다. 하나의 책임을 어떻게 정의할 수 있을까요?

웹크롤러를 만든다고 가정해봅시다. 웹크롤러는 다음 로직에 따라 동작합니다.

1. 주어진 링크로 페이지에 접속합니다.
2. 페이지를 저장합니다.
3. 페이지에서 링크를 찾습니다.
4. 찾은 링크를 가지고 다시 1번으로 돌아가서 반복합니다.

절차지향적으로 생각하면 쉽습니다. 위의 로직을 코드로 작성하면 다음과 같습니다. 전체를 하나의 메서드로 작성할 수 있으나 구현 자체가 중요하지 않으니, 각 단계마다 `private` 메서드로 분리하였습니다.

```typescript
class WebCrawler {

  public async crawl(link: string) {
    const page = await this.getHtmlPage(link) // 1
    await this.savePage(link, page) // 2
    const links = this.findALinks(page) // 3

    for (const link of links) {
      await this.crawl(link) // 4
    }
  }

  private getHtmlPage(link: string): Promise<string> { /* do something */ }
  private savePage(link: string, page: string): Promise<void> { /* do something */ }
  private findALinks(page: string): string[] { /* do something */ }
}
```

웹크롤러가 가져야 하는 책임은 무엇일까요? 당연한 이야기지만 웹페이지를 수집(Crawl)하는 일 입니다. 로직을 살펴보면 문제가 없어보입니다. 하지만 이 과정을 조금 더 자세히 들여다 봅시다.

1. 주어진 링크로 **HTTP(or HTTPS)를 통해서** 페이지에 접속합니다.
2. 페이지를 **Database에** 저장합니다.
3. **HTML** 페이지에서 **DOMSelector을 이용해서** 링크를 찾습니다.
4. 찾은 링크를 가지고 다시 1번으로 돌아가서 반복합니다.

여기서 웹크롤러는 "웹페이지 수집"이라는 책임 뿐 아니라, 다른 3가지의 책임을 더 가지고 있습니다.

- HTTP를 통해 페이지를 가져오기
- 데이터를 Database에 저장하기
- HTML 페이지에서 링크 찾기

위 3가지의 행위는 웹크롤러가 해야하는 책임을 넘어서는 일이지요. 이럴 때, 해당 클래스는 SRP(단일 책임 원칙)를 위반했다고 할 수 있습니다. 이 문제를 해결하기 위해서 3가지 책임을 담당할 적당한 주체(클래스)를 만들어야 합니다. 그 클래스는 다음과 같습니다.

- HttpClient : 주어진 a 링크의 URL을 통해 페이지를 가지고 옵니다.
- Database : 수집한 HTML 문서를 저장합니다.
- DOMSelector : 수집한 HTML 문서에서 a 링크를 찾습니다.

위의 코드는 다음과 같이 개선되어야 합니다.

```typescript
interface HttpClient {
  request(link: string): Promise<{ body: string }>
}

interface Database {
  save(link: string, contents: string): Promise<void>
}

interface DomSelector {
  find(body: string, selector: string): { link: string }[]
}

class WebCrawler {

  public constructor(
    public http: HttpClient,
    public database: Database,
    public dom: DomSelector,
  ) {
  }

  public async crawl(link: string) {
    const { body } = await this.http.request(link) // 1
    await this.database.save(link, body) // 2
    const elems = this.dom.find(body, 'a') // 3
    for (const elem of elems) {
      await this.crawl(elem.link) // 4
    }
  }
}
```

<div class="mermaid" style="max-width: 480px">
classDiagram
WebCrawler --> HttpClient
WebCrawler --> Database
WebCrawler --> DOMSelector
WebCrawler : +crawl()
HttpClient : +request()
Database : +save()
DOMSelector : +find()
</div>

객체지향 프로그래밍에서 주체는 "객체"입니다. 영어 문장의 구성을 떠올려보면 쉽게 이해할 수 있습니다.

> 주어 + 동사 + 목적어

주어(객체 / 클래스)가 누구인지, 동사(메서드)가 무엇인지, 목적어(매개변수)는 무엇인지를 떠올려보면 SRP에서 이야기하는 책임이 무엇인지 추상적으로 그려질겁니다.

자칫 메서드를 "책임"으로 오인할 수 있습니다. 책임은 메서드보다는 해당 클래스가 할 수 있는 행동, 좀 더 근본적인거라 할 수 있습니다. 데이터베이스라면 읽고, 쓰고, 삭제하는 행동 등을 가지고 있고, **데이터를 관리하는 책임**을 가지고 있다고 할 수 있습니다.

이처럼 책임을 분리하는 것은 정말 어려운(모호한!) 일입니다. 사실 깊게 생각하면 사소한 것 하나하나 전부 클래스로 나눌 수 있습니다. 처음부터 이렇게 디테일하게 구성하려고 하면 많은 시간이 필요합니다. 처음부터 세세하게 나눌 필요는 없습니다. 처음에는 위의 처음 예시처럼 `private`를 사용해도 됩니다. 하지만 어떻게 책임을 나눌 수 있을지는 미리 고민해보아야 합니다. 나중에 프로그램의 규모가 커졌을 때, 미리 어떻게 책임을 나눌지 고민하고 코딩했을 때와, 그렇지 않을 때, 리팩토링하는데 들어가는 시간에는 차이가 클 것입니다.

언제 리팩토링하는지는 다른 좋은 코드를 많이 보고, 많이 생각하고, 많이 코딩해보는 수 밖에 없습니다. :-)

---
layout: "post-design-pattern"
chapter: "a.1.1"
title: "디자인패턴 공부하기 - 부록1.1. SOLID, 단일책임원칙(SRP)"
date: 2018-02-02 11:54:55 +09:00
tags: ['designpattern', 'php']
---

객체지향에서 가장 모호한게 클래스의 크기를 규정하는 일입니다. 단일 책임 원칙(SRP, Single Responsibility
Principle)은 이 문제를 해결 할 수 있도록 가이드라인을 제시합니다.

> 한 클래스는 하나의 책임만 가져야 한다.

이 정의는 명확해보이지만, 생각하기에 따라서 굉장히 애매한 문제가 될 수 있습니다.

예를 들어봅시다. 웹크롤러를 만드려고 합니다. 웹크롤러는 다음과 같이 동작합니다.

1. 주어진 링크로 페이지에 접속합니다.
2. 페이지를 저장합니다.
3. 페이지에서 링크를 찾습니다.
4. 찾은 링크를 가지고 다시 1번으로 돌아가서 반복합니다.

위의 생각을 바탕으로 간단히 코드로 정리해보면 다음과 같습니다.

```php
<?php
class WebCrawler
{
    public function crawl($link)
    {
        $page = $this->getHtmlPage($link);
        $this->savePage($page);
        $links = $this->findALinks($page);
        foreach ($links as $link) {
            $this->crawl($link);
        }
    }

    private function getHtmlPage($link) { /* do something */ }
    private function savePage(string $page) { /* do something */ }
    private function findALinks(string $page) { /* do something */ }
}
```

웹크롤러가 가져야 하는 책임은 무엇일까요? 바로 웹페이지를 수집(Crawl)하는 일입니다. 위 클래스를 보면
그다지 문제가 없어보입니다. 하지만 이 과정을 조금 더 자세히 들여다 봅시다.

1. 주어진 링크로 **HTTP(or HTTPS)를 통해서** 페이지에 접속합니다.
2. 페이지를 **Database에** 저장합니다.
3. 페이지에서 **DOMSelector을 이용해서** 링크를 찾습니다.
4. 찾은 링크를 가지고 다시 1번으로 돌아가서 반복합니다.

이 웹크롤러는 "웹페이지 수집"뿐 아니라, 다른 메서드를 통해 3가지의 책임을 더 가지고 있었습니다. 이럴 때, 해당
클래스는 SRP(단일 책임 원칙)를 위반했다고 할 수 있습니다. 이 문제를 해결하기 위해서 3가지 책임을 담당할
적당한 주체(클래스)를 만들어야 합니다. 그 클래스는 다음과 같습니다.

 - HttpClient : 주어진 a 링크의 URL을 통해 페이지를 가지고 옵니다.
 - Database : 수집한 HTML 문서를 저장합니다.
 - DOMSelector : 수집한 HTML 문서에서 a 링크를 찾습니다.

소스코드는 다음과 같이 바뀝니다.

```php
<?php
class HttpClient
{
	public function request($link): string { /* do something */ }
}

class Database
{
	public function save($link, $contents) { /* do something */ }
}

class DomSelector
{
	public function find($selector): array { /* do something */ }
}

class WebCrawler
{
	protected $http;
	protected $db;
	protected $dom;

	public function __construct(HttpClient $http, Database $db, DomSelector $dom)
	{
		$this->http = $http;
		$this->db = $db;
		$this->dom = $dom;
	}

    public function crawl($link)
    {
        $page = $this->http->request($link);
        $this->db->save($link, $page);
		$elems = $this->dom->find("a");
        foreach ($elems as $elem) {
            $this->crawl($elem->link);
        }
    }
}
```

<div class="mermaid">
classDiagram
WebCrawler --> HttpClient
WebCrawler --> Database
WebCrawler --> DOMSelector
WebCrawler : +crawl()
HttpClient : +request()
Database : +save()
DOMSelector : +find()
</div>

이처럼 책임을 분리하는 것은 정말 어려운 일입니다. 물론, 사소한 것 하나하나 전부 클래스로 나누는 것이 굉장히
소모적일 수 있습니다. 시간도 많이 들여야 합니다. 그래서 메서드의 크기가 작을 때는 `private`를 사용하고, 조금
규모가 커지겠다 싶을 때 과감히 클래스를 나누면 된다고 생각합니다. 클래스를 나누는 타이밍은 코드를 많이 작성하면서 감을 익히는 수 밖에 없습니다.

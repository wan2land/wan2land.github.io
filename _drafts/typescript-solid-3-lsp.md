---
layout: post
title: "Typescript SOLID (3) - 리스코프치환원칙(LSP)"
summary: "리스코프 치환 원칙(LSP, Liskov Subsitution Principle)~~~~"
date: 2020-03-10 22:38:12 +09:00
tags: ["cleancode", "solid", "designpattern", "typescript"]
---

https://ko.wikipedia.org/wiki/%EB%A6%AC%EC%8A%A4%EC%BD%94%ED%94%84_%EC%B9%98%ED%99%98_%EC%9B%90%EC%B9%99


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

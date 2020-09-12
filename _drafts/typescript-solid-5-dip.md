---
layout: post
title: "Typescript SOLID (5) - 인터페이스분리원칙(DIP)"
summary: "의존관계 역전 원칙(DIP, Dependency Inversion Principle)~~~~"
date: 2020-03-10 22:38:12 +09:00
tags: ["cleancode", "solid", "designpattern", "typescript"]
---

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


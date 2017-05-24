---
layout: post
title: "디자인패턴 공부하기 - 0. Intro"
date: 2017-05-25 07:54:00 +09:00
tags: ['designpattern', 'php']
---

프레임워크를 작업하면서 두루뭉술하게 알고 있던 디자인 패턴들을 최근에 다시 복습겸 공부하기 시작하였습니다.
예전에 학부시절에 수업으로 한번 공부했었던 내용이지만, 이제와서 보니 더 새로운 부분이 많고, 그때는 이해가지 않았던 내용들도 있어서 다시한번 정리할겸 글을 작성해보려고 합니다.

아무래도 제가 이해한 내용을 기반으로 작성한 블로그 글이다 보니 많이 미흡한 부분이 많습니다. 다음의 참고자료를 함께 보면 더더욱 도움이 많이 될 것입니다. :-)

- [GoF의 디자인 패턴](http://www.yes24.com/24/goods/17525598)
- [DesignPatterns PHP](http://designpatternsphp.readthedocs.io/en/latest/README.html)

## 디자인패턴

일단, 디자인 패턴은 크게 3가지로 나뉩니다. GoF의 디자인 패턴이 94년에 쓰여진 책이라고하는데, 여기서도 패턴을 크게 3가지로 나뉩니다. ~~적고 보니 알파벳 갯수도 똑같네요.~~

1. 생성패턴(Creational Pattern)
2. 구조패턴(Structural Pattern)
3. 행동패턴(Behavioral Pattern)

생성패턴은 객체의 생성을 담당합니다. 단순히 `new MyClass`라고 하면 끝나는 내용이지만, 반복적인 내용에 대한 부분을 어떻게 패턴화 시키는지에 대해서 다룹니다. 요즘, 현재의 프레임워크들은 이러한 생성방식을 컨테이너에 담고 있습니다. 컨테이너에서는 어떻게 사용하고 있는지 다뤄볼 생각입니다.

구조패턴은 다양한 객체간의 관계를 쉽게 풀어내기 위한 패턴입니다. 프로그램이 커지면 자연스럽게 객체간의 관계가 서로 뒤엉키게 됩니다. 이를 어떻게 쉽게 구조화 할 수 있는지에 대해 다루고 있습니다. 실제로 서비스를 만들다 보면 초반에는 별로 필요성을 느끼지 못하지만, 레거시가 축적될 수록 많은 필요성을 느끼게 되는 패턴입니다.

행동패턴은 다양한 객체간의 동작방식에 대한 패턴입니다. 이 부분은 해당 단원을 다룰 때 다시 내용을 정리하겠습니다.


## PHP

이 블로그 포스팅은 PHP를 기반으로 작성되었습니다. 이왕이면 최신의 PHP 기법을 사용할 것입니다. PHP7.1 이상에서 동작하는 코드를 다룰 것입니다.

그리고 참고용 소스는 Symfony, Laravel 등, 제가 그동안 공부하면서 보아왔던 좋은 소스들과 제가 작업한 소스에서 가지고 올 예정입니다. :-)

## 관련포스트

1. 생성패턴(Creational Pattern)
    1. [단순팩토리 (Simple Factory)](/posts/2017/05/25/php-design-pattern-1-simple-factory)
    1. [정적팩토리 (Static Factory)](/posts/2017/05/25/php-design-pattern-2-static-factory)
    1. 추상팩토리 (Abstract Factory)
    1. 팩토리 메서드 (Factory Method)
    1. 빌더 (Builder)
    1. 단일체/싱글턴 (Singleton)
    1. 멀티턴 (Multiton)
    1. 원형/프로토타입 (Prototype)
    1. 풀 (Pool)
1. 구조패턴(Structural Pattern)
    1. (작성중)
1. 행동패턴(Behavioral Pattern)
    1. (작성중)

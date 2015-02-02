---
layout: post
title: 웹개발자가 하는 윈도우 프로그래밍 (1)
---
##Prologue

음, 일단 저는요..

항상 가지고 노는 환경이 OSX, Linux입니다. 가지고 노는 도구는 PHP, Node, Objective-C 입니다. 아주 가끔 Python, Java등을 쓸때도 있습니다.

천성이 게으르다 보니 C, C++ 잘 사용하지 못합니다.. 그런 제가 어쩌다 보니 윈도우 프로그램을 만들게 되었습니다.

![슴무룩](/content/images/2014/Oct/___.png)
~~망했어요.. 아마 난 안될거야..~~

어차피 시작된거 제대로 해보기로 했습니다. 어쩌면 세상에는 저같은 개발자가 또 있을 수 있다는 생각이 들었습니다. 이 글은 저같은 3류 웹개발자도 적당한 품질의 윈도우 프로그램을 만들 수 있다는 것을 보여주기 위해서 남겨보기로 했습니다.

이미 좋고 많은 자료들이 인터넷에 널려있습니다. 무엇을 찾았고 어떻게 적용했는지 생각의 흐름을 작성해보았습니다.

##And Begin.

처음에는 [Node Webkit](https://github.com/rogerwang/node-webkit" target="_blank)을 생각했습니다. 일단 제가 할 수 있는 선에서 최선이었습니다. 어차피 GUI프로그램일 테니까. (Node Webkit은 언젠가 한번 사용할 것 같은 느낌이 들어 여기에 잠깐 써봤습니다.)

**그러나!!** 한참 공부하던 도중 프로젝트의 방향이 전환되었습니다. GUI가 갖는 비중이 줄어들어버렸기 때문입니다. 그리고 그 많은 GUI는 기존에 있는 프로그램에 붙어서 돌아가는 형태가 되었습니다.

다른 프로그램(그것도 제가 아닌 남이 작성한)에 붙어서 돌아가려면 기본적으로 기존의 프로그램과 통신이 되어야겠다는 생각이 들었습니다. 자바스크립트로 생각하면 남의 프로그램의 버튼에 EventListener를 달고 언제 그 액션이 발생하는지 추적해야 합니다. 또한 남의 프로그램에 버튼을 작동시킬 수 있어야합니다. EventEmitter가 필요하겠네요.

뭐 대충 우리 어렸을 적 키로거와 비슷하단 생각이 들었습니다. 찾아보니 후킹이라는 것을 사용하면 된다고 합니다. 대학교 운영체제 시간에 들었던 기억이났습니다. 예전부터 "난 웹으로 진출할거야~"라며 수업을 듣지 않았던 과거의 저를 원망하며 부랴부랴 자료를 찾기 시작했습니다. 컴공과 학생분들, 수업 열심히 들으세요. 이세상에 버리는 지식은 없습니다.

가장먼저 언어를 고르기로 했습니다. 당연한 얘기지만 OS를 가지고 놀아야 하기때문에 3가지로 압축이 됩니다. C, C++, C#. C랑 C++는 예전에 누구나 다 깨작여 봤을.. 그런 허접한 수준의 실력을 갖추고 있었고. C#, 이놈은 무어냐 해서 잠깐 찾아보았습니다. 언어를 순식간에 훑어보니 Java랑 굉장히 유사한 문법을 갖고 있었습니다. 또한 C, C++에서 작성된 모듈을 붙일 수 있었습니다. C#을 사용하기로 결정했습니다. (그냥 아직 C가 무서워요..)

다음은 프로그램의 요구사항을 나누어 봤습니다.

1. 다른 프로그램에 붙어서 돌아갈 것. (EventListener, EvnetEmitter 필요.)
2. 1에서 이야기한 다른 프로그램은 여러가지 임. (즉, 유연하게 대처할 수 있어야 함.)
3. 해당 프로그램과 본 서버가 동기화 되어야 할 것.

1번의 문제를 세부적으로 나누어 보았습니다. 우선 해당 프로그램의 프로세스정보를 가져와야하고, 그 프로그램에서 나오는 정보를 후킹합니다.

후킹으로 어떻게 사브작사브작하면 될 것 같았습니다. 2번은 JSON으로 관리파일을 하나 두고 그에 맞는 방식으로 프로그램이 돌아가게 설계하면 될것 같습니다. 3번은 우리 서버 API는 내 손에 쥐고 있으니 HTTP Request로 어떻게든 하면 될것 같았습니다.

##다른 프로그램 정보가져오기

후킹을 바로 시작하기에 앞서 다른 프로그램의 정보를 어떻게 가져올지 가장 많이 생각했습니다.

##후킹

후킹에 대해서는 [신영진님](http://www.jiniya.net" target="_blank)이 작성하신 글을 상당수 응용하였습니다. 총 9개의 글로 구성되어있습니다.

1. [키보드 모니터링 프로그램 만들기](http://www.jiniya.net/lecture/maso/hook1.pdf" target="_blank)
2. [마우스 훅을 통한 화면 캡쳐 프로그램 제작](http://www.jiniya.net/lecture/maso/hook2.pdf" target="_blank)
3. [메시지훅 이용한 Spy++ 흉내내기](http://www.jiniya.net/lecture/maso/hook3.pdf" target="_blank)
4. [SendMessage 후킹하기](http://www.jiniya.net/lecture/maso/hook4.pdf" target="_blank)
5. [Spy++ 클론 imSpy 제작하기](http://www.jiniya.net/lecture/maso/hook5.pdf" target="_blank)
6. [저널 훅을 사용한 매크로 제작](http://www.jiniya.net/lecture/maso/hook6.pdf" target="_blank)
7. [WH_SHELL 훅을 사용해 다른 프로세스 윈도우 서브클래싱 하기](http://www.jiniya.net/lecture/maso/hook7.pdf" target="_blank)
8. [WH_DEBUG 훅을 이용한 훅 탐지 방법](http://www.jiniya.net/lecture/maso/hook8.pdf" target="_blank)
9. [OUTPUTDebugString의 동작 원리](http://www.jiniya.net/lecture/maso/hook9.pdf" target="_blank)



http://nowonbun.tistory.com/122


기승전오픈소스. 만세입니다.

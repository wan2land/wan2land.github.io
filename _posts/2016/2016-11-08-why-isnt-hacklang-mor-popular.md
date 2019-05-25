---
layout: post
title: "왜 Hacklang은 더 유명해지지 않을까?"
date: 2016-11-08 16:45:35 +09:00
tags: ["php", "hhvm"]
---

PHP 프레임워크를 만들면서 다양한 프레임워크를 공부하고 있는데 그 중 하나가 스프링입니다. 그 중 메타프로그래밍과 AOP에
꽂혀서 [doctrine/annotations](github.com/doctrine/annotations)를 가지고 놀고 있습니다. 실제로 PHP RFC에서도 표준을
책정하려는 [움직임](https://wiki.php.net/rfc/attributes)이 있었지만 아직은 표준이되지 못했습니다.

그러던 중, Hack에서 [Attributes](https://docs.hhvm.com/hack/attributes/introduction)라는 기능이 있다고 알게되었습니다.
문득, [완두](https://wandu.github.io) 프레임워크가 Hack을 공식 지원하면 좀더 코딩이 재미있지 않을까, 더 유익하지 않을까
생각을 하였습니다.

그래서 기존에 있는 프로젝트를 찾아보기로 하였습니다. 누군가는 이걸로 프레임워크를 만들었을 줄 알았습니다. 하지만 의외로
프레임워크를 떠나서 마땅한 프로젝트도 찾을 수 없었습니다. 그렇다면 이 좋은 언어(어디까지 제가 생각하기에)인 Hack을 왜
사람들은 사용하지 않을까 고민을 했습니다. 그리고, Quora에서 비슷한 고민을 하는 사람을 찾았습니다.

> 원글 : [www.quora.com/Why-isnt-Facebooks-hack-language-more-popular](https://www.quora.com/Why-isnt-Facebooks-hack-language-more-popular)

그리고 왜 잘 사용하지 않는지에 대해 조목조목 이야기 하는 답변이 달려있는 것을 볼 수 있었습니다. 완전히 만족스러운 답은
아니지만 외국에서 Hack을 어떻게 바라보는지 대충 알 수 있게 되었습니다.

~~그리고 앞으로 Hack을 쓰고 싶은 충동이 들어도 다음의 글을 되뇌이며 충동을 가라앉혀야겠죠...~~

정리하면 다음과 같습니다. :-)

- PHP는 지금도 충분히 괜찮다. 그리고 대부분의 사람들은 Facebook 만큼의 거대한 규모를 필요로 하지 않는다.
- Hack은 겨우 2년이 되었을 뿐이다. 유명해지기에 충분한 시간을 갖지 못하였다.
- Hack은 현존하는 존재하는 PHP 코드와 양립할 수 없는 것 같고, 이로 하여금 Hack으로의 교체 부담을 증가시킨다.
- Hack은 HTML 템플릿과 Hack코드를 함께 사용하는 것을 허용하지 않는다. 이는 PHP에서 가장 유명한 기능중 하나이다.
- 장기적으로 Facebook은 Hack을 지원 할지 안할지 애매하다. 그래서 개발자들은 전환하려고 하지 않는다.
- 페이스북은 심지어 언어를 홍보하지 않는 것 같다. 그리고 우리가 Hack을 사용하더라도 돈이 벌리지 않아서 신경쓰지 않는다.
- Hack은 속도는 물론이고 PHP가 할 수 있는 만큼 충분이 많은 것을 하지 못한다. 그리고 지금은 PHP7이 어쩄든 문제를
해결하고 있다. 그런데 왜 바꾸겠는가?

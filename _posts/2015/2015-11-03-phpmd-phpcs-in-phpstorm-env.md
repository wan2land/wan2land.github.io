---
layout: post
title: PHPStorm 환경에서 Mess Detector, Code Sniffer 설정하기
date: 2015-11-03 19:59:53 +09:00
tags: ["php", "phpmd", "phpcs"]
---

Composer(이하, 컴포저)를 일단 Global 환경에서 사용해야합니다. 해당 내용은 예전에 한번 이야기 한적이 있습니다. 다음
링크를 참조하시기 바랍니다. (조금 옛날 글이네요..)

- [Composer Global로 사용하기](/posts/2014/06/12/use-global-composer/)

위 글에서, 그대로 따라할 필요는 없고, 그냥 저런 내용이 있다는 것을 참고만 하시면 됩니다.

우선, Mess Detector와 Code Sniffer가 무엇인고 하니, 코딩 스타일을 체크해주는 도구입니다. 또한 복잡도가 높은 코드를
체크해줍니다. 그리고 이 녀석들은 PHPStorm과 함께 사용하면 거의 실시간으로 작성한 코드를 검사해주는 **필수적인**
도구입니다.

설치해봅시다.

```
composer global require squizlabs/php_codesniffer phpmd/phpmd
```

위의 내용을 터미널에서 사용하기 위해서는 $PATH 변수에 `~/.composer/vendor/bin` 디렉토리가 추가되어있어야 합니다.
그러나, 우리는 터미널에서 사용하지 않고 PHPStorm에서 사용하기 때문에 생략해도 됩니다.

PHPStorm을 열고 환경설정(Preferences...)을 갑니다. 그리고 그냥 검색합시다.

## Mess Detector 연결

![Where is PHPMD - (1)](/images/phpstorm/where-is-phpmd1.png)

![Where is PHPMD - (2)](/images/phpstorm/where-is-phpmd2.png)

그리고 설정에서 Inspection 메뉴를 찾아서 다음과 같이 설정해줍시다.

![Set PHPMD inspection](/images/phpstorm/phpmd-inspection.png)

## Code Sniffer 연결

![Where is PHPCS - (1)](/images/phpstorm/where-is-phpcs1.png)

![Where is PHPCS - (2)](/images/phpstorm/where-is-phpcs2.png)

그리고 설정에서 Inspection 메뉴를 찾아서 다음과 같이 설정해줍시다. Coding Standard는 여러분이 사용하고 싶은 것을 하면
되는데, 대부분 PSR2를 선택하시면 됩니다. 그 외에는 프로젝트에 따라서 맞춰 주시면 됩니다.

![Set PHPCS inspection](/images/phpstorm/phpcs-inspection.png)

여기까지 하면 설치와 사용할 준비가 완료되었습니다.

그리고 이제 잘못된 코딩 스타일을 사용하면 다음과 같이 Warning이 출력됩니다. :-)

![PHPCS warning](/images/phpstorm/phpcs-warning.png)

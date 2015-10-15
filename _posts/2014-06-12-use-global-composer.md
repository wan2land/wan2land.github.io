---
layout: post
title: Composer Global로 사용하기.
date: 2014-06-12 11:25:55 +09:00
tags: ['PHP', 'Composer']
---

어느정도 PHP를 사용한 사람들이라면 Composer를 누구나 한번쯤은 사용해보았을 것입니다. 아니, 요즘에는 거의 표준화처럼 자리를 잡게 되었죠.

![Composer](/images/dev/composer/logo.png)

근데 의외로 Composer가 Global설치를 지원하는지 모르는 분들이 제법 많습니다. ~~예, 사실 제가 그랬습니다.~~

Global설치가 무엇인고 하니, `bin`을 지원하는 패키지를 위한 것입니다. 예를 들자면 PHP에서 개발용으로 제작된 여러 도구들이 있는데, 이를테면 [phpunit](http://phpunit.de), [phing](http://www.phing.info), [phpdocumentor](http://www.phpdoc.org) 등이 있습니다.

공통점은 대부분 프로젝트에 사용된다는 점이 있습니다. 그리고 프로젝트 배포할때 웹에서 사용되지도 않을 저녀석들을 위해 어마어마하게 많은 용량과 시간을 할당해야하지요..

그럼 바로 시작해보겠습니다.

## 사용법

사용환경은 `OSX 10.9`를 기준으로 설명하였는데, 조금만 응용하면 다른 OS에서도 사용하실 수 있을 것 같습니다.

사용법은 너무나도 간단합니다.

```bash
$ composer global require 'phpunit/phpunit=3.7.*'
```

~~끝.~~

이렇게 만들고 나면 `home`디렉토리 아래에 `.composer`라는 폴더가 생성되고 그 아래에 패키지가 생성이 됩니다.

![](/images/dev/composer/global-composer-1.png)

그리고 그 안에 내부 파일 구조는 일반 프로젝트 패키지와 동일합니다.

![](/images/dev/composer/global-composer-2.png)

만약 디테일하게 조절하고 싶으시면 `composer.json`파일을 고쳐서 사용하시면 될것입니다. 그리고 저의 경우는 다음과 같이 구성해서 사용하고 있습니다.

<script src="https://gist.github.com/wan2land/cb96fb5ace014a3fbc3e.js"></script>

```bash
$ composer update
```

실행하시면 똑같이 실행됩니다. :)

그리고 `~/.composer/vendor/bin`폴더를 열어보시면 다음과 같이 `bin`파일들이 추가되어있는 것을 볼 수 있습니다.

![](/images/dev/composer/global-composer-3.png)

그리고 이제 저 프로그램들을 어디에서도 실행 할 수 있도록 `$PATH`에 추가하는 작업이 필요합니다. 방법도 간단합니다. 다음 두줄의 소스를 `.bash_profile`에 추가해주시면 됩니다.

리눅스의 경우는 `.bashrc`에 추가해주면 되고, ~~그외 다른 OS의 경우는 잘 모르겠습니다.~~

```bash
export PATH="~/.composer/vendor/bin:$PATH"
export PATH="~/.composer/bin:$PATH"
```

이 이후에는 쉘을 다시 실행하시면 됩니다. 이제 테스트해봅시다.

![](/images/dev/composer/global-composer-4.gif)

탭을 눌렀을때 자동완성은 기본입니다. :)


## 참고자료

- [Rob Allen Blog : Global installation of PHP tools with Composer](http://akrabat.com/php/global-installation-of-php-tools-with-composer)
- [Composer](https://getcomposer.org)

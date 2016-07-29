---
layout: post
title: 초간단 Window 10 PHP 환경 구축
date: 2016-07-29 14:00:45 +09:00
tags: ['PHP', 'Window', `chocolatey`]
---

Modern PHP에서 단언컨데 Composer는 꽃이라고 할 수 있습니다. OSX(혹은 리눅스!)환경에서는 콘솔 사용하기가 쉬워서 개발환경
만드는 일 또한 큰 문제가 되지 않습니다. 그러나, 윈도우에서는 개발환경 만드는게 쉽지 않다는 것을 알게되었습니다.
(언제까지 wamp를 사용할텐가!!)

.. 그래서 정리해봅니다 ..

## Chocolatey 설치

OSX나 리눅스에서는 보통 프로그램 설치를 `brew`, `apt-get`, `yum` 등을 사용합니다. 윈도우에서도 비슷한 녀석이 있었습니다.
윈도우용 패키지 매니저인 **Chocolatey**입니다.

- [chocolatey.org](https://chocolatey.org)

일단, 명령 프롬프트(`cmd.exe`)를 실행해야 합니다. 중요한 점은 실행할 때 "관리자 권한으로 실행"을 선택하셔야 합니다.
그리고, 위 사이트에 들어가서 **Install**메뉴에 가면 Powershell 커맨드가 있습니다. 그대로 복사해서 명령 프롬프트에
붙여넣어 줍시다. 그리고 기다리면 설치가 성공될겁니다.

그리고 명령 프롬프트를 껐다가 다시 실행하고 `choco`라고 입력해봅시다.

```sh
C:\> choco
Chocolatey v0.9.10.3

```

대충 위와 같이 나오면 성공입니다.

## PHP 설치

```sh
C:\> choco install php
```

위와 같이 명령어를 입력하면 알아서 설치가 끝납니다.

```sh
C:\> php -v
PHP 7.0.9 (cli) (built: Jul 20 2016 10:47:41) ( NTS )
Copyright (c) 1997-2016 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2016 Zend Technologies
```

설치가 끝나고 버전을 체크해보면 위와 같이 메시지가 출력됩니다. 근데 이 때, `VCRUNTIME140.dll`관련된 에러가 나올 수도
있습니다. 그냥 Visual Studio를 설치하시면 해결된다고 합니다. 혹은 해당 `dll`파일을 구해서 `C:\windows\system32`경로에
쏙 복사해서 넣어줍시다.

## MySQL 설치

```sh
C:\> choco install mysql
```

마찬가지로 위와 같이 명령어를 입력하면 알아서 설치가 끝납니다. 기본 아이디는 `root`이고 비밀번호는 설정되어있지
않습니다. 다음과 같이 입력하고 그냥 엔터 치면 Mysql 쉘이 실행됩니다.

```sh
C:\> mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.13 MySQL Community Server (GPL)

Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

## Composer 설치

컴포저도 아주 쉽게 설치할 수 있습니다.

```sh
C:\> choco install composer
```

### Composer Trouble Shotting - OpenSSL

보통은 그냥 설치 되는데, 저의 경우는  `openssl` 때문에 설치에 실패하였습니다. 이 문제는 `php.ini`가 제대로 설정되지
않아서 발생하는 문제입니다.

일단 php ini가 어떻게 되어있는지 확인을 위해서 입력하면 다음과 같이 나옵니다.

```sh
C:\> php --ini
Configuration File (php.ini) Path: C:\Windows
Scan for additional .ini files in: (none)
Additional .ini files parsed:      (none)
```

기본 `php.ini`를 불러오지 않는 것을 알 수 있습니다. Choco를 통해서 설치된 모든 패키지는 `C:\tools`라는 디렉토리 하위에
설치가 됩니다. PHP가 설치된 경로로 이동합시다.

```sh
C:\> cd C:\tools\php
C:\tools\php> dir
(생략)
2016-07-21  오전 03:27            70,802 php.ini-development
2016-07-21  오전 03:27            70,834 php.ini-production
(생략)
```

위 두개의 `php.ini`파일이 있는 것을 알 수 있습니다. 여기서 `php.ini-development`파일을 복사해서 `php.ini`로 붙여넣어
줍시다.

```sh
C:\tools\php> copy php.ini-production php.ini
```

그리고 메모장으로 `php.ini`파일을 열어서 내려보면 다음과 같은 부분을 찾을 수 있습니다.

```
;extension=php_mysqli.dll
;extension=php_oci8_12c.dll  ; Use with Oracle Database 12c Instant Client
;extension=php_openssl.dll
;extension=php_pdo_firebird.dll
;extension=php_pdo_mysql.dll
```

여기서 `php_openssl.dll`을 사용해야하기 때문에 다음과 같이 고쳐줍시다.

```
;extension=php_mysqli.dll
;extension=php_oci8_12c.dll  ; Use with Oracle Database 12c Instant Client
extension=ext/php_openssl.dll
;extension=php_pdo_firebird.dll
;extension=php_pdo_mysql.dll
```

choco를 통해서 php를 설치하였으면 PHP하위 경로인 `ext` 디렉토리 안에 대부분의 Extensions가 들어있습니다.
그리고 이제 다시 `choco install composer`를 통해 `composer`를 설치하시면 됩니다.

## PHP 서버 실행하기

이제 모든 웹개발을 할 준비가 되었습니다. 사실 여기서 Nginx, Apache와 같은 서버 프로그램을 깔면 가장 이상적이겠지만..
개발 환경에서는 PHP 내장 서버를 사용해도 충분합니다. 내장서버는 다음과 같이 실행할 수 있습니다. 다음은 Laravel이
설치되었다는 가정하에 서버를 띄우는 명령어입니다.

```sh
C:\Users\wan2land\Workspace\laravel> php -S localhost:8080 -t public
```

그리고 브라우저로 가서 `http://localhost:8080`을 입력하면 정상출력되는 것을 볼 수 있습니다.

## PHP Extension 추가하기

처음에 choco를 통해서 설치하면 `pdo`나, `mbstring`, `curl`과 같은 기본 라이브러리가 추가되어있지 않습니다. 이를
추가하는 것 또한 아주 쉽습니다. 위에 `composer` 항목을 자세히 봤다면 감이 올겁니다.

`c:\tools\php\php.ini`파일에서 `extension` 항목을 찾아서 주석(`;`)을 지워주면 됩니다.

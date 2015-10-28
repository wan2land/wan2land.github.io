---
layout: post
title: OSX El Capitan에서 Laravel 환경 구축
date: 2015-10-15 13:00:56 +09:00
tags: ['PHP', 'Laravel', 'OSX']
---

Laravel 개발하시는 분들은 대부분 [Homestead](http://laravel.com/docs/5.1/homestead)환경에서 개발하실 것입니다.

근데 사용하다 보니 테스트케이스가 너무 많아서 테스트 하는데만 3분이란 시간이 걸렸고, , Virtual Box의 Linux가 가끔 커널 패닉을 일으켜서 다시 실행하는 경우가 가끔 생겼었습니다. 그래서 OSX에 직접 Laravel 환경을 구축해야겠다는 생각이 들었습니다.

## Home Brew

누구나 따라할 수 있도록 처음부터 한단계씩 가도록 하겠습니다. 기본적으로 [Home Brew](http://brew.sh)(이하 Brew)라는 맥용 패키지 관리 도구를 사용할 것입니다. 해당 사이트로 이동하면 설치 할 수 있는 커맨드를 복사해서 쉘에 붙여넣도록 합시다.

참고로, XCode가 설치되어 있지 않으면 커맨드 도구를 완전히 사용할 수 없습니다. XCode를 설치하고 꼭 한번 실행해서 사용 ... "I Agree" 버튼을 누른 후 

## Nginx 설치

`brew install nginx`

## PHP 설치

`brew tab home/php?`
`brew install php56`

## PHP Module 설치

`brew install php56-xdebug`
`brew install php56-mcrypt`

## MySQL 설치

## Beantalkd 및 Memcached 설치 (선택)

`brew install php56-memcached`

## 도메인 설정

## 포트 포워딩

Brew를 통해서 설치된 Nginx의 경우 `sudo`권한으로 실행을 할 수 없습니다. 그래서 80번 포트를 사용할 수 없습니다. (지정 포트의 경우 Root 권한을 필요로 합니다.)

`sudo vim /etc/pf.anchors/laravel`

```
rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 8080
```

`sudo vim /etc/pf-laravel.conf`

```
rdr-anchor "forwarding"
load anchor "forwarding" from "/etc/pf.anchors/laravel"

```

**Syntax Error가 발생할 때, ** 마지막에 빈줄을 넣어야 합니다.

`sudo pfctl -ef /etc/pf-laravel.conf`


## 참고

 - [Port Forwarding in Mac OS Yosemite](http://abetobing.com/blog/port-forwarding-mac-os-yosemite-81.html)
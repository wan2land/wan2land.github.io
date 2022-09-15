---
layout: post
title: 초간단 OSX El Capitan에서 Laravel 개발환경 구축
date: 2015-11-01 20:54:05 +09:00
tags: ["php", "laravel"]
---

Laravel(이하 라라벨) 개발자분들은 대부분 [Homestead](http://laravel.com/docs/5.1/homestead)환경에서 개발하실 것입니다.

근데 사용하다 보니 테스트케이스가 너무 많아서 테스트 하는데만 3분이란 시간이 걸렸고, Virtual Box의 Linux가 가끔 커널
패닉을 일으켜서 다시 실행하는 경우가 가끔 생겼었습니다. 그래서 OSX에 직접 라라벨 환경을 구축해야겠다는 생각이
들었습니다.

## Home Brew

누구나 따라할 수 있도록 처음부터 한단계씩 가도록 하겠습니다. 기본적으로 [Home Brew](http://brew.sh)(이하 Brew)라는 맥용
패키지 관리 도구를 사용할 것입니다. 해당 사이트로 이동하면 설치 할 수 있는 커맨드를 복사해서 쉘에 붙여넣도록 합시다.

참고로, XCode가 설치되어 있지 않으면 커맨드 도구를 완전히 사용할 수 없습니다. XCode를 설치하고 꼭 한번 실행해서 약관에
동의해야합니다.

## PHP 설치

다음은 라라벨을 사용을 위해 PHP를 설치해야합니다. 일단 PHP 패키지를 설치하기 위해 Brew에 탭을 하나 추가해야합니다.

```bash
brew tap homebrew/php
```

그리고 다음과 같이 PHP를 설치할 수 있습니다. 저는 PHP 5.6을 사용하겠습니다. 유사한 방식으로 다른 버전도 사용가능합니다.
최근에 추가된 PHP 7.0도 사용가능합니다.

```bash
brew install php56
```

라라벨을 사용하기 위해 필요한 모듈도 설치합니다.

```bash
brew install php56-xdebug
brew install php56-mcrypt
```

## MySQL 설치

데이터 베이스는 MySQL을 사용합시다.

```bash
brew install mysql
```

서버를 실행하기 위해서는 다음 두 과정을 거쳐야 합니다.

```bash
ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```

그러나!!! 더 **쉬운** 방법이 있습니다. 위 명령어의 경우 OSX의 Launchctl에 plist파일을 등록해서 실행하는 방식입니다.
Linux를 사용해보신 분들이라면 `service mysql start`라는 방식을 선호하실 겁니다. Brew에서 이런 유사한 방식으로 서버를
실행할 수 있는 명령어를 지원해줍니다. 일단, 다음 명령어를 입력합니다.

```bash
brew tap homebrew/services
```

이제 다음과 같이 MySQL을 실행할 수 있습니다.

```bash
brew services start mysql
```

정지하는 방법도 똑같습니다.

```bash
brew services stop mysql
```

마찬가지로 다음 명령어를 통해 실행가능합니다.

```bash
brew services start mysql
```

MySQL을 동작시켰다면, 접속을 해서 사용자 설정을 해야합니다. 초기 아이디는 root이고 비밀번호는 없습니다. 꼭 한번은
접속해서 비밀번호를 바꿔주시기 바랍니다. 여기서는 비밀번호를 root로 했다고 가정하고 진행하도록 하겠습니다.

## Composer 설치

Composer(이하, 컴포저)는 PHP의 의존관계를 관리해주는 패키지 매니저입니다. 라라벨을 사용하기 위해서는 반드시 컴포저가
필요합니다.

[Composer Installation](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx)

설치 방법은 위에 제시된 페이지에 있는 방법을 사용해도 되지만 위에서 설치한 Brew를 통해서도 쉽게 설치가 가능합니다.

```bash
brew install composer
```

## 라라벨(Laravel) 설치

컴포저의 설치가 끝났으면 이제 우리 글의 목표였던 라라벨을 설치해야 합니다.

[Laravel Installation](http://laravel.com/docs/5.1/installation)

위 문서에 잘 나와있는데, 저는 `create-project`를 통해 생성하겠습니다. 설치할 경로에 가서 다음 명령어를 입력합니다.

```bash
composer create-project laravel/laravel --prefer-dist
```

DB를 사용해야 하면 `.env`파일을 열어 다음과 같은 내용을 찾습니다.

```
DB_HOST=localhost
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret
```

그리고 아까 MySQL에 설정해놓은 아이디와 비밀번호를 넣습니다. 드디어, 모든 준비를 마쳤습니다. PHP
Built-in(이하, 내장 서버)를 통해 쉽게 서버를 켜고 끌 수 있습니다.

```bash
php -S 0.0.0.0:8080 -t public
```

그리고 웹브라우저에서 `localhost:8080`을 입력하면 다음과 같은 화면을 만나 볼 수 있습니다.

![Hello Laravel](/images/2015/2015-11-01-laravel-enviroment-settings/hello.png)

서버를 실행할 때 위와 같은(`php -S ...`) 명령어를 매번 입력하기 귀찮으면 예전에 다루었던 포스팅을 참고하시기 바랍니다.

- [Alias PHP Built-in Server](/posts/2015/10/15/alias-php-built-in-server/)

## 포트 포워딩

테스트를 할때 매번 `localhost:8080` 이런식으로 사용할 수는 없습니다. `laravel.dev` URL을 연결하는 작업을 해봅시다.

**16.06.08 수정된 내용**

전에는 `brew services`라는 명령어가 `sudo`로 동작이 안될거라 생각했습니다. 그런데 어느날 확인해보니
`sudo brew services`를 지원하고 있다는 사실을 알게되었습니다. 그래서 예전내용 보다는 다음 명령어를 통해서 실행하는 편이
더 간단합니다. :-)

```bash
sudo brew services start nginx
```

그리고 `brew services list`를 입력하면 현재 실행중인 리스트가 출력됩니다. 그 중 다음 내용을 포함하면 성공입니다.

```
nginx                      started root     /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
```

**16.06.08 이전에 작성된 내용 (혹시나 해서 남겨둡니다..)**

~~PHP 내장 서버는 80번 포트를 사용하기 힘듭니다. 물론, `sudo` 명령어를 통해 80번 포트를 사용할 수는 있으나 이게 매번~~
~~하자면 굉장히 귀찮은 일입니다. 그래서 포트포워딩, 즉 80번 포트로 들어오면 우리가 실행한 서버의 포트로 들어올 수 있도록~~
~~설정을 합니다.~~

~~잠깐 설명하자면 이러한 방식은 나중에 Brew를 통해 설치된 Nginx를 사용할 때에 유용합니다. `brew services start nginx`로~~
~~서버를 실행할 때 Nginx는 root권한이 없기 때문에 80번 포트를 사용할 수 없습니다. OSX에서는 지정 포트는 root권한으로~~
~~실행하도록 하고 있기 때문입니다.~~

~~다음 파일을 열고,~~

```bash
sudo vim /etc/pf.anchors/laravel
```

~~다음과 같이 입력하고 저장합니다.~~

```
rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 8080
```

~~그리고 다음 파일을 열고,~~

```bash
sudo vim /etc/pf-laravel.conf
```

~~다음과 같이 입력합니다. 중요한게 마지막에 반드시 **빈줄 한 줄을** 추가해주어야 합니다. 그렇지 않으면 Syntax Error가~~
~~발생할 수 있습니다.~~

```
rdr-anchor "forwarding"
load anchor "forwarding" from "/etc/pf.anchors/laravel"
```

~~이제 방금 만든 파일을 다음 명령어를 통해 적용시켜줍시다.~~

```bash
sudo pfctl -ef /etc/pf-laravel.conf
```

~~이제 `localhost` 80포트로 들어온 모든 데이터를 8080포트로 전달해줄 것입니다.~~

## Hosts 파일에 접근경로 추가하기

그리고 `localhost`를 조금 있어보이게 `laravel.dev`로 바꾸는 작업을 해야하는데 이것은 `/etc/hosts` 파일을 수정하면
됩니다. `/etc/hosts`에서 `.com`, `.net`과 같은 최상위 도메인(TLD)도 사용 가능하나 실수를 방지하기 위해서 가급적
`.dev`와 같은 방식을 사용하는 것이 좋습니다. :-)

```bash
sudo vi /etc/hosts
```

맨뒤에 다음 한줄을 추가해줍시다.

```
127.0.0.1       laravel.dev
```

간단히 설명하면 브라우저에 `laravel.dev`를 입력하면 `/etc/hosts` 파일의 설정값을 통해서 `127.0.0.1`로 접속을
시도합니다.

이제 `laravel.dev`를 브라우저에 띄워봅시다. (잘뜹니다.)

## Nginx 설치

기본 개발 환경은 위에까지 내용으로도 충분합니다. 그러나 여러개의 사이트를 동시에 테스트를 할땐 매번 PHP 내장 서버를
사용하는 것도 엄청 귀찮은 일입니다. 그리고 PHP 내장 서버 특성상 동시에 2개의 다른 프로젝트를 켤 수가 없습니다.
(여기서 동시는 같은 포트를 공유하는 이라는 의미입니다.)

생각해보면, 모든 포트는 8080으로 매핑이 되어있을 텐데, 실제로는 서버이름(laravel.dev, laraother.dev 등)으로 분리할
방법이 없습니다. 그래서 Nginx를 설치해봅시다.

```bash
brew install nginx
```

그러면 설치 과정이 나오고 설치가 완료 됩니다. 서버를 실행하기 위해서는 다음 명령어를 사용해야 합니다. 이제 다음
명령어를 통해 Nginx서버를 켤 수 있습니다.

```bash
sudo brew services start nginx
```

다음 두 명령어를 통해서 `nginx.conf` 설정 파일을 다운 받을 수 있습니다.

```bash
rm /usr/local/etc/nginx/nginx.conf
curl -L https://gist.github.com/frdmn/7853158/raw/nginx.conf -o /usr/local/etc/nginx/nginx.conf
```

Nginx는 PHP-FPM과 함께 사용되어야 하는데 Nginx에서 이를 연결하기 위한 파일을 다운받아야 합니다.

```bash
mkdir -p /usr/local/etc/nginx/conf.d
curl -L https://gist.github.com/frdmn/7853158/raw/php-fpm -o /usr/local/etc/nginx/conf.d/php-fpm
```

그리고 이제 사용할 서버에 관한 설정 파일을 다운 받습니다.

```bash
mkdir -p /usr/local/etc/nginx/sites-available
curl -L https://gist.githubusercontent.com/wan2land/54b068a4b9cead321225/raw/2e0da15b9000be36e69bcdb3963854e9f1706d84/nginx-laravel.dev -o /usr/local/etc/nginx/sites-available/laravel.dev
```

그리고 내부에 내용을 조금 수정해야합니다.

```bash
vi /usr/local/etc/nginx/sites-available/laravel.dev
```

`root`부분에 `/var/www`를 자신이 설치한 라라벨의 경로로 수정하자. 설치된 라라벨의 경로는 `public`까지 포함되어야 한다.
그리고 `listen`을 `80`포트로 변경해줍니다. (8080도 사용하는데 지장은 없습니다.)

보통 Nginx 설정에서는 `sites-available`폴더에 사용가능한 모든 설정을 넣어두고 `sites-enabled`에서 심볼릭 링크를
만들어서 사용합니다.

```bash
mkdir -p /usr/local/etc/nginx/sites-enabled
ln -s /usr/local/etc/nginx/sites-available/laravel.dev /usr/local/etc/nginx/sites-enabled/laravel.dev
```

그리고 로그 내용을 보기 위해서 다음 디렉토리도 만들어주자.

```bash
mkdir -p /usr/local/etc/nginx/logs
```

그리고 이제 Nginx와 PHP-FPM을 실행하면 된다. PHP-FPM은 Brew에서 설치한 패키지 이름을 따라가게 되어있습니다. 따라서
리눅스와 같은 `php5-fpm`이 아닌 `php56`을 사용합니다. 이점에 유의하시기 바랍니다.

```bash
sudo brew services start nginx
brew services start php56
```

만약 Nginx가 실행중이면 `start`대신에 `reload`를 사용하면 된다. 이제 `laravel.dev`를 브라우저에 띄우면 역시 Laravel 5
라는 메시지를 확인할 수 있습니다.

## 참고

 - [Port Forwarding in Mac OS Yosemite](http://abetobing.com/blog/port-forwarding-mac-os-yosemite-81.html)
 - [Install Nginx, PHP-FPM, MySQL and phpMyAdmin on OS X Mavericks or Yosemite](http://blog.frd.mn/install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew/)

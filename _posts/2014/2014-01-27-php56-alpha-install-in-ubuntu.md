---
layout: post
title: 우분투에 PHP 5.6 alpha 설치하기.
date: 2014-01-27 12:09:39 +09:00
tags: ["php", "ubuntu"]
---

PHP 5.6 Branch가 생성되고 얼마 지나지 않아 지난 2014년 1월 23일 5.6alpha1 버전이 공개되었습니다.

![php5.6 released!](/images/2014/2014-01-27-php56-alpha-install-in-ubuntu/php56-release.png)

PHP라는 언어는 항상 버전업 될 때마다 하위호환성을 유지하는데 굉장히 힘쓰면서도, 새로운(기존에 다른 언어에서 사용되는) 문법 도입이 자주 일어나고 있습니다. 이번 5.6에서도 재밌는 문법이 도입되어서 써보고 싶어서 깔아보았습니다. :)

이 설치하기라는 포스팅을 작성한 것은 여태까지 PHP는 리눅스에서는 apt-get이 깔아주는 줄 알았고, 맥에서는 homebrew가 깔아주는 줄 알았습니다. -_-;

직접 하나하나 설치하면서 그 작업과정을 정리할 겸 올리게 되었습니다.

## 설치 환경

- 가상머신 Parallels, Single Core, 1GB Ram
- Ubuntu 12.04 LTS Server
- Nginx (`sudo apt-get nginx`로 설치 가능)

Nginx위에서 돌릴 것이라 php-fpm을 까는 과정으로 진행하도록 하겠습니다. 또한, 간단한 명령어들은 별도로 설명하진 않겠지만, 혹시나 모르는 분들이 검색해서 찾아서 공부할 수 있도록 최대한 세세한 부분까지 주석처럼 달아놓겠습니다. :)

저의 경우 Ubuntu 서버 설치 직후 바로 php를 깔았던지라 몇 가지 필요한 사전 프로그램들이 있었습니다. Ubuntu 서버버전을 처음 깔아보는 초보인지라 기본으로 `gcc`랑 `make`가 들어있지 않은지 몰랐습니다.. PHP를 설치하면서 부가적으로 설치했던 내용입니다.

```bash
sudo apt-get install gcc
sudo apt-get install make
sudo apt-get install libxml2-dev
sudo apt-get install libreadline-devel
```

그냥 자연스럽게 진행하면서 경고메시지만 읽으면 필요한 게 무엇인지 알 수 있습니다. :)

## 다운로드

다운로드는 다음 페이지에서 진행할 수 있습니다. www.php.net 을 통해서도 접근 가능합니다.

<http://downloads.php.net/tyrael>

다운로드(wget 명령어 사용) 받은 후 원하는 디렉터리에 압축을 풉니다(tar명령어 사용). 저의 경우, /home/wani/ (사용자 최상위 디렉터리. `cd ~`를 통해 접근 가능)에 다운로드 받고 해당 폴더에 압축을 풀었습니다.

## 설치

```bash
cd php-5.6.0alpha1
pwd # => print /home/wani/php-5.6.0alpha1
```

해당 폴더에 보면 `configure`파일이 있습니다. 이 파일을 통해 php설치 설정을 할 수 있습니다. 많은 옵션이 있지만 저는 필요한 최소한의 것만 설치하였습니다.

```bash
./configure --prefix=/usr/local/php56 \
--enable-fpm \
--with-readline
```

`/usr/local/php56`은 php5.6을 설치할 경로이고, `--enable-fpm`은 php-fpm 설치를 위한 것이며, `--with-readline`은 PHP Interactive Shell(`php -a`)을 위한 옵션입니다.

그리고 자연스럽게 make를 진행하시면 됩니다.

```bash
make
make install
```

그러면 적당히 뭐가 막 지나가고 설치가 완료됩니다. 경고메시지를 잘 읽어보시면 뭐가 필요한지 알 수 있습니다. 설치 환경이 저랑 완전 같으면 **설치환경**에서 이야기한 프로그램만으로도 별 문제없이 진행하실 수 있습니다.

PHP bin폴더를 $PATH에 등록해주고, `php -v`를 통해 버전을 확인하시면 다음과 같은 메시지를 확인할 수 있습니다.

```bash
export PATH="/usr/local/php56/bin:$PATH"
php -v
```

```
PHP 5.6.0alpha1 (cli) (built: Jan 27 2014 00:35:12) 
Copyright (c) 1997-2014 The PHP Group
Zend Engine v2.6.0-dev, Copyright (c) 1998-2014 Zend Technologies
```

이제 `php.ini`파일과 `php-fpm.conf`파일을 복사해와야합니다. `php.ini`의 경우 `/home/wani/php5.6.0alpha1/php.ini-production`(압축을 푼 경로)을 복사하면 됩니다. `php-fpm.conf`는 `/home/wani/php5.6.0alpha1/sapi/fpm/php-fpm.conf`에 있는 파일을 복사하면 됩니다.

```bash
cd ~/php5.6.0.alpha1
cp ./php.ini-production /usr/local/php56/lib/php.ini
cp ./sapi/fpm/php-fpm.conf /usr/local/php56/etc/php-fpm.conf
```

다음 `php-fpm`을 `init.d`에 등록해서 서버를 실행할 차례입니다. 설치경로 아래에 `sapi/fpm`안에 들어있습니다. 그리고 실행 권한을 줘야합니다.

```bash
cd ~/php5.6.0.alpha1/sapi/fpm
sudo cp ./init.d.php-fpm /etc/init.d/php-fpm
sudo chmod 755 /etc/init.d/php-fpm
```

`php-fpm.conf`의 내용을 편집해주어야 합니다.

```bash
vi /usr/local/php56/etc/php-fpm.conf
```

```
...(생략)

user = nobody
group = nobody

...(생략)

listen = /var/run/php5-fpm.sock

...(생략)
```

user, group은 php를 수행할 사용자와 그룹을 지정하는데 저는 그냥 기본으로 되어있는 nobody로 두었습니다. 나중에 여러 사용자가 설정할 때는 제대로 지정해주어야 하는데 여기는 속성으로 설치하는 방법만 설명하기 때문에 그냥 기본으로 지나가겠습니다.

그리고 listen 이부분을 `/var/run/php5-fpm.sock`으로 잡은 것은 nginx와의 통신을 위한 설정입니다. :)

이제 php-fpm을 실행해봅시다! 아까 user, group을 nobody로 지정을 했는데 기본적으로 nobody라는 그룹이 리눅스안에는 없기 때문에 간단하게 추가하고나서 실행해봅시다.

```bash
groupadd nobody
sudo service php-fpm start
```

쉽게 실행이 됩니다 :)

## Nginx와의 연동

이제 nginx에서 설정을 잡아주어야 합니다. apt-get으로 설치하였다면 `/etc/nginx/`에 자리를 잡고 있을 것입니다. 거기서 `sites-available/default`파일을 수정할 것입니다.

```bash
cd /etc/nginx/sites-available
vi default
```

중간에 보면 주석처리된 부분이 있는데 다음 처럼 주석을 풀어주면 됩니다.

```
location ~ \.php$ {
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    #       # NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
    #
    #       # With php5-cgi alone:
    #       fastcgi_pass 127.0.0.1:9000;
    #       # With php5-fpm:
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}
```

`fastcgi_pass unix:/var/run/php5-fpm.sock` 이부분이 아까 `php-fpm.conf`에서 설정한 부분이랑 일치해야합니다. 해당 소켓을 통해서 nginx와 php-fpm이 통신을 합니다. :)

그리고 nginx와 php-fpm을 재부팅합니다.

```bash
sudo service nginx restart
sudo service php-fpm restart
```

그리고 Nginx기본 설정을 사용한다면 `/usr/share/nginx/www`가 기본 홈폴더입니다.

거기에 phpinfo.php 파일을 하나 만들고 다음과 같이 작성합시다.

```php
<?php
phpinfo();
```

웹에서 http://localhost/phpinfo.php 를 입력하면 다음과 같은 화면이 출력될 것입니다!

![Install Complete!](/images/2014/2014-01-27-php56-alpha-install-in-ubuntu/php56-phpinfo.png)

이제 다음에는 php5.6에서 추가된 내용에 대해서 다뤄보도록 하겠습니다 :)


## 참고자료

- <http://systemv.pe.kr/php5.5_installation>
- <http://blog.beany.co.kr/archives/2665>
- <http://ncube.net/10070>

잘못설명한 부분이 있거나 부족한 부분이 있으면 언제든지 지적해주시면 감사하겠습니다. :)

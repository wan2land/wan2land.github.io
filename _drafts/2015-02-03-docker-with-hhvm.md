---
layout: post
title: "Docker에 HHVM 환경 구축하기."
date: 2015-02-03 13:42:03
categories: 
---

물론 쉽게 설정하는 방법은 이미 누가 만들어 놓은 것을 가져다 쓰면 됩니다. 그렇지만 본질은 제대로된 도크의 작업 프로세스의 이해이기 때문에 빡세게 그냥 해봤습니다.

## HHVM 설치하기

<https://github.com/facebook/hhvm/wiki/Building-and-installing-HHVM-on-Ubuntu-14.04>

##PPA 개념

Personal Package Archive 의 약자로서..

launchpad.net에서 관리가 되는 듯 하다.

$ add-apt-repository ppa:mapnik/boost
$ add-apt-repository --remove ppa:whatever/ppa

Docker + HHVM + nginx

<http://www.pyrasis.com/private/2014/11/30/publish-docker-for-the-really-impatient-book>

참고링크 : <http://www.pyrasis.com/book/DockerForTheReallyImpatient/Chapter03>



Dockerfile

```
FROM ubuntu:14.04
MAINTAINER Foo Bar <foo@bar.com>

RUN apt-get upgrade
RUN apt-get update
RUN apt-get install -y wget
RUN apt-get install -y nginx
RUN wget -O - http://dl.hhvm.com/conf/hhvm.gpg.key | apt-key add -
RUN echo deb http://dl.hhvm.com/ubuntu saucy main | tee /etc/apt/sources.list.d/hhvm.list
RUN apt-get update
RUN apt-get install -y hhvm

RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf
RUN chown -R www-data:www-data /var/lib/nginx

VOLUME ["/data", "/etc/nginx/site-enabled", "/var/log/nginx"]

WORKDIR /etc/nginx

CMD ["nginx"]

EXPOSE 80
EXPOSE 443
```

## HHVM 인스톨

apt-get install libboost-all-dev=1.53.0 (with version)
apt-cache policy package (버전 조회)


 hhvm : Depends: libboost-filesystem1.53.0 but it is not installable
        Depends: libboost-program-options1.53.0 but it is not installable
        Depends: libboost-system1.53.0 but it is not installable
        Depends: libboost-system1.53.0 but it is not installable
        Depends: libboost-regex1.53.0 but it is not installable
        Depends: libicu48 but it is not installable
        Depends: libtasn1-3 but it is not installable
        Depends: libboost-thread1.53.0 but it is not installable


---
layout: post
title: "Docker 시작하기."
date: 2015-02-02 14:56:42 +09:00
tags: ["docker"]
---

NHN D2 Fest에서도 들었고, 주변에서도 이야기만 많이 들은 Docker. 대략적인 개념은 알고있고 여튼 서버 관리하기가 편해진다는 말에 시작해보기로 했습니다.

굳이 이 블로그 글에서 이것저것 이야기 하는 것보다 더 자세히 잘나와있는 사이트를 하나 소개합니다. "가장 빨리 만나는 Docker"라는 책이 시중에 나와있습니다.

![Docker Book](/images/dev/docker/docker-book.png)

<http://www.pyrasis.com/private/2014/11/30/publish-docker-for-the-really-impatient-book>

그런데 해당 책의 원고를 공개해 놓았습니다. ~~아무래도 인터넷으로 보는거라 번거로운 분들은 하나 구매하는 것도.. (저는 출판사랑 아무 관련 없습니다. ;))~~

본 글은 제가 Docker를 설치하면서 했던 짓을 정리해보고자 작성하였습니다. 최근에 [Ubuntu를 12.04에서 14.04 버전으로 업데이트](/dev/ubuntu/ubuntu-upgrade-12-to-14/)했던 것도 도커를 설치하기 위해서 였습니다. 12.04에서는 설치방법이 이래저래 너무 복잡했었기 때문입니다.

## 설치하기

```bash
$ apt-get update 
$ apt-get install docker.io
```

위 명령어를 통해 쉽게 설치가 가능합니다. 근데 저의 경우는 `linux-headers-server`에서 의존성이 없다고 경고가 나왔습니다.

![Install Warning](/images/dev/docker/install-dependency-warning.png)

지정한 버전의 `linux-headers-server` 패키지가 없다는 건데, 시키는대로 하면 잘 됩니다. 

```bash
$ apt-get install -f
```

위 명령어를 통해 없는 제대로 되어있지 않은 의존성을 해결할 수 있다고 합니다. (`man apt-get`) 그리고 나머지 설치 과정을 진행해봅시다.

```bash
$ ln -sf /usr/bin/docker.io /usr/local/bin/docker
```
설치가 완료되고 `docker.io`라는 파일의 링크를 생성하면 설치가 끝납니다.

## 기본 Ubuntu 이미지 가져오기

기본적으로 사용할 ubuntu 이미지를 가져와야합니다. 다음 명령어를 통해 가져올 수 있습니다.

```bash
$ docker search ubuntu
$ docker pull ubuntu:latest
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
ubuntu              latest              5ba9dab47459        4 days ago          188.3 MB
```

## Docker 실행하기.

위에서 가져온  ubuntu 이미지를 통해 도커 컨테이너를 실행하는 예제입니다. 내부적으로 /bin/bash를 실행하여 접근했을 때 bash를 통해 접근할 수 있도록 해줍니다.

```bash
$ sudo docker run -i -t --name sample ubuntu /bin/bash
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                       PORTS               NAMES
93610851fd42        ubuntu:latest       /bin/bash           2 minutes ago       Exited (130) 9 seconds ago                       sample
```

그 외에도 많은 명령어가 있지만 다음 링크를 참고하면 됩니다.

<http://www.pyrasis.com/book/DockerForTheReallyImpatient/Chapter03>

요즘 너무 핫한 녀석인지라 인터넷에 조금만 검색해도 어마어마하게 많은 자료가 나옵니다. 그리고 이것저것 실험해볼 수록 참 재밌는 녀석입니다. 다음 포스팅에서는 간단히 사용해볼 Dockerfile을 만들어보려고 합니다 :)

참고로, Dockerfile을 어떻게 만들어야할지 애매할 때, 이미 있는 것들을 검색해서 슬쩍 훔쳐보는 것도 하나의 공부방식인 것 같습니다. 모든 도커는 [도커허브](https://registry.hub.docker.com)에서 관리되고 있습니다. :) ~~(제가 맨땅의 헤딩하는 방법입니다.. 또르르..)~~

## 참고자료

- <http://www.pyrasis.com/private/2014/11/30/publish-docker-for-the-really-impatient-book>
- <https://docs.docker.com/installation/ubuntulinux>

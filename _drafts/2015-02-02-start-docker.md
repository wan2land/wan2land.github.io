---
layout: post
title: "Docker 시작하기"
date: 2015-02-02 14:56:42
categories: Dev Docker
---

Docker + HHVM + nginx

<http://www.pyrasis.com/private/2014/11/30/publish-docker-for-the-really-impatient-book>

참고링크 : <http://www.pyrasis.com/book/DockerForTheReallyImpatient/Chapter03>

```bash
$ apt-get install docker.io
$ apt-get install -f
$ ln -sf /usr/bin/docker.io /usr/local/bin/docker
$ docker search ubuntu
$ docker pull ubuntu:latest
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
ubuntu              latest              5ba9dab47459        4 days ago          188.3 MB
$ sudo docker run -i -t --name wani ubuntu /bin/bash

$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                       PORTS               NAMES
93610851fd42        ubuntu:latest       /bin/bash           2 minutes ago       Exited (130) 9 seconds ago                       wani
```


Dockerfile

```
FROM ubuntu:14.04
MAINTAINER Foo Bar <foo@bar.com>

RUN apt-get update
RUN apt-get install -y nginx
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf
RUN chown -R www-data:www-data /var/lib/nginx

VOLUME ["/data", "/etc/nginx/site-enabled", "/var/log/nginx"]

WORKDIR /etc/nginx

CMD ["nginx"]

EXPOSE 80
EXPOSE 443
```






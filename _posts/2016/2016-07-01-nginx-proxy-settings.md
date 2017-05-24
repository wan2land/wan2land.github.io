---
layout: post
title: "Nginx 하위 경로를 다른 서버로 보내기"
date: 2016-07-01 11:22:21 +09:00
tags: ['nginx', 'proxy']
---

서비스를 운영하다가 `wani.kr`라는 도메인은 A라는 서버에 물려있고, `wani.kr/other`은 B라는 서버에 물리게 할 일이
있었습니다. 그럴때는 nginx proxy를 사용하면 됩니다.

다음 설정은 `wani.kr`라는 서버에서 `wani.kr/other`로 요청할 경우 `111.11.11.11`과 `111.11.11.12`로 나누어서 요청을
보낼때의 설정입니다.

```
server {
    listen       80;
    server_name  wani.kr;

    # 여기에는 기존 wani.kr 서버 세팅들이 들어가 있음.

    location /other/ {
        rewrite ^/other(/.*)$ $1 break; # url에서 other 뒤에 있는 URL을 전부 그대로 사용.
        proxy_pass http://other;
        proxy_set_header X-Real-IP $remote_addr; # 실제 접속자의 IP를 X-Real-IP 헤더에 입혀서 전송.
        proxy_redirect off;
    }
}

upstream other {
    server 111.11.11.11:80;
    server 111.11.11.12:80;
}
```

제대로 뜨는가 해서 봤더니 그냥 `nginx`기본 페이지가 출력되고 있었습니다. 왜인고 하니, `111.11.11.11`과 `111.11.11.12`
서버는 Host가 `wani.kr`로 설정이 되어있지 않았습니다. 물론 이 두 서버의 설정을 바꾸면 되지만 프록시에서 두 서버에서
인식할 수 있는 Host 헤더를 별개로 넣어주면 됩니다.

```
server {
    listen       80;
    server_name  wani.kr;

    location /other/ {
        rewrite ^/other(/.*)$ $1 break;
        proxy_pass http://other;
        proxy_set_header Host other.wani.kr; # 두 서버에서는 other.wani.kr 을 host로 인식. 
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Proxy-From wani.kr; # 프록시가 여러대이고 어디서 왔는지 인식해야 한다면 추가.
        proxy_redirect off;
    }
}

upstream other {
    server 111.11.11.11:80;
    server 111.11.11.12:80;
}
```

또 만약에 `111.11.11.11`, `111.11.11.12` 이 두 서버의 사양이 달라서 처리양이 다르면 `weight`를 통해서 설정이 가능합니다.

```
upstream other {
    server 111.11.11.11:80 weight=1;
    server 111.11.11.12:80 weight=3;
}
```

참 쉽죠?

## 참고

 - [Nginx Docs - Module ngx_http_upstream_module](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)
 - [Nginx Guide - Reverse Proxy](https://www.nginx.com/resources/admin-guide/reverse-proxy/)
 
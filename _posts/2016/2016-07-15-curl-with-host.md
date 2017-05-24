---
layout: post
title: "서버 외부에 연결하기 전에 제대로 출력되는지 확인하기"
date: 2016-07-15 15:47:36 +09:00
tags: ['curl']
---

현재 Localhost에 모든 서버 설정을 다 해놓고, 외부에 스위치에 연결하기 전에
서버가 제대로 출력되는지 확인하고 싶을 때가 있다.

보통 Nginx, Apache의 경우 헤더의 `Host`를 기준으로 설정을 불러오기 때문에
Bash를 통해서 헤더만 살짝 만져주면 된다.

예를들어 `blog.wani.kr` 도메인을 확인하려고 하면..

```
curl -H "Host: blog.wani.kr" "http://127.0.0.1/posts/hello-world"
```

위와 같이 입력하면 된다.

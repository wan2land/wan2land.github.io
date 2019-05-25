---
layout: post
title: "블로그 리뉴얼, 그리고 D2Coding 웹폰트"
summary: "블로그를 리뉴얼하면서 D2Coding 웹폰트 만들기까지, 야크털 깎기를 소개합니다."
date: 2019-05-25 19:00:55 +09:00
tags: ["webfont", "d2coding"]
---

오랜만입니다.

간만에 블로그를 리뉴얼하고 싶었습니다.

꼬꼬마 개발자 시절, 블로그를 만들 때 "누구보다 예뻐야해!"라고 생각해서 힘을 많이 주었습니다. 요즘에는 군더더기 없이 깔끔한 게 좋아 디자인(이랄 것도 없는)을 심플하게 바꿨습니다.

개발자 같은 느낌으로 만들려면 **고정폭글꼴(Monospace)** 폰트가 제격입니다. 웹폰트가 지원되는 형태로 쓸만한 고정폭 글꼴을 찾기 위해 [구글 폰트](https://google.com/fonts)에 들어갔습니다. 예전보다 한글폰트가 많이 늘었지만, **Monospace**옵션을 선택하는 순간 검색 결과가 1개(.........) 나왔습니다.

![구글폰트 이미지](/images/2019/190525-googlefont.png)

나눔고딕코딩은 제 취향이 아니라서, 한글폰트중에 고정폭글꼴이 뭐가 있는지 찾아봤습니다.

- [나눔고딕코딩](https://github.com/naver/nanumfont)
- [D2Coding](https://github.com/naver/d2codingfont)

찾아보니 애초에 몇개 없습니다. 다른 선택지인 D2Coding을 누가 CSS로 정리하고 CDN에 올린 게 없는지 찾아보니, **Joungkyun**님이 만든 패키지가 있었습니다.

- [github.com/Joungkyun/font-d2coding](https://github.com/Joungkyun/font-d2coding)

Github이니까 **JsDelivr**로 대충 땡겨오면 되겠다 싶어 사용했는데 용량이 커서 페이지가 나오는 데 오래 걸렸습니다. `woff2`기준 1.5MB였습니다. 좀 더 줄일 방법이 없나 싶었는데, 이상진님이 FE CONF 2018에서 [발표한 글](https://slides.com/sangjinlee/webconf-2018-5)을 봤었던 게 떠오르더군요.

바로 실천해봅시다.

일단 가장 먼저 [NPM](https://www.npmjs.com/package/d2coding)에 등록했습니다. 요즘에는 CSS도 빌드하여 사용하므로 CSS, Font 패키지도 전부 NPM에 등록하는 추세입니다. 그동안 아무도 등록하지 않았기 때문에 추가했습니다(개이득!). 나중에 프로젝트 진행하다가 혹시 또 사용하게 될지도 모르니까요. 그리고 공식 패키지로 등록한 만큼 최대한 많은 경우의 수를 지원해야했습니다. 사용자가 이 패키지에서 어떤 옵션으로 사용할지 모르므로, 사용가능한 모든 옵션을 4가지로 정리했습니다.

1. D2Coding
2. D2Coding Ligature
3. D2Coding + Subset
4. D2Coding Ligature + Subset

한글 문자셋에서 자주 사용하는 글자로만 압축한 걸 서브셋이라고 합니다.

D2Coding 폰트의 현재버전은 **Ver 1.3.2(2018.06.01)**입니다. 나중에 해당 폰트가 업그레이드 된다면 다시 빌드해야합니다. 폰트를 업로드하면 `woff`, `woff2`를 생성하는 웹사이트는 편리하지만, 반복해서 사용할 수 없습니다. 발표를 자세히 보니 [Python Fonttools](https://github.com/fonttools/fonttools)을 사용한다고 하여, 폰트를 생성하는 모든 스크립트를 `Makefile`에 다 때려넣었습니다. (혹시나 누군가 언젠가 사용할 때 참고하길 바라며..)

빌드하는데 시간이 오래 걸렸습니다. 명령어를 잘못 이해해서 몇번이고 다시 빌드했습니다. 그리고 최종 결과물!

`woff2` 기준, 1.5MB에서 357kB로 줄었습니다. `ttf`는 4.2MB에서 1.4MB로 줄었습니다. 결과는 대성공!

그리고, 이 블로그를 보시면 잘 적용된 모습을 볼 수 있습니다. (휴..)

> [github.com/wan2land/d2coding](https://github.com/wan2land/d2coding)

오늘도 보람차게 [야크털을 시원하게 깎았](https://www.lesstif.com/pages/viewpage.action?pageId=29590364)습니다.


참, 봤으면 "Star" 하나 씩 누르고 가주세요! 미리 감사합니다.

## 참고자료

- [Github - naver/d2codingfont](https://github.com/naver/d2codingfont)
- [웹폰트의 사용과 최적화, 이상진](https://slides.com/sangjinlee/webconf-2018-5)
- [웹폰트 경량화 - 폰트툴즈의 pyftsubset을 사용한 폰트 서브셋 만들기](https://www.44bits.io/ko/post/optimization_webfont_with_pyftsubnet)

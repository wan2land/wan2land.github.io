---
layout: post
title: "블로그 리뉴얼, 그리고 D2Coding 웹폰트"
date: 2019-05-25 19:00:55 +09:00
tags: ["webfont", "d2coding"]
---

오랜만입니다. 한동안 블로그 글을 안쓰다가 다시 글을 써보려고 합니다.

예전에는 블로그를 만들때는 "누구보다 예뻐야해!"라고 생각하며 힘을 줘야한다고 생각했지만, 이번 리뉴얼 때는 관리하는 비용을 최소로 줄이려고 하였습니다. 블로그는 간단하게 글을 쓸 수 있어야 하기 때문입니다. 그래서 디자인은 더욱 심플하게 바꾸었습니다.

디자인(디자인이랄 것도 없지만요..)은 개발자 같은 느낌으로 만들고 싶었습니다. 역시 개발자 하면 **고정폭글꼴(Monospace)** 폰트지요. 웹폰트가 지원되는 형태로 쓸만한걸 찾으려고 [구글 폰트](https://google.com/fonts)에 들어가보았습니다. 확실히 예전보다 한글폰트가 많이 늘었지만, **Monospace**옵션을 선택하는 순간 검색 결과가 1개 나오네요.

![구글폰트 이미지](/images/2019/190525-googlefont.png)

어..음.. 한글폰트중에 고정폭글꼴이 뭐가 있는지 찾아봤습니다.

- [나눔고딕코딩](https://github.com/naver/nanumfont)
- [D2Coding](https://github.com/naver/d2codingfont)

애초에 몇개 없는 상황이었습니다. 누가 CSS로 정리하고 CDN에 올라가있는건 없다가 찾은 패키지는 **Joungkyun**님이 만든 패키지였습니다.

- [github.com/Joungkyun/font-d2coding](https://github.com/Joungkyun/font-d2coding)

Github이니까 **JsDelivr**로 대충 땡겨오면 되겠다 싶어 사용했는데 용량이 너무 컸습니다. `woff2`기준 1.5MB 였습니다. 좀더 줄일 방법이 없나 싶었는데, 이상진님이 FE CONF 2018에서 [발표한 글](https://slides.com/sangjinlee/webconf-2018-5)을 봤었던게 떠오르던군요.

바로 실천해봅시다.

기존의 누가 패키지로 만들어져있는걸 다시 할 때는 뭐하나라도 나아야 합니다. 일단 가장먼저 한일은 [NPM](https://www.npmjs.com/package/d2coding)에 등록하였습니다. 요즘에는 CSS도 빌드하여 사용하기 때문에 CSS, Font 패키지도 전부 NPM에 등록하는 추세입니다. 아무도 등록하지 않았기 때문에 추가하였습니다. 나중에 프로젝트 진행하다가 혹시 또 사용하게 될지도 모르니까요. 그리고 공식 패키지로 등록한 만큼 최대한 많은 경우의 수를 지원해야했습니다. 사용자가 이 패키지에서 어떤 옵션으로 사용할지 모르기 때문입니다. 사용가능한 모든 옵션을 다 정리하니 총 4가지로 정리가 되었습니다.

1. D2Coding
2. D2Coding Ligature
3. D2Coding + Subset
4. D2Coding Ligature + Subset

Subset은 한글에서 자주 사용하지 않는 글자를 제거해서 용량을 줄인 폰트입니다.

D2Coding 폰트의 버전은 현재 "Ver 1.3.2 2018.06.01"였습니다. 추후 나중에 해당 폰트가 업그레이드 된다면 바로 다시 빌드해야합니다. 웹에 폰트를 업로드하면 `woff`, `woff2`를 생성하는 방식은 편리하지만, 반복적으로 사용할 수 없는 방법이었습니다. 발표를 자세히 보니 [Python Fonttools](https://github.com/fonttools/fonttools)을 사용한다고 합니다. 폰트를 생성하는 모든 스크립트를 `Makefile`에 다 때려넣었습니다. (혹시나 누군가 언젠가 사용할 때 참고하길 바라며..)

빌드하는데 시간이 오래 걸렸습니다. 명령어를 잘못이해해서 몇번이고 다시 빌드하였습니다. 그리고 최종 결과물!

`woff2` 기준, 1.5MB에서 357kB로 줄었습니다. `ttf`는 4.2MB에서 1.4MB로 줄었습니다. 결과는 대성공!


그리고.. 이 블로그에 JsDelivr를 통해 잘 적용하였습니다.

> [github.com/wan2land/d2coding](https://github.com/wan2land/d2coding)

오늘도 보람차게 [야크털을 시원하게 깎았](https://www.lesstif.com/pages/viewpage.action?pageId=29590364)습니다.


참, 봤으면 "Star" 하나 씩 누르고 가주세요. 감사합니다.

## 참고자료

- [Github - naver/d2codingfont](https://github.com/naver/d2codingfont)
- [웹폰트의 사용과 최적화, 이상진](https://slides.com/sangjinlee/webconf-2018-5)
- [웹폰트 경량화 - 폰트툴즈의 pyftsubset을 사용한 폰트 서브셋 만들기](https://www.44bits.io/ko/post/optimization_webfont_with_pyftsubnet)

---
layout: post
title:  "Ghost에서 Jekyll로 이사하기(1) - 글 가져오기"
date:   2015-01-30 10:42:00
categories: Dev Jekyll
---

블로그 글을 몇차례나 날리고 블로그 포스팅을 버전관리를 해야겠다고 생각을 했었습니다. 그러던 중 Jekyll이라는 블로그 툴을 발견하였습니다. "이것이 바로 개발자 블로깅 도구구나!" 라는 확신에 일단 이전 블로그 글들을 하나씩 이전을 하게 되었습니다. 근데 옮겨야 하는 글이 대충 80개 정도 였습니다. 일일이 위에 상단에 주석도 달아줘야하는 번거로운 일들을 손으로 해야하나 라는 생각이 들었습니다.

그래서 검색했습니다. "Migrate from Ghost to Jekyll" .

루비의 **루**자도 모르는 31류 개발자인 저도 할 수 있도록 최대한 쉽게 설명했습니다. :)

## 시작하기

일단 Jekyll 공식 사이트에서 Ghost를 이전하는 방법을 제공하고 있습니다. ([참고사이트](http://import.jekyllrb.com/docs/ghost)) 우선 뭔가 ghost.db파일이 필요한 것 같았습니다. Ghost를 설치하셨다면 알 수 있을 겁니다. sqlite를 기반으로 한 db파일이 필요해서 제 블로그에서 쉽게 추출해낼 수 있었습니다. 기본 설치를 했다는 가정하에 `/yourpath/ghost/content/data/`에서 찾을 수 있을 것입니다.

그리고 해당 파일을 제 Jekyll폴더로 옮깁니다. 그리고 아까 이야기한 참고사이트에도 명시되어있는 다음 명령어를 실행합니다.

```bash,linenums
$ ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::Ghost.run({
      "dbfile"   => "/path/to/your/ghost.db"
    })'
```

그러면 다음과 같은 메시지를 만납니다. (위에 `/path/../ghost.db`는 자신의 `ghost.db`위치에 맞게 바꿔줘야 하는 것 잊지마세요!)

```
/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require': cannot load such file -- jekyll-import (LoadError)
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'
	from -e:1:in `<main>'
```

음. 루비를 못하지만 분명 다른 언어에서 경험을 바탕으로 에러메시지를 읽어보면 `jekyll-import`라는 녀석이 없는 것이라고 라고 판단을 했습니다. 자 역시 또 구글링을 통해 다음과 같은 패키지 사이트를 찾았습니다. ([github, jekyll-import](https://github.com/jekyll/jekyll-import)) 안에 설치법이 잘 나와있습니다.

```bash
$ gem install jekyll-import
```

시키는 대로 해봅시다. gem이 뭔지는 모르겠지만 node에서 npm, php에서 composer, 프론트앤드에서 bower을 익힌 저에게는 문제될것이 없습니다. 분명히 저건 루비에서 사용하는 패키지 관리도구일 것입니다. 근데 제가 여지껏 사용했던 패키지 관리자들은 `-g`옵션을 주지 않으면 현재 패키지 밑에 설치가 되었습니다. 일단은 걱정을 하며 설치를 했는데 현재 디렉터리 밑에 아무것도 생성되는게 없는 것으로 보아 gem은 기본 설치가 global로 잡히는 모양입니다. (이는 추측입니다!!!)

다시 아까 에러를 뱉었던 명령어를 입력하면 `_drafts`, `_posts`밑에 뭔가 후룩후룩 하면서 파일들이 짠 하고 생성됩니다.

![Migrate Complete]({{ site.url }}/images/dev/jekyll/migrate1-1.png)

## 마무리

자, 이제 여기서 끝이 아니고 몇가지 후처리를 더 해야합니다.

1. Git에서 파일명은 한글로 적으면 나중에 OS간에 충돌을 일으키기 때문에 파일명이 한글인 것은 적절히 바꿔주어야 합니다.
2. 이미지 파일은 가져올 수 없습니다(DB에는 파일 포함이 안되어있잖아요.). 이 부분은 번거롭더라도 손으로 따와야 합니다. (물론 이것도 자동 도구들이 찾아보면 어딘가에 있을수도 있습니다.)
3. 저는 markdown확장자를 md로 사용하기 때문에 확장자도 바꾸어 주었습니다.

이러면 이제 Jekyll을 본격적으로 즐길 수 있습니다.

## 참고자료

- <http://import.jekyllrb.com/docs/ghost>
- <https://github.com/jekyll/jekyll-import>
---
layout: post
title: "Ghost에서 Jekyll로 이사하기(2) - Code Highlighter 설치"
date: 2015-01-30 10:42:00 +09:00
tags: ["jekyll"]
---

이전 Ghost 블로그에서는 그냥 Google Prettify를 사용해서 쉽게 해결했었습니다. 그런데 Jekyll에서는, 그리고 Github에서 호스팅하는 환경에서는 이부분의 제약이 좀 있었습니다.

Jekyll에서 사용하는 마크다운 툴은 크게 두가지입니다. `redcarpet`과 `kramdown`이었습니다. 사실 코드를 블로그에 작성하지 않으면 크게 문제는 없습니다만.. 코드를 작성해야해서 Code Syntax Highlighter는 필수였습니다. Kramdown은 루비로 만들어진 마크다운인 것을 생색내는지 기존의 마크다운 이외에 특수한 문법들을 추가로 더 사용하고 있었습니다. 그러나 저는 기존 Markdown에서 소스코드를 다음과 같이 작성하고 있었습니다.

```
```javascript
(function($) {
    /* ...blabla... */
})(jQuery);
'''
```

그러나 `kramdown`의 경우는 조금 다른 방식을 사용하고 있었습니다. 그러던 중 `redcarpet`을 보았는데 이 마크다운 해석기가 제가 주로 사용하는 익숙한 방식을 채용하고 있었습니다. 또한 내부에는 `pygrments`라는 Syntax Highlighter를 내장하고 있었습니다. 그냥 사용하면 됩니다.

그러나.. 저는 기존 Prettify에서 linenums기능을 너무 좋아해서 기본값으로 사용하기는 뭔가 아쉬웠습니다. 그래서 떠올린 방법은 기본 pygments를 꺼버리고 자바스크립트 기반인 Prettify를 사용하자 였습니다. 로컬서버에서는 이방식이 잘 돌아갔으나..

![Warning](/images/dev/jekyll/migrate2-warning.png)

~~아..안돼..!!~~

그렇습니다. Github에서 제공하는 Jekyll에서는 pygments를 기본값으로 사용해야만 했었습니다. 다른 플러그인도 신나게 설치했었는데.. ([jekyll-less](https://github.com/zroger/jekyll-less)라던가..) Github안에 루비스크립트가 올라가는지라 서버에 위험이 갈 수 있기 때문에 기본 플러그인만을 지원하고 있었습니다. 참고로 Github에서 [지원하는 플러그인 내역](https://help.github.com/articles/using-jekyll-plugins-with-github-pages)입니다.

```javascript
$('pre > code').each(function() {
    var lines = this.innerHTML.split("\n");
    if (lines.length > 5) {
        var i;
        var ol = '<ol class="linenums">';
        for (i in lines) {
            ol += '<li>' + lines[i] + '</li>';
        }
        this.innerHTML = ol;
        $(this).addClass('linenums');
    }
});
```

Prettify에서 사용하는 HTML구조를 그대로 가져왔습니다. 그리고 소스라인 수가 5줄 이상 넘어가면 코드 번호를 붙여주는 식으로 만들어줬습니다. 끝이냐구요? 네 끝입니다.

[...]


## 하나 더

내부 링크의 경우 현재 창이 편리하지만 외부로 나가는 링크의 경우 새창으로 띄우는게 사용하기에 편하다고 판단이 되었습니다. (제가 그렇습니다.)

참고로 옛날 고스트에서는 이렇게 사용했었습니다. 근데 Jekyll에서는 동작하지 않았습니다.

```
[링크](http://myhome.com" target="_blank)
```

그리고 위 처럼 사용할 경우 매번 외부로 나가는 링크를 찾아다니며 해당 소스를 적어줘야 하는 번거로움이 있습니다. 옛날에는 코딩실력(자바스크립트...)도 안됐고 블로그 포스팅도 잦지 않아서 그렇게 불편함을 느끼지 않았었습니다.

이또한 다음 소스 한줄로 해결이 가능합니다. :)

```javascript
$('a[href^="http://"]').not('a[href*=wani\\.kr]').attr('target','_blank');
```

## 마무리

느끼는 거지만 Ruby를 할줄 몰라도 자바스크립트를 할줄 아니 대충 어떻게든 꾸역꾸역 Jekyll을 사용할 수 있는 것 같습니다. :)

이 불편한걸 감당해가며 왜 Jekyll을 쓰냐? 라고 물으면 이렇게 답할 수 있을 것 같습니다.

1. 블로그를 웹에서 작성하지 않아도 되서 실수로 뒤로 간다던가 하는 상황에서 살아남을 수 있다.
2. 컴퓨터용 내가 편한 마크다운 툴을 마음껏 사용할 수 있다.
3. 버전관리가 기반이기 때문에 모든 글을 언제 어디를 수정했는지 찾아 볼 수 있다.
4. 개발자스러운 멋이 있다. (?)

그리고.. 계속 써보면서 장점을 적어가보겠습니다. :)

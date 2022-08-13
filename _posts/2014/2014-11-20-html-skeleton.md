---
layout: post
title: HTML 파일 기본 구조
date: 2014-11-20 04:01:17 +09:00
tags: ["html"]
---

웹사이트에서 View를 작업할 때 매번 복사 붙여넣기하는 기본 양식이 있습니다. `<html></html>` 바로 이 녀석말입니다. 스켈레톤이라고 하면 맞는 표현일까요? :)

매 프로젝트마다 붙여넣기 할 때마다 매번 고민하는 문제입니다. 성능이 지장이 가지는 않는지, 옛날 브라우저에서 이상하게 동작을 하지는 않는지 말입니다. 과연 어떻게 작성하는게 최선일지 여태까지 제가 고민하고 수정한 내용을 정리해보려 합니다..

## Snippet

제가 작업하는 html snippet을 그대로 가져와봤습니다.

```html
<!DOCTYPE html>
<!--//
This web page has been developed by Wani.
 - hey@wan2.land
 - https://wan2.land
-->
<!--[if lt IE 7]><html class="ie6" lang="ko"><![endif]-->
<!--[if IE 7]><html class="ie7" lang="ko"><![endif]-->
<!--[if IE 8]><html class="ie8" lang="ko"><![endif]-->
<!--[if gt IE 8]><!--><html lang="ko"><!--<![endif]-->
<head>
<title>Your Title</title>
<meta charset="utf-8" />

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<!--[if lt IE 9]>
<script src="/static/vendor/html5shiv/dist/html5shiv.min.js"></script>
<![endif]-->

<link rel="stylesheet" href="/static/css/index.css" />

<!--[if lt IE 9]>
<script src="/static/vendor/respond/dest/respond.min.js"></script>
<![endif]-->

</head>
<body>

Your Body :)

<script src="/static/js/index.js"></script>
</body>
</html>
```

## 설명

항상 html 스켈레톤을 작성할 때 지키는 룰이 있습니다. 일단 여기는 외국이 아닙니다. 한국이기 때문에 옛날 브라우저를 어느정도 지원해주어야 합니다. 즉, "모든 애니메이션이 IE8 이하에서 동작하지 않더라도 화면 구성 자체는 제대로 보여야 한다." 바로 이것입니다. 그 다음 생각한 것은 IE8 이하는 그야말로 지원하는 수준이기 대문에 현재 모던한 브라우저에서 성능을 저하시키는 요인이 있어서는 안됩니다. 그래서 가급적 `Modernizr`의 사용은 지양합니다.

그리고 기본적으로 저는 프론트엔드 소스 관리를 `Bower`에 전담시키고 있습니다. 그래서 디렉토리 구조를 간단히 설명하면 다음과 같은 구성입니다.

- /static/js : 자바스크립트 파일이 모여있습니다.
- /static/css : 스타일시트 파일이 모여있습니다. (Less로 작업을 합니다.)
- /static/images : 이미지 파일들
- /static/vendor : Bower Package 디렉토리

이제 전체적인 설명은 끝났고 하나하나 부분별로 살펴보겠습니다.

### Doctype

```html
<!DOCTYPE html>
```

우선 첫번째 줄. 바로 HTML문서라는 것을 선언하는 부분입니다. 옛날 HTML 서적에 보면 `<html>` 부터 시작하는 서적들이 있으나, 제일 처음에 브라우저에게 어떤 버전의 HTML을 사용하는지 알려주어야 합니다. 과거에는 `xhtml4.01`를 사용하던 시절에는 Doctype이 달랐으나(dtd를 포함해야하는 경우도 있었습니다.) 앞으로는 HTML에서 버전이라는 개념이 사라지기 때문에 저렇게만 사용해도 됩니다.

또한, 대소문자를 구분하지 않는 구분이지만 DOCTYPE은 대문자, html은 소문자로 사용하는 이유는 HTML([참고](https://html.spec.whatwg.org/multipage/syntax.html#the-doctype))권고안입니다. 굳이 지키지 않으셔도 됩니다.

### 상단 주석

```html
<!--//
This web page has been developed by Wani.
 - hey@wan2.land
 - https://wan2.land
-->
```

저는 일반적으로 위와 같이 사용합니다. 혼자 작업할 때는 저렇게 작성하는 편이고, 회사에서 진행하는 프로젝트는 회사에서 제공하는 주석을 넣습니다. 주석은 가능한 최상단에 노출되어야 한다고 생각했었습니다. 그래서 넣게되는 위치가 `DOCTYPE` 직후입니다. 만약에 `DOCTYPE`이전에 주석을 작성하게 되면 일부 브라우저에서는 문서 타입을 알지 못해 CSS처리를 제대로 하지 못합니다.

### HTML Tag

```html
<!--[if lt IE 7]><html class="ie6" lang="ko"><![endif]-->
<!--[if IE 7]><html class="ie7" lang="ko"><![endif]-->
<!--[if IE 8]><html class="ie8" lang="ko"><![endif]-->
<!--[if gt IE 8]><!--><html lang="ko"><!--<![endif]-->
```

IE를 쉽게 인식하기 위해서 이렇게 집어넣는 편입니다. 위와 같이 작성하면 CSS나 Javascript에서 쉽게 예외코드를 작성할 수 있습니다.

```css
div.links > div.dummy {
	background-image:url(dummy.png);
	background-repeat:no-repeat;
	bakkground-size:50% 50%;
}
html.ie8 div.links > div.dummy {
	background-image:url(dummy.ie.png); /* background-size가 IE8 이하에서 동작하지 않습니다.*/
}
```

CSS의 경우 위와 같이 작성할 수 있습니다.

```css
div.links > div.dummy {
	background-image:url(dummy.png);
	background-repeat:no-repeat;
	bakkground-size:50% 50%;

	html.ie8 & {
		background-image:url(dummy.ie.png); /* background-size가 IE8 이하에서 동작하지 않습니다.*/
	}
}
```

LESS를 사용하면 소스를 더 간결하게 작성할 수 있습니다. 과거에는 `index.ie.css`파일을 하나 더 만들어서 `<!--[if IE 8]><link rel="stylesheet" href="/static/css/index.ie.css" /><![endif]-->`를 `index.css`바로 아래에 추가했었습니다. 그러나 이는 소스관리를 더 불편하게 할뿐 아니라 가뜩이나 느린 IE로 하여금 추가 Request를 요청하므로서 더 느려지게 만들었습니다. 어차피 요즘에는 css를 압축해서 사용하는게 기본이기 때문에 이렇게 사용하는게 낫다고 생각합니다.

```javascript
;(function($){
	if ( $('html').attr('class').indexOf("ie") === 0 ) {
		$('body').append('<div>This Browser is IE!</div>');
	}
})(jQuery);

```

간단하게 자바스크립트에서는 이런식으로 사용이 가능합니다.

### Character Set

```html
<meta charset="utf-8" />
```

캐릭터셋 메타는 HTML5방식을 사용합니다. DOCTYPE이 HTML표준 방식을 따라가기 때문이죠. 옛날에는 `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />` 이렇게 사용했습니다. 지금은 지양해야할 코딩입니다. 그리고 문자타입은 무조건 **utf-8**을 사용합시다!

### Internet Explorer Meta

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```

국내에서는 아직도 ActiveX를 많이 사용하고 있습니다. 이게 문제가 뭐냐하면 가끔 IE9 이상을 사용하는데 ActiveX를 까는 과정에서 브라우저 표시 방식을 낮춰서 동작하는 경우가 있었습니다. 그래서 IE9만 되어도 제대로 돌아가야할 스타일들이 깨져버리는 문제가 발생하기도 했었습니다. 위 메타 태그가 100% 동작하지는 않지만 일부 환경에서 IE 브라우저 모드를 최신으로 유지하도록 해줍니다.

### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

위 내용은 뷰포트입니다. 구글링만 해보셔도 많은 정보를 얻을 수 있을 것입니다. 간단히 이야기 하자면 모바일에게 해당 사이트 크기를 어떻게 잡아야 하는지 알려주는 메타태그입니다. 저는 주로 반응형웹을 만들기 때문에 반응형웹 전용 뷰포트를 기본으로 사용하고 있습니다.

- 참고 : [하루하루, View포트 이해하기](http://chaospace.tistory.com/152)

### html5shiv

```html
<!--[if lt IE 9]>
<script src="/static/vendor/html5shiv/dist/html5shiv.min.js"></script>
<![endif]-->
```

IE8이하에서는 `<header></header>`, `<footer></footer>` 등의 HTML5전용 태그를 인식하지 못합니다. 그래서 해당 브라우저에서 HTML5 전용 태그를 사용할 수 있도록 조치를 취해주어야 합니다. 그 Html5태그를 위한 Polyfill이 html5shiv입니다. 저는 `bower`를 통해 설치해서 경로가 저렇고 여러분들은 cdn을 사용하시면 쉽게 사용하실 수 있습니다.

```html
<!--[if lt IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
<![endif]-->
```

또한 위 소스는 반드시 최초의 css파일을 로딩하기 직전에 집어넣어야 합니다. 그래야 제대로 동작합니다. :)

#### Css Files

```html
<link rel="stylesheet" href="/static/css/index.css" />
```

그냥 집어넣으면 됩니다. 중요한건 `html5shiv`다음에 해당 내용을 넣어주셔야 합니다. 일단 스타일 시트는 모두 `<head></head>` 사이에 넣는게 좋습니다. 그 이유로는 FOUC문제를 꼽을 수 있습니다.

- [Wikipedia, FOUC](http://ko.wikipedia.org/wiki/FOUC)

간단히 body영역의 태그가 로딩하기 직전에 스타일시트를 불러오는 것이 더 깔끔하게 화면을 뿌려줍니다. 또한 본문 내에 스타일 소스를 마구잡이로 넣어서 소스를 더럽게 유지하는 것을 지양합시다.

### Respond.js

```html
<!--[if lt IE 9]>
<script src="/static/vendor/respond/dest/respond.min.js"></script>
<![endif]-->
```

IE8이하에서 Mediaquery가 동작하지 않습니다. 그런 동작을 잡게해주는 Polyfill입니다. 이는 반드시 모든 CSS파일을 다 불러오고 그 하단에 집어넣어야합니다. 그래야 이미 로딩된 CSS파일을 읽어들여서 화면에 맞게 다시한번 자바스크립트가 처리를 해줍니다.

마찬가지로 CDN을 사용하시면 더 편하게 사용할 수 있습니다.

```html
<!--[if lt IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
```


### Javascript Files

```html
<script src="/static/js/index.js"></script>
```

저는 모든 자바스크립트 파일을 `<body></body>` 최하단에 넣습니다. 이는 **자바스크립트 성능최적화([참고](http://www.hanbit.co.kr/book/look.html?isbn=978-89-7914-855-8))**라는 책에서 1장에서 나오는 내용입니다. 간단히 얘기해서 헤더에 자바스크립트 파일을 포함하게 되면 체감속도가 심각하게 떨어진다는 것입니다. 또 이렇게 사용하면서 얻게되는 이점은 자연스럽게 본문에서 인라인 스크립트(`<a onClick=...>링크</a>`)를 쓸 수 없게 됩니다. 이는 EventListener로 반드시 대체되어야 합니다. 

## 정리

아직도 코딩보다는 돌아가기만 하면 된다는 안일한 생각하는 분들이 많습니다. 그래서인지 대학교나 학원가에서는 아직도 옛날 방식의 코딩방식을 가르치고 있습니다. (table layout은 정말로..) 그렇다고 국내 유저 환경이 있기 때문에(IE8 부들부들..) 전부다 외국처럼 갈 수는 없습니다. 그런 상황에서 앞으로 더 나은방향으로 갈 수 있는 어느정도 타협안(과거 웹과 앞으로의 웹)이 있을 것이라 생각하고 오늘의 포스팅을 하게 되었습니다.

오늘 제가 작성한 글이 반드시 정답은 아니며 앞으로의 환경에 따라 본 글의 내용도 계속 바뀌어야 하는 점을 인식하셔야 합니다. 더 나은 방향이나 제가 잘못알고 있는 부분이 있으면 언제든지 지적해주셨으면 합니다. :)

## 참고자료

- <https://html.spec.whatwg.org/multipage/syntax.html>
- <http://cdnjs.com/libraries/html5shiv>
- <http://ko.wikipedia.org/wiki/FOUC>
- <http://chaospace.tistory.com/152>
- <http://cdnjs.com/libraries/respond.js>
- [자바스크립트 성능최적화, 니콜라스 자카스 저](http://www.hanbit.co.kr/book/look.html?isbn=978-89-7914-855-8)

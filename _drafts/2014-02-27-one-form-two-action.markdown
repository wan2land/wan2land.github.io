---
layout: post
title: 한개의 폼 두개의 액션.
date: 2014-02-27 11:22:54.000000000 +09:00
---
웹을 작업하다보면 하나의 폼을 두고, 여러개의 버튼을 넣어두고, 각각의 버튼에 대해 다른 방식으로 처리하는 경우가 많습니다.

```prettyprint lang-html linenums
<form action="modify.php">
	<input type="checkbox" name="idx[]" value="1" />
	<input type="checkbox" name="idx[]" value="2" />
	<input type="checkbox" name="idx[]" value="3" />
	<input type="checkbox" name="idx[]" value="4" />
	<input type="checkbox" name="idx[]" value="5" />
    <button type="submit">수정</button>
    <button type="submit">삭제</button>
</form>
```

위와 같은 상황인데, 일단은 전부다 `modify.php`로 전송이 됩니다. 그리고 그 파일 하나에서 어떤 버튼을 눌러서 넘어왔는지 알 수도 없습니다. 다른 처리가 불가능한 상황입니다.

그렇다면, 수정을 눌렀을 때는 `form`의 내용이 `modify.php`로, 삭제를 눌렀을 때는 `delete.php`로 전송되도록 하려면 어떻게 해야할까요.

그래서 보통은 저 버튼 두개를 각각에 대해서 자바스크립트로 처리합니다. 바로 이렇게요.

~~흔한 스택오버플로우 답변.~~

```prettyprint lang-html linenums
<script>
function fun_atualizar() {
    document.orcamento.action = "atualizar_orcamento.php";
    document.orcamento.submit();
    return true;
}

function fun_evento() {
    document.orcamento.action = "Evento_orc.php";
    document.orcamento.submit();
    return true;
}
</script>

<input  type="button" value="Atualizar" style="padding-left:20px" width="100" tabindex="23" onclick="javascript:fun_atualizar();" />

<input  type="button" value="Evento" style="padding-left:20px" width="100" tabindex="23" onclick="javascript:fun_evento();" />
```

구글에서 **one form two actions**라고 검색해서 찾은 결과입니다. 첫번째로 나온 결과입니다.

저 같은 코드성애자는 이런 방식이 뭔가 못마땅 하였습니다.

우선, HTML영역과 자바스크립트영역을 철저하게 구분하여야 하는데 `onClick`을 사용하는 것이 못마땅했고, 단순한 폼액션임에도 불구하고 자바스크립트가 개입하는 것이 맘에 들지 않았습니다.

그때 해결책으로 등장한것이 바로 `formaction` 속성입니다. (오오오)

## HTML5, formaction

### 사용법

HTML5에서는 한개의 폼으로 각각의 버튼에 대해 다르게 전송하는 표준을 정의해 놓았습니다. 그 예시는 아주 단순합니다.

```prettyprint lang-html linenums
<form action="go1.php" method="POST">
	First name: <input type="text" name="fname"><br>
	Last name: <input type="text" name="lname"><br>
	<button type="submit">submit1</button>
	<button type="submit" formaction="go2.php">submit2</button>
</form>
```

두개의 `submit` 앨리먼트에 하나는 평상시처럼 작성하고, 나머지 하나의 어트리뷰트에 `formaction`이라는 내용을 작성하는 것이지요.

![example](/content/images/2014/Feb/img-1.png)

그러면 다음과 같이 화면이 적용되어서 나오고 submit1을 눌렀을 때는 `go1.php`로 이동하고, submit2를 눌렀을 때는 `go2.php`로 이동하는 모습을 볼 수 있습니다.

사용법이 너무 쉬워서 좋습니다.. :)

브라우저 지원은 다음과 같습니다.

![Browser Support](/content/images/2014/Feb/support.png)

안드로이드는 2.3 이전까지는 안된다고 하는데, 제 핸드폰이 아이폰인지라 요즘 나온 안드로이드는 작동할지 아닐지는 잘 모르겠습니다. (무책임)

## 크로스브라우징

대망의 **익스플로러**(~~익스를 죽입시다.. 익스는 나의 원수~~)는 10부터 지원을 하는데요, 국내 웹 환경이 아시다시피 8이 아직도 대다수라서 그 대안도 제시해주어야 합니다.

"그냥 Modernizr를 사용하셔서 소스를 작성하세요."

포스팅을 작성하기로 마음먹은 이상 이렇게 무책임하게 말할 순 없겠죠. 간단하게 jQuery소스를 작성해보았습니다.

```prettyprint lang-javascript linenums
;(function($) {
	$( 'form [formaction]' ).click(function() {
		$(this).parents('form').attr('action', $(this).attr('formaction')).submit();
		return false;
	});
})(jQuery);
```

저는 모든 자바 스크립트 소스를 `body`끝에 넣는 습관을 들여서 `$(window).load(function() {});`가 생략된 소스입니다. :)

jQuery를 사용할 수 없는 환경이라면, 이렇게 다음 소스를 사용하시면 됩니다.

```prettyprint lang-javascript linenums
;(function(){
	var
	bind = function( target, type, func ) {
		// 어차피 ie9 이하에서만 작동할거라서 나머지 Event 삭제
		target.attachEvent( 'on' + type, func );
	},
	each = function( elems, block ) {
		for( var i = 0, len = elems.length; i < len; i++) {
			block( elems[i] );
		}
	};
	bind( window, 'load', function(){
		var targets = [];
		each( document.getElementsByTagName('form'), function( form ) {
			each( form.getElementsByTagName('input'), function( input ) {
				if ( input.getAttribute('formaction') !== null ) {
					targets.push( [form, input] );
				}
			});
			each( form.getElementsByTagName('button'), function( input ) {
				if ( input.getAttribute('formaction') !== null ) {
					targets.push( [form, input] );
				}
			});			
		});
		each( targets, function( target ) {
			bind( target[1], 'click', function() {
				target[0].action = target[1].getAttribute('formaction');
				target[0].submit();
				return false;
			});
		});		
	});
})();
```

아아.. jQuery에서 4줄짜리 소스가 이렇게 길어질 수 있군요.

간단하게 사용하시고자 한다면, 위 내용을 파일로 저장 후 이렇게 사용하면 되겠네요. ~~오직 익스플로러만을 위해서요.~~

```prettyprint lang-html linenums
<!--[if lt IE 10]>
<script src="/static/html5-formaction-ie.min.js"></script>
<![endif]-->
```

최소화 시켜서 압축한 소스는 다음에서 가져다가 사용하시기 바랍니다.

- http://cdn.wani.kr/html5/html5-formaction-ie.min.js
- https://github.com/wan2land/html5-formaction-ie

제 CDN에 예제용으로 올려놓았는데, 딱히 외부 접속을 막진 않았습니다...만, 가급적이면 복사해서 자기 서버에서 돌려주세요.. OTL

그리고 제가 작성한 최종코드는 다음과 같습니다.

```prettyprint lang-html linenums
<!DOCTYPE HTML>
<html lang="ko">
<head>

<title>Example</title>
<meta charset="utf-8" />

<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<!--[if lt IE 10]>
<script src="http://cdn.wani.kr/html5/html5-formaction-ie.min.js"></script>
<![endif]-->

</head>
<body>


<form action="go1.php" method="POST">
	First name: <input type="text" name="fname"><br>
	Last name: <input type="text" name="lname"><br>
	<button type="submit">submit1</button>
	<button type="submit" formaction="go2.php">submit2</button>
</form>

</body>
</html>
```

그리고 익스플로러8에서 테스트한 화면. (9에서는 안했습니다.)

![](/content/images/2014/Feb/_____2014_02_27____12_13_23.png)
![](/content/images/2014/Feb/_____2014_02_27____12_12_29.png)


아주 잘 돌아갑니다. :)

## 그 외..

이 이외에도, HTML5에서는 다음과 같은 추가 속성을 지원하고 있습니다.

- formaction 속성
- formenctype 속성
- formmethod 속성
- formnovalidate 속성
- formtarget 속성

이는 [HTML5 Open Reference](http://html5ref.clearboth.org/html5:attribute:formaction" target="_blank)에서 확인가능합니다. 나머지에 대응하는 javascript파일은 만들지 않았으니 한번 공부하시는겸 구현해보는 것도 괜찮은 방법인 것 같습니다. :)

## 참고자료

- [HTML5 Forms: FormAction Type Attribute Demo by Wufoo](http://www.wufoo.com/html5/attributes/13-formaction.html" target="_blank)
- [HTML5 Form Attributes by w3schools]( http://www.w3schools.com/html/html5_form_attributes.asp" target="_blank)

---
layout: post
title: SVG Path Animation
date: 2013-12-04 22:46:22 +09:00
tags: ['svg']
---

![Thumbnail](/images/dev/frontend/svg-path-animation.gif)

예전 웹에서는 대부분의 이미지를 jpg, png를 사용했었습니다. 그리고 그 이미지 포맷들은 다 [비트맵](http://ko.wikipedia.org/wiki/%EB%B9%84%ED%8A%B8%EB%A7%B5)이었습니다. 당시에는 모니터 해상도도 차이가 많이 없어서 웹에서 비트맵 이미지가 불편하지 않았습니다.

그리고 아마도 "레티나 디스플레이"가 등장하면서 조금 세상이 변하기 시작한 것 같습니다. 레티나 디스플레이는 기존 화면에서 같은 사이즈 안에 약 4배에 달하는 해상도로 더 선명한 화면을 제공했고, 그래서 웹에서 비트맵 이미지는 깨져 보이게 되었습니다. 스마트폰에서는 화면이 작아서 사용자들이 확대해서 사용하기도 하는데 이때 비트맵 이미지는 마찬가지로 깨졌습니다... (지못미..)

그러한 점을 보완하기 위해서 웹에서 [벡터](http://ko.wikipedia.org/wiki/%EB%B2%A1%ED%84%B0_%EA%B7%B8%EB%9E%98%ED%94%BD%EC%8A%A4)를 사용하는 다양한 방법들이 제시가 되었는데, 그 중 하나는 [Font Awesome](http://fontawesome.io)이었습니다. 이는 폰트 자체를 원하는 아이콘으로 가공해서(이를태면 딩벳폰트) 아이콘을 확대해도 깨지지 않게 하는 기술이었습니다. (이부분은 **나중에** 다시 자세히 다뤄보겠습니다.)

그리고 다른 방법이 바로 [SVG](http://ko.wikipedia.org/wiki/SVG)를 사용하는 것입니다. SVG는 XML과 비슷한 방식으로 작성이 되서 Javascript를 통해서 쉽게 제어할 수 있는 점이 장점으로 꼽힙니다. 그래서인지 요즘 웹에서 보면 SVG를 굉장히 많이 사용하는 것을 볼 수 있습니다.

아.. 서론이 길었습니다..... 이걸로 역사 하나 써도 되겠네요.


그래서!  
오늘의 목표는 아래 사이트에서 처럼 애니메이션을 만드는 작업을 하겠습니다.

> 참고사이트 : [www.polygon.com/a/ps4-review](http://www.polygon.com/a/ps4-review)

우선 Adobe Illustrator를 준비합니다.

그리고 우리 회사 로고를 다음과 같이 작업하였습니다.

![일러스트레이터](/images/dev/frontend/svg-path-animation-logo.png)

그리고 이 이미지를 SVG로 저장합니다. 그러면 다음과 같은 소스를 볼 수 있습니다.

```xml
<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 16.0.4, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="&#xB808;&#xC774;&#xC5B4;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 x="0px" y="0px" width="519.179px" height="90.667px" viewBox="0 0 519.179 90.667"
	 style="enable-background:new 0 0 519.179 90.667;" xml:space="preserve">
<rect x="-74.717" y="162.627" width="482.827" height="211.111"/>
<g>
	<g>
		<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M80.292,79.506l-2.584,2.4L44.659,48.858
			L11.61,81.906l-2.585-2.4l33.233-33.233L9.025,13.04l2.4-2.4l33.233,33.233L77.892,10.64l2.4,2.4L47.059,46.273L80.292,79.506z"/>
	</g>
	<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M129.181,79.742c-2.313,0-3.47-1.156-3.47-3.47
		V13.842c0-2.312,1.156-3.468,3.47-3.468c2.312,0,3.468,1.156,3.468,3.468v62.431C132.649,78.586,131.494,79.742,129.181,79.742z"/>
	<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M193.952,72.806h17.34V45.059h-6.935
		c-2.314,0-3.469-1.156-3.469-3.47c0-2.312,1.154-3.469,3.469-3.469h10.405c2.312,0,3.468,1.156,3.468,3.469v34.684
		c0,2.313-1.156,3.47-3.468,3.47h-20.811c-4.801,0-8.89-1.69-12.27-5.072c-3.382-3.38-5.072-7.471-5.072-12.27V27.717
		c0-4.801,1.69-8.89,5.072-12.271c3.38-3.382,7.469-5.072,12.27-5.072h20.811c2.312,0,3.468,1.156,3.468,3.468
		c0,2.314-1.156,3.47-3.468,3.47h-20.811c-2.909,0-5.369,1.016-7.384,3.047c-2.015,2.032-3.022,4.484-3.022,7.357V62.4
		c0,2.908,1.008,5.368,3.022,7.382C188.583,71.797,191.043,72.806,193.952,72.806z"/>
	<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M298.887,62.873V13.842
		c0-2.312,1.156-3.468,3.468-3.468c2.314,0,3.47,1.156,3.47,3.468v62.431c0,2.313-1.155,3.47-3.47,3.47
		c-1.401,0-2.417-0.578-3.048-1.734L271.14,27.191v49.082c0,2.313-1.154,3.47-3.467,3.47c-2.313,0-3.47-1.156-3.47-3.47V13.842
		c0-2.312,1.156-3.468,3.47-3.468c1.365,0,2.432,0.684,3.204,2.049L298.887,62.873z"/>
	<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M354.867,79.742
		c-2.312,0-3.471-1.156-3.471-3.47V13.842c0-2.312,1.158-3.468,3.471-3.468c2.312,0,3.468,1.156,3.468,3.468v62.431
		C358.335,78.586,357.179,79.742,354.867,79.742z"/>
	<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M400.926,76.272V13.842
		c0-2.312,1.156-3.468,3.468-3.468h27.747c2.312,0,3.469,1.156,3.469,3.468c0,2.314-1.156,3.47-3.469,3.47h-24.278V38.12h24.278
		c2.312,0,3.469,1.156,3.469,3.469c0,2.313-1.156,3.47-3.469,3.47h-24.278v31.214c0,2.313-1.156,3.47-3.469,3.47
		C402.082,79.742,400.926,78.586,400.926,76.272z"/>
	<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M489.975,45.059v31.214
		c0,2.313-1.155,3.47-3.468,3.47s-3.469-1.156-3.469-3.47V45.059l-20.18-29.218c-0.419-0.597-0.63-1.263-0.63-1.999
		c0-2.312,1.156-3.468,3.468-3.468c1.261,0,2.225,0.491,2.891,1.473l17.92,26.064l17.92-26.064c0.666-0.981,1.628-1.473,2.89-1.473
		c2.312,0,3.469,1.156,3.469,3.468c0,0.736-0.211,1.402-0.63,1.999L489.975,45.059z"/>
</g>
</svg>
```

저는 여기서 웹에서 쉽게 작업하기 위해서 주석부분을 제거하고, 통일된 형태로 바꾸었습니다. 그리고 HTML문서에 다음과 같이 삽입하였습니다.


```html
<!DOCTYPE HTML>
<!--//
This web page has been developed by Wani.
 - me@wani.kr
 - http://wani.kr
-->
<html lang="ko">
<head>

<title>SVGPath Animation</title>
<meta charset="utf-8" />

<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

<link rel="stylesheet" href="/static/normalize.min.css" />

</head>
<body>
<div class="pics">
	<svg id="XignifyLogo" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		 x="0px" y="0px" width="520px" height="90px" viewBox="0 0 520 90" xml:space="preserve">
		<g>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M80.292,79.506l-2.584,2.4L44.659,48.858
				L11.61,81.906l-2.585-2.4l33.233-33.233L9.025,13.04l2.4-2.4l33.233,33.233L77.892,10.64l2.4,2.4L47.059,46.273L80.292,79.506z"/>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M129.181,79.742c-2.313,0-3.47-1.156-3.47-3.47
				V13.842c0-2.312,1.156-3.468,3.47-3.468c2.312,0,3.468,1.156,3.468,3.468v62.431C132.649,78.586,131.494,79.742,129.181,79.742z"/>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M193.952,72.806h17.34V45.059h-6.935
				c-2.314,0-3.469-1.156-3.469-3.47c0-2.312,1.154-3.469,3.469-3.469h10.405c2.312,0,3.468,1.156,3.468,3.469v34.684
				c0,2.313-1.156,3.47-3.468,3.47h-20.811c-4.801,0-8.89-1.69-12.27-5.072c-3.382-3.38-5.072-7.471-5.072-12.27V27.717
				c0-4.801,1.69-8.89,5.072-12.271c3.38-3.382,7.469-5.072,12.27-5.072h20.811c2.312,0,3.468,1.156,3.468,3.468
				c0,2.314-1.156,3.47-3.468,3.47h-20.811c-2.909,0-5.369,1.016-7.384,3.047c-2.015,2.032-3.022,4.484-3.022,7.357V62.4
				c0,2.908,1.008,5.368,3.022,7.382C188.583,71.797,191.043,72.806,193.952,72.806z"/>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M298.887,62.873V13.842
				c0-2.312,1.156-3.468,3.468-3.468c2.314,0,3.47,1.156,3.47,3.468v62.431c0,2.313-1.155,3.47-3.47,3.47
				c-1.401,0-2.417-0.578-3.048-1.734L271.14,27.191v49.082c0,2.313-1.154,3.47-3.467,3.47c-2.313,0-3.47-1.156-3.47-3.47V13.842
				c0-2.312,1.156-3.468,3.47-3.468c1.365,0,2.432,0.684,3.204,2.049L298.887,62.873z"/>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M354.867,79.742
				c-2.312,0-3.471-1.156-3.471-3.47V13.842c0-2.312,1.158-3.468,3.471-3.468c2.312,0,3.468,1.156,3.468,3.468v62.431
				C358.335,78.586,357.179,79.742,354.867,79.742z"/>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M400.926,76.272V13.842
				c0-2.312,1.156-3.468,3.468-3.468h27.747c2.312,0,3.469,1.156,3.469,3.468c0,2.314-1.156,3.47-3.469,3.47h-24.278V38.12h24.278
				c2.312,0,3.469,1.156,3.469,3.469c0,2.313-1.156,3.47-3.469,3.47h-24.278v31.214c0,2.313-1.156,3.47-3.469,3.47
				C402.082,79.742,400.926,78.586,400.926,76.272z"/>
			<path style="fill:none;stroke:#000000;stroke-width:0.5;stroke-miterlimit:10;" d="M489.975,45.059v31.214
				c0,2.313-1.155,3.47-3.468,3.47s-3.469-1.156-3.469-3.47V45.059l-20.18-29.218c-0.419-0.597-0.63-1.263-0.63-1.999
				c0-2.312,1.156-3.468,3.468-3.468c1.261,0,2.225,0.491,2.891,1.473l17.92,26.064l17.92-26.064c0.666-0.981,1.628-1.473,2.89-1.473
				c2.312,0,3.469,1.156,3.469,3.468c0,0.736-0.211,1.402-0.63,1.999L489.975,45.059z"/>
		</g>
	</svg>
</div>

</body>
</html>
```

이제 원리를 간단히 설명하자면 SVG안에서 Path Element는 몇가지 속성이 있습니다. 그중 필요한 것이 `stroke-dasharray`, `stroke-dashoffset`입니다.

`stroke-dasharray`는 `path`를 점선으로 만들어주는 녀석입니다.
[자세한건 여기서 설명합니다.](http://www.carto.net/svg/samples/stroking.shtml#dashArray)

다음 `stroke-dashoffset`은 위의 `stroke-dasharray`의 시작간격을 주게 됩니다. [자세한건 역시 여기서 설명합니다.](http://www.carto.net/svg/samples/stroking.shtml#dashOffset)

그럼 이제 이 두개를 조합하면 다음과 같이 생각할 수 있습니다.

1. 각 path의 길이(length)를 구한다.
2. stroke-dasharray를 path의 길이(length)로 잡는다.
3. stroke-offset을 path의 길이로 잡는다. (여기까지 하면 기존의 path가 투명하게 안보일 것입니다.)
4. 애니메이션으로 stroke-offset을 0으로 가깝게 이동시킵니다.

그러면 다음과 같이 Javascript를 작성할 수 있습니다. 높은 이해를 돕고자 jQuery를 사용하였습니다.

```javascript
(function($){
    var pathes = $('#XignifyLogo').find('path');
    pathes.each(function( i, path ) {
        // 1번 부분
        var total_length = path.getTotalLength();

        // 2번 부분
        path.style.strokeDasharray = total_length + " " + total_length;

        // 3번 부분
        path.style.strokeDashoffset = total_length;

        // 4번 부분
        $(path).animate({
            "strokeDashoffset" : 0
        }, 1500);
    });
})(jQuery);
```


그래서 여기서 완성된 페이지를 확인 가능합니다.

![preview](/images/dev/frontend/svg-path-animation-complete.gif)

- 샘플링크 : <http://jsfiddle.net/wan2land/12mboLwn>


## 참고자료

- [http://product.voxmedia.com/post/68085482982/polygon-feature-design-svg-animations-for-fun-and](http://product.voxmedia.com/post/68085482982/polygon-feature-design-svg-animations-for-fun-and)

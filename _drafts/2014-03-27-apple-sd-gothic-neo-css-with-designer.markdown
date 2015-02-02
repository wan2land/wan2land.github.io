---
layout: post
title: Apple SD Gothic Neo, CSS 설정.
date: 2014-03-27 17:17:19.000000000 +09:00
categories: Dev Frontend
---
웹으로 열심히 먹고 살던 중, 요즘 맡게 된 일이 어플리케이션 개발이었습니다. iPad기반의 어플인데 나중에 안드로이드 환경에서도 사용될 수 있다고 하여 웹앱(저의 경우는 Cordova)으로 제작하고 있습니다.

항상 어딜가나 디자이너와 개발자 사이에는 갈등이 있기 마련이죠. 초반에 디자인 직전에 이야기 했을 때, 영문 폰트는 적을 수록 좋고, 한글 폰트는 무조건 1가지로 이야기를 했습니다. 또 한글 폰트는 기본 폰트이면 좋다고 했고, 결국 **Apple 산돌고딕Neo**로 합의하게 되었습니다.

##개발자에게 폰트의 종류란..

```prettyprint lang-css
span.weight300 {font-weight:300;}
span.weight500 {font-weight:500;}
span.weight700 {font-weight:700;}
```

대부분의 개발자에게 폰트는 숫자입니다. 아니면 아예 폰트 이름을 통째로 지정할 때도 있습니다.

```prettyprint lang-css
span.weight300 {font-family:'Anonymous Font Thin';}
span.weight500 {font-family:'Anonymous Font Medium';}
span.weight700 {font-family:'Anonymous Font Bold';}
```

두번째 방법은 사실 의사소통 하는데 크게 문제가 없는데, 첫번째의 경우가 문제가 많습니다.

특히, 외부 폰트 파일을 직접 넣어서 사용하는 거라면 두번째 방법을 쓰면 문제가 없습니다. 근데 바로 오늘 이 포스팅을 작성하는 이유가 여기있습니다. 이 **Apple 산돌고딕Neo**라는 녀석은 내장폰트이면서 9가지의 굵기를 갖고 있기 때문입니다.


##디자이너에게 폰트의 종류란..

![포토샵에서..](/content/images/2014/Mar/_____2014_03_27____5_19_44.png)
~~으아아 한글판이라니..~~

이미지를 보면 알 수 있듯이, 디자이너에게 폰트의 종류는 다 이름이 있습니다.

디자이너님들은 이렇게 이야기 해주실 겁니다. "여기 폰트는 산돌고딕 Neo 일반체(영문판의 경우 Regular)로 해주세요."

개발자는 이야기합니다. "굵기로 얘기해주세요."

디자이너는 말합니다. "Regular라니까요!"

개발자는 다시, "숫자요 숫자!"

##정리

우리 서로의 언어가 다르다는 것을 알고 싸우지마요.
**Apple 산돌고딕Neo**를 웹(또는 웹앱)에서는 이렇게 사용하시면 됩니다.

```prettyprint lang-css
span {
	font-family:"Apple SD Gothic Neo",sans-serif;
}
```

그리고 대망의 소통의 장애가 되었던 폰트 종류입니다.

![폰트 종류 정리](/content/images/2014/Mar/_____2014_03_27____5_30_31.png)

디자이너님이 "산돌고딕Neo SemiBold로 해주세요." 하면 우리 개발자님들은 자연스럽게 `{font-weight:600;}`로 치환해서 듣도록해요.

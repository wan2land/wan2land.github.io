---
layout: post
title: "Wandu Template"
date: 2015-05-31 15:03:15
categories: 
---

PHP라는 언어 자체가 원래 시작이 템플릿 언어에서 시작해서 그런지 오래된 소스코드를 보면 템플릿을 별도로 사용한다기 보다는 그냥 HTML 중간중간에 삽입해서 사용하고 있습니다.
[PHP:The Right Way](http://modernpug.github.io/php-the-right-way/#templating)에서도 템플릿 관련 내용을 다루고 있는 것으로 봐서는 아무래도 오래된 PHP에서는 템플릿을 별로 사용하지 않아서 저런 내용이 추가된 것 같습니다. [Packagist](http://packagist.org)에서도 수많은 템플릿 엔진들이 추가가 되어있습니다.

[PHP:The Right Way](http://modernpug.github.io/php-the-right-way/#templating)에서 이야기 하기를, 템플릿 엔진은 두가지 방식이 있다고 합니다. Native방식, 컴파일 해서 사용하는 방식. 그중에 제가 매력을 느낀 부분은 바로 Native방식입니다. 간단히 얘기해서 컴파일 해서 사용하는 방식은 더 깔끔하다고는 하지만 컴파일 하는 비용이 존재하고(물론 캐쉬를 지원하긴 합니다만..), 새로운 문법을 익혀야 하는 비용이 있다고 생각했기 때문입니다. 그래서 [Plates](http://platesphp.com)를 사용하기 시작했습니다.

그런데 문제가 생겼습니다. 템플릿 문법을 `$this`를 기반으로 하고 있기 때문에, IDE에서 자동완성을 하나도 사용할 수 없었습니다.

![](/images/Shot2015-05-31-3.11.59.png)

..IDE 친화적이지 않아..

그래서 하나 만들기로 결심을 하게되었습니다.

필요한 기능을 정리해보았습니다.

1. IDE에서 자동완성 될 것!
2. Plates에서 제공되는건 가급적 지원할 것.

딱 이정도가 전부였습니다.

![](/images/Shot2015-05-31-3.15.56.png)

그래서 이렇게 만들어졌습니다. :D

자세한 문서는 실제 패키지 페이지에서 제공하고 있습니다.

[github.com/wandu/template](https://github.com/wandu/template)


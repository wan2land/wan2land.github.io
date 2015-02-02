---
layout: post
title: 웹 차트 라이브러리 정리.
date: 2014-05-04 15:35:33.000000000 +09:00
---
회사 프로젝트에서 사용하기 위해서 몇가지 Javascript Chart Library들을 찾아보았습니다. Google에서 찾아도 수십개나 되는 라이브러리들이 쏟아져 나오는데, 이 중 쓸만한 녀석들을 찾는 것은 너무나 힘들었습니다.

원래 이 글은 회사 내부에서 정리를 위해 작성한 글이였으나, 다른 사람들도 보면 도움이 될 것 같아 블로그 용으로 다시 정리해보았습니다. :)

##Chart Libraries :)

많은 라이브러리들 중 내용을 정리하면서 추린 조건이 있습니다.

1. jQuery에 종속적이지 말 것. (YUI 등도 마찬가지)
2. 가급적 오픈소스일 것.
3. 문서 정리가 잘되어 있을 것.

첫번째 조건은 다른 소스에 종속되면 다양한 프로젝트에 도입하기도 힘들고, 해당 라이브러리의 문서뿐 아니라 종속된 라이브러리도 어느정도 숙달하고 있어야 하기 대문에 제외하였습니다.
나머지는 내용은 굳이 설명하지 않도록 하겠습니다. :)

또한 오픈소스인 경우 2014.05.04 기준으로 별과 Forks의 수를 적어두었습니다.

###AM Charts

![amcharts](/content/images/2014/May/1.png)

- 공식 : http://www.amcharts.com
- 예제 : http://www.amcharts.com/demos

유료라이센스입니다. 그치만 이 나머지 모든 차트 라이브러리를 압도할 만큼의 기능과 깔끔한 디자인이 관건입니다. 라이센스 비용(OEM 기준 140$)이 개인이 사용하기에는 조금 부담될 수도 있으나, 회사에서 사용하기에는 별 무리 없다고 생각했습니다.

###Chart.js

![chart.js](/content/images/2014/May/2.png)

- 공식 : http://www.chartjs.org
- 예제 : http://www.chartjs.org/docs (문서포함)
- Github : https://github.com/nnnick/Chart.js (7813 star, 2488 forks, 7months ago update)

오픈소스 중에서는 가장 좋은 것 같습니다. 전체적으로 깔끔하고 문서도 잘 정리되어있습니다.
다만, SVG를 더 사랑하는 저로서는 캔버스 기반이라 살짝 망설여지기는 했습니다. (SVG가 익숙한 저에게는 아무래도 튜닝을 할때 까다로운 부분이 있으니까요.)
또 밑에서 다룰 네이버의 nWagan(의 경우 SVG를 사용하였습니다.)과 디자인면에서 상당히 흡사한 점을 볼 수 있습니다.

###NVD3

![nvd3](/content/images/2014/May/3.png)

- 공식 : http://nvd3.org
- 예제 : http://nvd3.org/examples/index.html
- Github : https://github.com/novus/nvd3 (2383 star, 801 forks, 2months ago update)

우선 사이트가 부트스트랩 기반이라 정겨운(?) 느낌입니다. 기본에 충실합니다. d3.js에 종속적이라서 d3.css, d3.js를 기본적으로 넣어주어야 사용이 가능합니다. SVG를 사용하였습니다.

###dc.js

- 공식 : http://nickqizhu.github.io/dc.js
- Github : https://github.com/dc-js/dc.js (1665 stars, 482 forks, a month ago update)

d3.js 기반입니다. 소개페이지가 깃허브라 그런지 굉장히 개발자 친숙합니다만, 아무래도 문서정리가 아쉽습니다. 첫페이지의 예제가 굉장히 반응적이라 멋있습니다. 다만 그래프의 지원형태가 일반적인 차트라이브러리와 조금 다른 것 같습니다.

### Naver nWagan

![nwagan](/content/images/2014/May/nwagn.png)

- 공식 : http://nuli.navercorp.com/nwagon
- 예제 : http://jsfiddle.net/uRtsa/1/
- 블로그 소개 : http://helloworld.naver.com/helloworld/651829

국내 개발자 블로그를 많이 구독하는 저로서, 올해 초에 발표될 당시만 해도 굉장히 잘만들었다고 생각했었습니다. (그때만해도 차트를 사용하리라고 생각을 못했었으니까요.) 그치만 위에 것들 다 보고오면 아무래도 조금 초라한 느낌을 감출 수 없습니다.

SVG기반으로 작성되어있습니다. 그리고 nWagan만의 장점이라고 한다면 한글 문서와, 국내 대형포탈답게 IE6부터 지원한다는 점을 꼽을 수 있습니다.

(오픈소스 좀 깃허브로 배포하지.. 좋은 라이브러리를 배포하고 뭔가 썩히는 느낌이 듭니다.. -_ㅠ)


### Rickshaw

- 공식 : http://code.shutterstock.com/rickshaw
- 예제 : http://code.shutterstock.com/rickshaw/examples
- Github : https://github.com/shutterstock/rickshaw (4272 stars, 680 forks, 20days ago update)

왠지 블로그 포스팅 내용을 더 채워야 할 것 같아서 괜히 한번 넣어봤습니다. 조금 복잡한 느낌이 별로이지만 어쩌면 이런 느낌도 하나의 취향일 수 있다고 생각합니다.
d3.js 종속적이고 도넛형태의 그래프는 지원하지 않습니다.

### g.Raphael

- 공식 : http://g.raphaeljs.com
- Github : https://github.com/DmitryBaranovskiy/g.raphael (1412 stars, 448 forks, 2years ago update)

마찬가지로 포스팅 채우기용도입니다. 사실 그냥 별로입니다. 문서도 약하고 예제도 약하고.. 제가 왜 정리했는지 모르겠습니다.
일단 도넛형태의 그래프는 지원하지 않습니다.

### 그 외..

위에 포함되지 않았지만 한번쯤 둘러보셔도 괜찮을 만한 차트 라이브러리들입니다. :)

#### Google Chart

- 공식 : https://developers.google.com/chart

Google답게 기능은 많습니다.(디자인 지못미..) 그치만 제외하게된 이유는 한가지입니다. 소스를 다운받을 수가 없어 로컬에서 돌릴 수가 없습니다. (참고 : https://developers.google.com/chart/interactive/faq)



## 참고자료

- [위키피디아, Comparison of Javascript charing frameworks 항목](http://en.wikipedia.org/wiki/Comparison_of_JavaScript_charting_frameworks" target="_blank)
- [Cube3x, 37 Free jQuery or Javascript Chart Libraries](http://cube3x.com/37-free-jquery-or-javascript-chart-libraries" target="_blank)


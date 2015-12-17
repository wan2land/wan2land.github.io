---
layout: post
title: Jekyll에 Mathjax 추가하기
date: 2015-12-17 20:54:05 +09:00
tags: ['Mathjax', 'Markdown', 'Jekyll']
---

수학공식을 어떻게 블로그에 표현할까 고민하다가 MathJax 라는 도구가 있는 것을 발견했습니다. 엄청 유명한데 저만 몰랐나
봅니다.

![MathJax Main](/images/mathjax/main.png)

[www.mathjax.org](http://www.mathjax.org)

사이트 메인에 있는 저 공식도 실제로 드래그 해보면 드래그가 됩니다.

Jekyll 블로그에 적용하는 것도 쉽습니다. 그냥 소스 한줄 드래그 스륵 하고 `_layout`에 한줄만 적용해주면 됩니다.

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
```

그리고 저는 SVG를 옵션으로 사용해보려고 합니다. 뒤쪽 `config` 부분만 수정하면 됩니다. :D

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.3/MathJax.js?config=TeX-AMS-MML_SVG"></script>
```

사용해봅시다.

```
$$a^2 + b^2 = c^2$$
```

$$a^2 + b^2 = c^2$$

```
$$\int f(x)~dx$$
```

$$\int f(x)~dx$$

## 추가 사이트들

- [detexify.kirelabs.org/classify.html](http://detexify.kirelabs.org/classify.html) : 마우스로 그려서 특수문자 코드를 알 수 있습니다.

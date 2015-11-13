## Todo List

- Phinx
- Docker
- nodemon?
- open API License

## Book List

- http://www.acornpub.co.kr/book/joel-set#toc
- http://tom.preston-werner.com/2010/08/23/readme-driven-development.html


## CSS그리드 양쪽정렬

http://code.jelmerdemaat.nl/2012/perfectly-justified-css-grid-technique-using-inline-block/


## PHP Composer, Frontent Bower, And..

http://www.slideshare.net/weaverryan/cool-like-frontend-developer-grunt-requirejs-bower-and-other-tools-29177248


## PHP _ Function

- http://kr1.php.net/manual/en/function.gettext.php


## 페이스북 정보 고치기

https://developers.facebook.com/tools/debug/og/object/

## ECMA 6

http://kangax.github.io/compat-table/es6/

sweet.js
http://sweetjs.org
http://asmjs.org

http://www.romancortes.com/ficheros/css-coke.html

## REST Api 정리.

- 공통사항
    - Ajax처리인 경우 ?ajax=true 를 붙여주면 됩니다. (GET, POST 구분 잘하세요.)
    - URL에서 '[', ']'로 묶여 있는 것들은 생략 가능하단 이야기입니다.

- 글 리스트 화면 (Ajax 동시사용가능)
    - [GET] articles[/list]
    - static::getArticlesList

- 글 읽기 화면 (Ajax 동시사용가능)
    - [GET] articles[/view]/30
    - static::getArticlesView

- 글 쓰기 화면
    - [GET] articles/write
    - static::getArticlesWrite

- 글 수정 화면
    - [GET] articles[/view]/30/modify
    - static::getArticlesModify

- 글 삭제 화면
    - [GET] articles[/view]/30/delete
    - static::getArticlesDelete

- 글 쓰기 처리 (Ajax 동시사용가능)
    - [POST] articles/write
    - static::postArticlesWrite

- 글 수정 처리 (Ajax 동시사용가능)
    - [POST] articles[/view]/30/modify
    - static::postArticlesModify

- 글 삭제 처리 (Ajax 동시사용가능)
    - [POST] articles[/view]/30/delete
    - static::postArticlesDelete


## css3 flex 를 배워보자.

- http://ko.learnlayout.com/flexbox.html
- http://www.slideshare.net/donatJ1/beautiful-phpcli-scripts


## 다이어그램 그리기

```text
       +------------+     +------------+
       |            |     |            |
       |  CONTEXT   |<-+  |  CONTEXT   |<-+
       |            |  |  |            |  |
       +------------+  |  +------------+  |
                       |                  |
       +------------+  |  +------------+  |
       |    getY    |  |  |    getY    |  |
       |            |  |  |            |  |
       |     *------+--+  |     *------+--+
       |            |  |  |            |  |
       +------------+  |  +------------+  |
```

 - http://shaky.github.bushong.net

## Python

**Python2, 3 지원 라이브러리 현황**

 - http://python3wos.appspot.com
 

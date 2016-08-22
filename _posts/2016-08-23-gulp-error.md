---
layout: post
title: "Gulp 넌 왜 갑자기 말썽이냐... (feat. cssnano)"
date: 2016-08-23 00:26:35 +09:00
tags: ['Gulp', 'Nodejs', 'cssnano']
---

지난 3월 22일, Node 커뮤니티에서 발생했던 Left Pad 사건을 기억하시나요?

[www.bloter.net/archives/253447](http://www.bloter.net/archives/253447)

최근 Left Pad 만큼의 임팩트는 아니지만 비슷한 일이 발생하였습니다. 유명패키지 `cssnano`가 의존하고 있는 `reduce-css-calc`라는 패키지가 말썽을 일으켰습니다. 아는 사람만 사용하는 패키지라 많은 분들은 몰랐을 수도 
있습니다. 그치만 제가 그 **피해자 중 하나**였기 때문에 경험한 일을 공유하고자 합니다. :-)

## 발생

2016년 8월 22일, 오후 4시경, 회사에서 새로운 프로젝트를 시작하였습니다. 보통은 프론트엔드는 Gulp를 기반으로 빌드해서 사용하고, 항상 사용하는 `gulpfile`이 있기 때문에 여느때와 마찬가지로 파일을 복사 & 붙여넣기를 하고 설치를 하고 빌드를 실행하였습니다. 다른 프로젝트에서는 다 잘돌아가던 `gulp`가 새로운 프로젝트에서만 에러를 뿜었습니다.

```
[21:20:18] Using gulpfile (생략)
[21:20:18] Starting 'sass'...
[21:20:18] 'sass' errored after 3.69 ms
[21:20:18] TypeError: Cannot read property 'length' of undefined
    at flattenGlob (/내작업디렉토리/node_modules/glob2base/index.js:9:25)
    at setToBase (/내작업디렉토리/node_modules/glob2base/index.js:48:12)
    at module.exports (/내작업디렉토리/node_modules/glob2base/index.js:56:19)
    at Object.gs.createStream (/내작업디렉토리/node_modules/glob-stream/index.js:35:42)
    at Object.gs.create (/내작업디렉토리/node_modules/glob-stream/index.js:69:42)
    at Gulp.src (/내작업디렉토리/node_modules/vinyl-fs/lib/src/index.js:33:23)
    at SassRunner.execute (/내작업디렉토리/index.js:84:21)
    at /내작업디렉토리/index.js:201:24
    at arrayEach (/내작업디렉토리/node_modules/lodash/lodash.js:522:11)
    at Function.forEach (/내작업디렉토리/node_modules/lodash/lodash.js:9011:14)
```

제 소스가 문제가 아니라 그 하위의 패키지에서 문제를 일으키고 있었습니다. 원인이 무엇이지 하고 하나씩 추적을 해보기로 했습니다.

## 소스 추적하기

`glob2base/index.js`를 열어보았습니다.

```js
var setToBase = function(set) {
  // normal something/*.js
  if (set.length <= 1) {
    return flattenGlob(set[0]);
  }
  // has expansion
  return flattenExpansion(set);
};
```

`set.length`를 1이하로 체크하고 set[0]을 넣는대서 문제를 일으키고 있었습니다. `set`이라는 배열의 갯수가 0개였고, `flattenGlob`안에 호출할 때는 `undefined`를 넘겨주었는데 내부에서 `length`를 호출하니 문제가 발생한 것이었습니다. 처음에는 단순히, 해당 패키지가 1개를 체크하고, 0개를 체크해야하는데 버그인가라고 생각을 했습니다.

- [https://github.com/contra/glob2base](https://github.com/contra/glob2base)

문제의 패키지 인데요, 2년이나 유지보수가 안되는 패키지였습니다. 오랫동안 사용된 패키지가 갑자기 오류를 뿜는건 해당 패키지의 문제가 아닐거라는 생각이 들었습니다. 그래서 문제 상황을 `gulp`가 아닌 직접 파일(`test.js`)을 만들어서 재현해보았습니다. 그랬더니 아무런 에러를 뿜지 않았습니다. 그렇다면 무언가 다른 패키지에 의해 사이드이펙트가 발생했겠다는 생각이 들었습니다.

그리고 `console.log`노가다(엘레강스하지 못한 방법이지만..)를 통해서 직접 호출과 `gulp`를 통해 불렀을 때 값이 달라지는 지점을 찾았습니다.

- [https://github.com/isaacs/minimatch](https://github.com/isaacs/minimatch)

`minimatch`라는 패키지의 `minimatch/minimatch.js`파일이었습니다.

문제가 되는 부분은 바로 이 지점이었습니다.

```js
set = set.filter(function (s) {
    return s.indexOf(false) === -1
})
```

바로 여기에서 `indexOf`의 결과가 `gulp`와 직접 작성한 파일(`test.js`)이 달랐습니다. `gulp`를 사용하면 `0`을 반환하였고, 직접 작성한 파일을 사용하면 `-1`을 반환했습니다. 실제로 저 지점에서는 `-1`을 반환하는게 정상 동작입니다.

조금 고민해보니 답은 하나밖에 없었습니다. 제가 사용하고있는 어떤 패키지가 `Array.prototype.indexOf`를 덮어씌워버린거죠. (처음에는 "어.. 난가..?"하고 뜨끔했습니다. ㅎㅎ)

원인을 알면 찾는 것은 간단합니다. IDE에서 그냥 전체 검색하였습니다.

## 원인

- [github.com/redhivesoftware/math-expression-evaluator](https://github.com/redhivesoftware/math-expression-evaluator)

지금은 이미 수정이 되었기 때문에 옛날 소스를 첨부합니다. ([문제의 postfix.js 파일보기](https://github.com/redhivesoftware/math-expression-evaluator/blob/30311170875fc6c795e9eed31085ac2a08431ed7/src/postfix.js#L3))

참고로, 3시간전에 (이 포스팅을 작성하는 시간 기준으로) 이슈가 보고가 되었고 바로 수정이 되었습니다.

```js
if(!Array.indexOf)
	Array.prototype.indexOf = function (vItem) {
		for (var i=0; i < this.length; i++) {
			if (vItem == this[i]) {
			return i;
			}
		}
	  return -1;
	};

```

위 소스가 무엇이 문제일까요, (다들 아시겠지만..)

1. `Array.indexOf` 는 항상 `undefined`입니다. `Array.prototype.indexOf`를 찾았어야 합니다.
2. `indexOf`는 `==` 비교가 아니라 `===` 비교를 사용해야 합니다.


그런데 이것도 영 이상합니다. 해당 패키지는 꽤 오래전부터 저 소스를 사용하고 있었습니다. 의존관계를 조회해보았습니다. 명령어는 `npm list math-expression-evaluator` 입니다.

```
내프로젝트
└─┬ gulp-cssnano@2.1.2
  └─┬ cssnano@3.7.4
    └─┬ postcss-calc@5.3.1
      └─┬ reduce-css-calc@1.2.7
        └── math-expression-evaluator@1.2.9
```

그렇다면 전에 잘 작업되던 녀석은 어땠을 까요..?

```
내옛날프로젝트
└─┬ gulp-cssnano@2.1.1
  └─┬ cssnano@3.5.2
    └─┬ postcss-calc@5.2.0
      └── reduce-css-calc@1.2.1
```

`recude-css-calc`라는 녀석이 갑자기 패키지를 불러와서 사용하기 시작했네요.

- [헬게이트의 시작..](https://github.com/MoOx/reduce-css-calc/commit/aebe8f7adce937c0fec4c1315e4113ef74cadb6a)

여기는 이미 6시간 전에 해당 내용을 보고하고 있었더라고요. 근데 문제는 아직 여긴 수정이 안되었습니다.. [...] 위 링크를 들어가보면 "또다른 Left Pad" 라고 이미 언급한 사람도 있습니다.

## 결론

아직 `cssnano`의 문제는 해결되지 않았습니다. 조만간 고쳐질 것으로 보입니다.

만약 해당 문제가 발생하였다면, 두가지 패키지를 조회해보세요.

- `npm list math-expression-evaluator`
- `npm list reduce-css-calc`

이 두 패키지를 의존하고 있는 패키지를 대체할 수 있다면 대체해서 사용하시거나, `math-expression-evaluator`의 경우 최신버전을 사용하면 됩니다. 아니면 `recude-css-calc`를 옛날 버전(`1.2.4` 이하)을 사용하시면 해결 될것 같습니다.

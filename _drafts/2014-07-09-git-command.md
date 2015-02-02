---
layout: post
title: Git가지고 놀기(2) - 의외로 유용한 커맨드.
---
깃을 사용하면서 몇가지 닥치는 상황이 있습니다. 이때 필요한 명령어들을 정리해보고자 해당 포스팅을 작성해보았습니다. 


##내용

###.gitignore에 기존 파일 추가 후, 추가된 파일 지우기

상황을 예로 들어보자면, `config/database.inc` 라는 파일을 커밋해놓은 상황입니다. 그러다가 해당 파일이 커밋되면 안된다는 사실을 깨닫게 됩니다. 그래서 부랴부랴 `.gitignore`에 해당 파일을 추가합니다. 그러나 이미 커밋이 되었기 때문에 파일을 지우기 애매합니다. 그럴때 사용하는 명령어입니다..

```prettyprint lang-sh
$ git rm . -r --cached 
$ git add .
```

###마지막 커밋에 다시 커밋하기

이전 커밋에 포함되어야 할 몇가지 내용을 빼먹었을 때 사용합니다. 추가 커밋하기에는 애매하고 그냥 이전커밋에 덮어씌워버립니다.

```prettyprint lang-sh
git commit --amend
```

###
git pull 하는 과정에서 충돌이 났는데 특정 파일이 생성되서 충돌된 경우
git clean  -d  -fx ""

git Push 했는데 취소하고 싶은경우

커밋을 잘못했는데 push까지 한 경우!!(branch name = develop)

1.
git reset HEAD^ : 최종 커밋을 취소. 워킹트리는 보존됨.
git reset HEAD~2 : 마지막 2개의 커밋을 취소. 워킹트리는 보존됨.

2.
다시 수정할 부분 수정을 하고 작업을 한 후, 그대로 add, commit을하면 됨.
git add .
git commit -m ‘reset’

3.
push를 할 때 일반적으로 하던
git push origin develop으로 하면  x
(정보 손실 우려로 reject된다.)
git push origin +devleop으로 해야 o
(+를 붙이면 강제적으로 push를 하겠다는 뜻)

참고1 : http://whiteship.me/?p=13516 (자세한 설명)
참고2 : http://ecogeo.tistory.com/276 (더 많은 복구 명령어)

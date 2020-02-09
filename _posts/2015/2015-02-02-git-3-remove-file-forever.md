---
layout: post
title: "Git가지고 놀기(3) - 파일 영원히 지우기."
date: 2015-02-02 19:11:55 +09:00
tags: ["git"]
---

회사에서 사용중인 패키지에 `composer`를 기반으로 작성된 패키지가 있는데 초반에 실수로 `vendor`디렉토리를 commit을 해버려서 쓸대없이 용량이 커져버렸습니다. (여기서 vendor는 npm에서 `node_modules`, bower에서는 `bower_modules` 등으로 매칭해서 볼 수 있을 겁니다.) 즉, 올려도 되지 않아도 되는 파일들을 몽창 올리고 오랜 시간동안 유지를 해왔던 것이지요. 그리고 그 용량도 어마어마해서 새로 Clone을 받는데 제법 많은 시간을 소비하고 있었습니다. (또한 비밀번호가 작성된 민감한 파일이 실수로 올라가 있을 때에도 사용할 수 있습니다.)

그냥 불편해도 쓰려고 했는데, 그런일이 잦다 보니 귀찮아졌습니다. 해결책을 찾던 중, `Pro Git`이라는 책에서 간단히 해결책을 찾았습니다.

우리 패키지에서  vendor디렉토리만 전부 삭제하고 싶을 때 다음 명령어를 입력하면 됩니다.

```bash
git filter-branch --tree-filter 'rm -rf ./vendor' HEAD
```

```
Rewrite a66eb68ff04ddc2e33d0ac7604d31837cbad2cbb (76/76)
Ref 'refs/heads/develop' was rewritten
```

위와 같이 명령어를 주면 전체 커밋을 훑으면서 해당 명령어(위의 예시에서는 `rm -rf ./vendor`)를 입력해서 삭제해버립니다.

그리고 `git status`명령어를 입력하면 다음과 같은 상태를 확인할 수 있습니다.

```bash
git status
```

```
On branch develop
Your branch and 'origin/develop' have diverged,
and have 74 and 74 different commits each, respectively.
  (use "git pull" to merge the remote branch into yours)

nothing to commit, working directory clean
```

과연 여기서 끝이냐, 아닙니다. 한가지 문제가 더 있습니다. 바로 빈 커밋을 제거해주어야 합니다.

## 빈 커밋 제거하기

특정 커밋에서 파일 삭제만 진행했는데 `filter-branch`하는 과정에서 이 특정 커밋에 있는 파일을 지워버렸다면 해당 커밋은 빈 커밋이 되어버립니다.

위의 filter-branch명령어를 `--prune-empty`와 함께 작성하시면 됩니다.

```bash
git filter-branch --prune-empty HEAD
```

그리고 `git status`를 통해 다음과 같이 commit의 갯수가 줄어든 것을 볼 수 있습니다.

```bash
git status
```

```
On branch develop
Your branch and 'origin/develop' have diverged,
and have 66 and 72 different commits each, respectively.
  (use "git pull" to merge the remote branch into yours)

nothing to commit, working directory clean
```

이제 커밋을 하면 됩니다. :)

```bash
git push origin master --force
```

## 참고자료

- <https://github.com/progit/progit/blob/master/ko/06-git-tools/01-chapter6.markdown>
- [Stackoverflow Q. Git - remove commits with empty changeset using filter-branch](http://stackoverflow.com/questions/5324799/git-remove-commits-with-empty-changeset-using-filter-branch)

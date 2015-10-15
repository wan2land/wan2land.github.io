---
layout: post
title: Git가지고 놀기(2) - Git Diff
date: 2014-07-15 14:02:12 +09:00
tags: ['Git']
---
## Git diff

Git을 신나게 사용하다가 보면 어느순간 소스간에 비교가 필요할 때 있습니다 :) 특히 Commit이 많이 쌓이고 프로젝트 규모가 커지고 Tag를 통해 버전을 관리할때 변경된 점을 기록할해야 할 때 정말 많이 쓰는 명령어입니다.

우선 Merge도구를 연결하는 방법입니다.

## OSX filemerge와 연결하기

적용한 후의 모습.

![With OSX Merge Tool](/images/dev/git/filemerge.png)

OSX에서는 기본 Merge도구로서 Filemerge라는 도구를 제공하고 있습니다. 물론 git에 연결이 필요합니다.

```bash
$ vi ~/git-diff-cmd.sh
$ chmod +x ~/git-diff-cmd.sh
```

위 명령어를 이용하여 파일을 열고, 다음과 같이 저장합니다.
간단히 설명하자면 git에서 diff를 실행했을 때 실행할 파일을 `git-diff-cmd.sh`로 지정하는 것입니다. 그리고 실행권한을 주는 것을 잊지 맙시다. :)

```bash
#!/bin/sh
/usr/bin/opendiff "$2" "$5" -merge "$1"
```

그리고 다음 명령어를 통해 Git에 연결합니다.

```bash
$ git config --global diff.external ~/git-diff-cmd.sh
```

간단히 실험해봅시다.

```bash
$ git diff 1.2.2 1.3.2 src/Wandu/Controller.php
```

물론 위 실험용 명령어는 프로젝트마다 조금씩 다를 수 있습니다. :)

## Git Diff 명령어 정리

### 최근 Commit과 현재 파일과의 비교

비교를 하기 위해서는 파일이 stage상태가 되어야 합니다.

```bash
# 모든 파일을 stage상태로 만들기
$ git add . 

# 전체 비교
$ git diff --cached

# 특정 파일 비교
$ git diff --cached filename 
```

### 태그간의 비교

특히 저는 **README.md**파일에 Release Note를 꼼꼼히 적는 편이라서 태그간에 비교가 굉장히 잦은 편입니다.

```bash
# 현재와 이전 버전과 비교 ex. git diff 1.3.2
$ git diff version

# 현재와 이전 버전과 비교, 특정파일 ex. git diff 1.3.2 REAEME.md
$ git diff version filename

# 현재와 이전 버전과 비교, 특정폴더 ex. git diff 1.3.2 src/Controller
$ git diff version dirname

# 버전과 버전간의 비교 ex. git diff 1.2.0 1.3.1
$ git diff version otherversion

# 버전과 버전간의 비교, 특정파일 ex. git diff 1.2.0 1.3.1 README.md
$ git diff version otherversion filename

# 버전과 버전간의 비교, 특정폴더 ex. git diff 1.2.0 1.3.1 src/Controller
$ git diff version otherversion dirname
```

### Commit과의 비교

방금 위에서 설명한 예제에서 딱 한부분만 수정됩니다. 바로 version이 들어가는 부분이 **git commit hash**로 대체된다는 점이죠.

```bash
# 커밋간의 비교 ex. git diff 5643175 30ee131
$ git diff commithash otherhash
```


## 참고자료

- [Jotlab, How to use FileMerge with Git as a Diff Tool on OSX](http://www.jotlab.com/2009/how-to-use-filemerge-with-git-as-a-diff-tool-on-osx)
- [Git, git-diff Documentation](http://git-scm.com/docs/git-diff)

---
layout: post
title: "OSX에서 PHP를 여러버전 깔아놓고 쓸때 팁"
date: 2016-07-14 13:03:16 +09:00
tags: ['osx', 'php', 'multiversion']
---

보통 OSX에서 Homebrew를 많이 사용하실 겁니다. 그리고 몇몇 분들은 다양한 PHP 버전을 깔아놓고 테스트를 해야할 때 아마
다음과 같이 명령어를 사용할 겁니다.

```sh
brew unlink php56
brew link php70
```

그런데 이게 유닛테스트를 버전을 돌려가면서 할 때 여간 귀찮은 일이 아니더군요. 그래서 아예 `php56`, `php70`과 같이 자체
커멘드를 사용할 방법을 고민하였습니다.

만약에 기본 OSX 터미널을 사용한다면 다음과 같이 해당 파일을 열어봅시다.

```sh
vi ~/.bash_profile
```

`zsh`을 사용한다면..

```sh
vi ~/.zshrc
```

그리고 맨 아래에 다음 두 줄을 추가해봅시다.

```sh
alias php56=/usr/local/Cellar/php56/`ls /usr/local/Cellar/php56 | tail -1`/bin/php
alias php70=/usr/local/Cellar/php70/`ls /usr/local/Cellar/php70 | tail -1`/bin/php
```

이제 `php56`, `php70` 명령어를 통해서 각각 다른 버전을 불러 올 수 있게 되었습니다.

## 추가 팁

유닛테스트를 버전별로 나누고 싶다면.. ~~(사실 제가 하고 싶었던 것..)~~

```sh
alias phpunit56='php56 vendor/bin/phpunit'
alias phpunit70='php70 vendor/bin/phpunit'
```

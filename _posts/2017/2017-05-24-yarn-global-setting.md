---
layout: post
title: "yarn global 설정하기"
date: 2017-05-24 11:46:28 +09:00
tags: ["nodejs", "yarn"]
---

요즘 Node.js 쪽 패키지 관리자는 [Yarn](https://yarnpkg.com)을 사용하고 있습니다. 메모리나 속도면에서 [npm](https://docs.npmjs.com)보다 우수하기 떄문입니다.

전에 `npm`을 사용할 때는 **global** 설치가 크게 어렵지 않았습니다. 기본적으로 `node`를 설치할 때 같이 따라오기 때문에 `bin` 디렉토리들이 알아서 설정되어있기 때문입니다. 하지만 `yarn`의 경우는 바로 사용되지 않았습니다.

설치시, 우분투라면 `apt install yarn`을, OSX라면 `brew install yarn`을 사용했다는 가정하에 진행하도록 하겠습니다. :-)

## Ubuntu & OSX

일단 다음 명령어를 입력해보면 보통은 `undefined`가 출력됩니다.

```bash
yarn config get prefix
```

`prefix` config 를 다음과 같이 설정해줍니다.

```bash
yarn config set prefix ~/.yarn-global
```

그리고 다음 명령어를 실행해봅시다.

```bash
yarn config get prefix
```

그러면 방금 설정한 경로가 제대로 출력되는 것을 확인할 수 있습니다. 또한 다음 명령어를 통해서 해당 설정값이 제대로 들어가있는지 확인할 수 있습니다.

```bash
cat ~/.yarnrc
```

그리고 이제 `.bashrc` 파일을 수정해야합니다. 만약에 [zsh](http://www.zsh.org/)을 사용중이라면 `.zshrc` 파일을 수정합니다.

그리고 다음 한줄을 추가합니다.

```bash
export PATH="$PATH:`yarn global bin`"
```

테스트로 패키지 하나를 설치해봅시다. :-)

```bash
yarn global add pm2
pm2 --version
```

버전이 정상적으로 출력되는 것을 확인할 수 있습니다.

## 참고

- [yarn issue #2108](https://github.com/yarnpkg/yarn/issues/2108)

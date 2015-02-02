---
layout: post
title: 리눅스 명령어 모음
---
퍼미션?
rwxrwxrwx 이렇게 구성됨.
7	read, write and execute	111
6	read and write	110
5	read and execute	101
4	read only	100
3	write and execute	011
2	write only	010
1	execute only	001
0	none	000

각 숫자는 위와 같고. user / group/ others순서대로입니다.


## 사용자 관련

모든 예시에서 사용할 사용자 이름은 'minuat'입니다.


###사용자 추가


```
$ useradd minuat -d /home/minuat
$ passwd minuat
$ cp /etc/skel /home/minuat -r # 새로 만든 사용자 폴더 생성
$ chown minuat ./minuat -R
$ vi /home/minuat/.bashrc
```

여기서 약 75번째 줄에 `alias ls='ls --color=auto'` 라고 되어있는 부분을 `alias ls='ls -la --color=auto'`로 수정.

//이때 사용자는 /etc/passwd , /etc/group 에 생성되는 듯.

기본적으로 쉘환경은 /bin/sh을 사용하는데 bash로 변경하고자 할때는 /etc/passwd파일에서 /bin/sh라고 적혀있는 부분을 /bin/bash로 변경해준다.

또는 `useradd minuat -s /bin/bash`  명령어를 통해 변경가능.

usermod -g root wan2land

###사용자에게 루트권한주기


###사용자 삭제

```
userdel minuat
userdel -r minuat # 생성한 폴더까지 다 같이 삭제.
```


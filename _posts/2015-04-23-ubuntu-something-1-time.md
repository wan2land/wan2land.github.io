---
layout: post
title: "Ubuntu 꼴랑이거(1) - 서버 시간이 차이가 날때.."
date: 2015-04-23 11:20:11 +09:00
tags: ['Ubuntu', 'Time']
---

맨날 조금조금씩 서버를 운영하면서 발생하는 문제에 대해서 어딘가에 정리를 해야할 것 같아서 작성하는
포스팅입니다. 어떻게 보면 참 간단한 것들인데 매번 구글에 찾는 것도 귀찮고, 한편으로는 제가 그만큼
서버에 대해 무지하지 않았나 스스로를 반성하기 위해서 정리하는 포스팅 시리즈입니다.

최근에 서비스를 운영하다가 특정 시간이 되면 문자 혹은 메일이 날아가는 시스템을 추가하였습니다.
그런데 정확히 원하는 시간에 날아가지 않는 문제를 발생했습니다. 저는 당연히 서버라고 하면 인터넷이
물려있으니까 시간이 자동으로 맞춰질줄 알았으나.. 그것은 큰 오산이었습니다.

## 환경알아보기

저는 스x호스팅에서 가상서버를 호스팅 받아서 사용하고 있고, 서버 버전은 다음과 같습니다.

```
$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 14.04.1 LTS
Release:	14.04
Codename:	trusty
```

- 참고 : [Cheking Your Ubuntu Version](https://help.ubuntu.com/community/CheckingYourUbuntuVersion)

## 서버시간 보기

서버를 보는 명령어는 간단합니다. `timedatectl`(간단하게 보려면 `date`)입니다. 명령어를 입력하니
다음과 같은 결과를 볼 수 있었습니다.

```
$ date
2015. 04. 23. (목) 11:36:50 KST
```

```
$ timedatectl
      Local time: 목 2015-04-23 11:37:58 KST
  Universal time: 목 2015-04-23 02:37:58 UTC
        RTC time: 목 2015-04-23 02:46:28
        Timezone: Asia/Seoul (KST, +0900)
     NTP enabled: yes
NTP synchronized: no
 RTC in local TZ: no
      DST active: n/a
```

제 컴퓨터 시간과 비교했을 때 약 1~2분 차이가 나는 것을 알 수 있었습니다. ~~어쩐지.. DB에도 시간이
좀 이상하게 나오더라...~~

## 서버시간 싱크 맞추기

서버의 시간은 NTP를 통해 조절할 수 있다고 합니다. 그리고 제 서버 하나로는 동기화를 맞추는건 불가능
하기 때문에 NTP서버를 입력해야합니다. 명령어는 단순합니다. `ntpdate`이고, 첫번째 인자로 기준
서버를 입력해야합니다. 저는 `ntp.ubuntu.com`을 사용했습니다.

```
$ ntpdate ntp.ubuntu.com
23 Apr 11:39:41 ntpdate[5182]: step time server 91.189.94.4 offset -96.781137 sec
```

몇초가 차이가 났는지 조정이 됩니다. 96초라는 어마어마한 차이를 두고 있다니.. 조금 부끄럽네요.
만약에 해당 서버가 응답을 안 할 수도 있습니다. 그럴때 NTP 서버는 다음 링크에서 찾아볼 수 있습니다.

- [pool.ntp.org](http://www.pool.ntp.org)

근데 이 짓을 매번 사람이 할 수 없으니 특정 시간이 되면 컴퓨터가 알아서 할 수 있도록 해야합니다.

## Crond에 싱크작업 추가하기

Crond은 컴퓨터에서 일정 시간이 되면 지정한 명령어를 수행하도록 하는 데몬입니다. "매일 몇시 몇분이
되면 이런 명령어를 실행해켜줘!" 이런 일을 컴퓨터에게 시킬때 참 편리한 녀석입니다. 명령어는 다음과
같이 입력합시다.

```
$ crontab -e
```

그러면 기본 에디터로 실행이 되는데, 보통 `nano`혹은 `vim`이 실행이 될 것입니다. 마지막 라인에
다음과 같이 추가합시다.

```
0 4 * * * /usr/sbin/ntpdate ntp.ubuntu.com > /dev/null 2>&1
```

간단히 설명하면 순서대로 0분, 4시, 매일(*), 매월(*), 매요일(*) 해당명령어를 실행하라는 의미입니다. 
crond에 대한 자세한 설명은 구글에 검색하면 많이 나옵니다. 만약에 조정 내역을 로그로 남기고 싶다면
다음과 같이 작성하면 됩니다.

```
0 4 * * * /usr/sbin/ntpdate ntp.ubuntu.com >> /var/log/ntpdate_sync.log
```

참 쉽죠? :-)

## 참고자료

- <https://help.ubuntu.com/10.04/serverguide/NTP.html>
- <http://egloos.zum.com/program/v/802690>
- <http://www.pool.ntp.org/ko/>

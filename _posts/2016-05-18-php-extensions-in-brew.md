---
layout: post
title: "HomeBrew에서 살펴본 PHP7 Extensions"
date: 2016-05-18 17:58:21 +09:00
tags: ['php', 'php7', 'extensions', 'homebrew']
---

```bash
brew search php70
```

HomeBrew에서 PHP7.0 관련 패키지를 보다가 각 패키지의 사용률이 궁금해졌습니다.
찾아보니 Bintray라는 사이트에서 전체 값인지 모르겠지만 brew 관련 패키지의 통계를
제공하는 것을 알 수 있었습니다.

https://bintray.com/homebrew/bottles-php

2016년 5월 18일 기준으로 41개가 등록되어있습니다. 순서대로 패키지 이름, 최신
업데이트 날짜, 최근 30일간 전체 다운로드 수입니다.

| 패키지 이름 | 최신 업데이트 날짜 | 다운로드 수 | 비고 |
| ----------- | ------------------ | -----------:| ---- |
|amqp         | 2016.04.27         | 167         | |
|apcu         | 2016.01.29         | 44          | |
|apcu-bc      | 2016.01.29         | 92          | |
|ast          | 2015.12.04         | 64          | |
|blitz        | 2016.01.17         | 25          | |
|ev           | 2015.12.07         | 40          | |
|event        | 2016.05.08         | 48          | |
|gearman      |                    |             | bintary 목록에는 있지만 brew에는 없음 |
|gmagick      | 2016.05.14         | 82          | |
|gmp          | 2016.04.29         | 167         | |
|hprose       | 2016.01.29         | 23          | |
|imagick      | 2016.05.05         | 1086        | |
|intl         | 2016.04.29         | 1590        | |
|kafka        |                    |             | bintray에서 제공 안함 |
|libsodium    | 2016.01.16         | 48          | |
|lz4          | 2016.05.11         | 27          | |
|lzf          | 2015.11.27         | 31          | |
|mailparse    | 2016.01.15         | 38          | |
|mcrypt       | 2016.04.29         | 3060        | |
|mecab        | 2015.12.31         | 23          | |
|memcached    |                    |             | bintray에서 제공 안함 |
|mongodb      | 2016.04.08         | 549         | |
|msgpack      | 2016.04.05         | 60          | |
|mustache     | 2016.01.30         | 20          | |
|oauth        | 2016.01.18         | 72          | |
|opcache      | 2016.04.29         | 1193        | |
|pcntl        | 2016.04.29         | 155         | |
|pdo-dblib    | 2016.04.29         | 192         | |
|pdo-pgsql    | 2016.04.29         | 556         | |
|pspell       | 2016.04.29         | 39          | |
|pthreads     | 2015.12.07         | 72          | |
|rdkafka      | 2016.01.30         | 19          | |
|redis        |                    |             | bintray에서 제공 안함 |
|snmp         | 2016.04.29         | 49          | |
|ssh2         |                    |             | bintray에서 제공 안함 |
|stats        |                    |             | bintary 목록에는 있지만 brew에는 없음 |
|swoole       | 2016.02.04         | 83          | |
|tidy         | 2016.04.29         | 146         | |
|timecop      |                    |             | bintary 목록에는 있지만 brew에는 없음 |
|uuid         | 2016.01.21         | 70          | |
|v8js         | 2016.04.22         | 99          | |
|xdebug       | 2016.03.07         | 1437        | |
|xxtea        | 2016.02.03         | 25          | |
|yaml         |                    |             | bintray에서 제공 안함 |


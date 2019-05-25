---
layout: post
title: Composer classmap을 이용한 성능향상
date: 2015-01-23 15:36 +09:00
tags: ["php", "composer"]
---

요즘 ModerPHP User Group (이하 PUG)에서 Composer 완전정복이라는 주제로 스터디를 진행하는게 있습니다. 각자 자기가 공부한 내용을 발표하던 중 눈에 띄는 옵션이 있었습니다.

바로 `--optimize-autoloader (-o)`라는 옵션입니다. 설명을 보면

Convert PSR-0/4 autoloading to classmap to get a faster autoloader. This is recommended especially for production, but can take a bit of time to run so it is currently not done by default.

뭐 요딴식으로 적혀있습니다. 간단히 얘기하면 classmap을 이용해서 autoload의 성능을 향상시킨다는 것!

Composer를 설치하시면 기본적으로 PSR-0 또는 PSR-4로 지정된 클래스 구조에 따라서 알아서 클래스를 오토로드합니다. 그리고 그 임시 파일들(Composer에서 사용하는)은 `vendor/composer/` 디렉터리 안에 정의되어있습니다. 원래 `autoload_classmap.php` 파일안에는 `composer.json`에서 `class_map`이라는 설정에 대해서만 내용이 생성됩니다. ([참고링크](https://getcomposer.org/doc/04-schema.md#classmap)) 그러나 방금 말한 `--optimize-autoloader` 옵션을 사용하면 현재 프로젝트 내부에 있는 모든 클래스를 `classmap`의 형태로 등록하고 사용하게 됩니다.

## 사용법

사용법은 간단합니다.

```bash
$ composer install -o
```

또는

```bash
$ composer update -o
```

이런식으로 `-o` 옵션만 추가하시면 됩니다. 이미 설치를 하셨다면

```bash
$ composer dump-autoload -o
```

이런식으로 명령어를 입력하시면 됩니다. 그리고 `vendor/composer/autoload_classmap.php`파일을 열어보시면

![Classmap Before](/images/dev/composer/classmap-before.png)

(평상시)

![Classmap After](/images/dev/composer/classmap-after.png)

(-o 옵션을 주고 설치한다음에..)

이런식으로 모든 클래스를 다 클래스맵에 등록해서 사용하는 것을 알 수 있습니다.

## 성능

아무래도 PSR-0, PSR-4 의 오토로드는 클래스를 불러올 때마다 해당 네임스페이스 규칙을 분석하고 파일경로를 생성해서 파일을 불러오는데, 클래스맵에 등록해놓으면 이러한 연산을 미리 다 해서 파일로 저장해 놓습니다. 그리고 이 파일을 통해 바로 클래스를 불러오기 때문에 성능이 빨라지는 것입니다. 그런데 아무래도 초반에 사용하지도 않을 내용들을 전부 메모리에 올려서(비록 문자열기반의 자료이긴 하지만..) 메모리를 더 차지하지 않을까 라는 막연한 생각이 있어 실제로 비교를 해보았습니다.

기존에 사용하던 프로젝트(Slim 기반의)에 다음과 같이 소스를 작성하고 각 10번씩 테스트 해보았습니다. 뭐 물론, 시행횟수가 엄청 작아서 비교하기 애매한 수치이긴 합니다.

```php
<?php
$start = [
    "time" => explode(' ', microtime()),
    "memory" => memory_get_usage(),
];

/*
Autoload를 불러오는 과정을 포함한 모든 프로젝트 소스
*/

$end = [
    "time" => explode(' ', microtime()),
    "memory" => memory_get_usage(),
];

$memory = $end['memory'] - $start['memory'];
$timeSecond = $end['time'][1] - $start['time'][1];
$timeMicroSecond = $end['time'][0] - $start['time'][0];
if ($timeMicroSecond < 0) {
    $timeSecond -= 1;
    $timeMicroSecond += 1;
}
$time = $timeSecond . ' ' . $timeMicroSecond;
$result = <<<EOD
Memory Usage : {$memory}
Time : {$time}

EOD;

file_put_contents("php://stdout", $result);
```

### ClassMap 을 사용하지 않는 경우.

```
Memory Usage : 1552280
Time : 0 0.019134

Memory Usage : 1552280
Time : 0 0.01834

Memory Usage : 1552344
Time : 0 0.01701

Memory Usage : 1552280
Time : 0 0.017028

Memory Usage : 1552280
Time : 0 0.016431

Memory Usage : 1552280
Time : 0 0.021419

Memory Usage : 1552280
Time : 0 0.017582

Memory Usage : 1552280
Time : 0 0.018029

Memory Usage : 1552280
Time : 0 0.017324

Memory Usage : 1552280
Time : 0 0.016467

평균 메모리 : 1552286
평균 시간 : 0.017876
```

### ClassMap을 사용한 경우

```
Memory Usage : 1572304
Time : 0 0.016099

Memory Usage : 1572304
Time : 0 0.016543

Memory Usage : 1572304
Time : 0 0.016954

Memory Usage : 1572304
Time : 0 0.018753

Memory Usage : 1572304
Time : 0 0.018424

Memory Usage : 1572304
Time : 0 0.017512

Memory Usage : 1572304
Time : 0 0.017378

Memory Usage : 1572304
Time : 0 0.017457

Memory Usage : 1572304
Time : 0 0.016419

Memory Usage : 1572304
Time : 0 0.019407

평균 메모리 : 1572304
평균 시간 : 0.017495
```

그냥 사용할 때보다 속도는 약 **2.13%** 향상되었고, 메모리는 약 **1.29%** 정도 더 소모합니다.

## 결과

![슴무룩](/images/jjal/summerlook.png)

~~..성능 향상이 엄청 미미하네요.. 포스팅 망한듯..~~

아마도 저희 프로그램 규모가 작아서 그럴겁니다... 실제로 더 클래스가 방대한 프로젝트에서는 더 큰 향상이 있을 것입니다.. (Laravel 정도만 되도 제법 있을 것 같은데..? 다음에 Laravel로 프로젝트를 작성할일이 생기면 다시한번 테스트 해보겠습니다.)

한가지 단점을 꼽자면 클래스를 새로 생성하거나 삭제할 때마다 클래스맵을 생성하지 않으면 해당 클래스에 한해서 autoload를 타게 됩니다. 그래서 `composer dump-autoload -o`라는 명령어를 일일이 쳐야합니다. 뭐 물론, 평상시에는 클래스맵없이 개발하고 배포할 때 클래스맵을 생성하면 될것 같습니다. :)

## 참고자료

- https://getcomposer.org/doc/03-cli.md#install

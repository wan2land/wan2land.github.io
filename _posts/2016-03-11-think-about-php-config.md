---
layout: post
title: PHP Config는 무엇을 사용해야할까?
date: 2016-03-11 10:27:36 +09:00
tags: ['php', 'json', 'config', 'opcache']
---

저는 주로 Config를 PHP 코드를 사용하는데요, 보통 다음과 같이 사용합니다.

```php
<?php
return [
    'database' => [
        'username' => 'hello',
        'password' => 'hello pass',
    ],
];
```

그런데!!! Modern PUG에서 아주 재밌는 글을 읽었습니다. Config를 위와 같은 형태로
사용할 경우 PHP 해석기의 비용이 크기 때문에 가급적 **JSON**, **INI**와 같은
저비용 해석기를 사용하라는 내용이었습니다.

그동안 JSON을 사용하지 않았던 이유가 느릴것 같았기 때문입니다.

```php
<?php

// PHP에서 불러오기
$configPhp = require './configs/config.php';

// JSON에서 불러오기
$configJson = json_decode(file_get_contents('./configs/config.json'), true);
```

위 소스를 보면 너무 단순한 이유였습니다. "함수를 두번 사용하네, 그럼 느리겠지.."

그래서 당장 실험해보기로 했습니다. 소스코드는 다음과 같이 준비했습니다.

**config.ini**

```ini
hello=10
world=20
text=hello world

[section]
text = section title

[article]
title = 30
description = "hello world desc."
```

**config.json**

```json
{
  "hello": "10",
  "world": "20",
  "text": "hello world",
  "section": {
    "text": "section title"
  },
  "article": {
    "title": "30",
    "description": "hello world desc."
  }
}
```

**config.php**

```php
<?php
return [
    'hello' => 10,
    'world' => 20,
    'text' => 'hello world',
    'section' => [
        'text' => 'section title',
    ],
    'article' => [
        'title' => 30,
        'description' => 'hello world desc.',
    ],
];
```

위 세가지 형식의 Config는 모두 같은 내용을 담고 있습니다. 그리고 성능 체크를
위해 10000번씩 수행하고 걸리는 시간을 반환하도록 작성하였습니다.

**bench.php**

```php
<?php

$bench = new Bench;

$bench->run(function () {
    $config = parse_ini_file('./configs/config.ini', true);
}, 10000);

$bench->run(function () {
    $config = require './configs/config.php';
}, 10000);

$bench->run(function() {
    $config = json_decode(file_get_contents('./configs/config.json'), true);
}, 10000);
```

테스트 환경은 다음과 같습니다.

> MacBook Pro Retina 13" Early 2015  
> CPU : 3.1 GHz Intel Core i7  
> RAM : 16GB 1867 MHz DDR3  
> Os : OSX El Capitan 10.11.3  
> PHP : 5.6.16

그리고, 시간 측정 결과입니다.

```
Times
0(sec) 0.290266

Times
0(sec) 0.294543

Times
0(sec) 0.208705
```

**실제로 JSON이 가장 빨랐고 그 다음이 INI, 제일 느린게 PHP였습니다.**
PHP 소스코드만 보고 느릴거라고 판단할게 아니라 PHP 내부에서 어떻게 처리할지를
생각해보면 너무도 당연한 결과였습니다. ~~제가 바보였습니다..~~

자 여기서, 한단계 더 고민해보기로 했습니다.

PHP 해석기의 비용은 큽니다. 그러나 PHP는 내부적으로 Opcode라는 캐시를 생성해서
사용하기 때문에 매번 PHP 해석기가 필요없습니다. 그런데 왜 위 테스트에서는
저런 결과를 내놓았는가?

`phpinfo()`를 찍어본 결과 다음과 같은 내용을 볼 수 있었습니다.

```
Zend OPcache

Opcode Caching => Disabled
Optimization => Disabled
Startup Failed => Opcode Caching is disabled for CLI
```

아.. 커맨드라인 환경에서는 Opcache가 꺼져있었구나.. 그래서 켰습니다.
설정파일에서 다음과 같은 부분을 찾아서 0을 1로 고쳤습니다.

```ini
; Enables the OPcache for the CLI version of PHP.
; It's mostly for testing and debugging.
; (default "0")
opcache.enable_cli = 1

```

그리고 `phpinfo()`를 출력하여 Opcache가 활성화 되었음을 확인하였습니다.

```
Zend OPcache

Opcode Caching => Up and Running
Optimization => Enabled
Startup => OK
Shared memory model => mmap
Cache hits => 0
Cache misses => 3
Used memory => 5487544
Free memory => 61621320
Wasted memory => 0
Interned Strings Used memory => 467840
Interned Strings Free memory => 3726464
Cached scripts => 3
Cached keys => 6
Max keys => 3907
OOM restarts => 0
Hash keys restarts => 0
Manual restarts => 0
```

그리고 다시 위 동일한 테스트를 진행하였고, 결과는 놀라웠습니다.

```
Times
0(sec) 0.285804

Times
0(sec) 0.035412

Times
0(sec) 0.232584
```

성능이 7~8배 정도 차이로 PHP 소스가 더 빨랐음을 알 수 있었습니다.

## 결론

성능은 다음과 같았습니다.

> **Opcache Enabled PHP** >>> **JSON** > **ini** > **Opcache Disabled PHP**

즉, 정리하자면 서버 환경이 Opcache를 사용할 수 있다면 PHP를 Config로 사용하는게
좋습니다. 그리고 환경이 Opcache가 활성화되어있지 않고, 활성화 할 수 없는
환경이라면 Json을 사용하는게 좋습니다.

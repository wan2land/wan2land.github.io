---
layout: post
title: PHP에서 pthread 사용하기.
date: 2013-12-23 16:22:53 +09:00
tags: ['PHP', 'pthread']
---

## 설치

### 설치환경

- OSX 10.9 Mavericks

처음에 Homebrew [PHP 패키지](https://github.com/josegonzalez/homebrew-php) 자체에서 지원하는지 제대로 확인 안하고 **pecl**로 삽질하다가.. 검색하다가 단 두줄로 해결되는 것 보고.. 너무 허무했습니다.. 쓰읍..


```bash
$ brew install php55 --with-thread-safety
$ brew install php55-pthreads
```

이것도 모르고 `zts enabled... no`라는 에러때문에 어찌나 고생했던지..

## 예제

다음은 [PHP Thread](http://www.php.net/manual/en/class.thread.php)에서 가져온 간단한 예제입니다. 중국인이 만들었는지 한문이 막 있길래 걍 대충 알아보기 쉽게 정리해보았습니다.

```php
<?php

class Vote extends Thread {

    public $res    = '';
    public $url    = array();
    public $name   = '';
    public $runing = false;
    public $lc     = false;

    public function __construct($name) {

        $this->res    = 'res';
        $this->param    = 0;
        $this->lurl   = 0;
        $this->name   = $name;
        $this->runing = true;
        $this->lc     = false;

        echo "in Thread({$name}) is created!\n";

    }

    public function run() {

        echo "in Thread({$this->name}) is runed!\n";

        while ($this->runing) {

            if ($this->param != 0) {
                $nt          = rand(1, 10);
                echo "in Thread({$this->name}), Param:{$this->param}, {$nt}..\n";
                $this->res   = rand(100, 999);
                sleep($nt);
                $this->lurl = $this->param;
                //랜덤한 시간이 지난후 param이 사라짐
                $this->param   = '';
            } else {
                echo "in Thread[{$this->name}], None\n";
            }
            sleep(1);
        }
    }

}

// Make
$pool[] = new Vote('a');
$pool[] = new Vote('b');
$pool[] = new Vote('c');

// Run
foreach ($pool as $w) {
    $w->start();
}

for ($i = 1; $i < 10; $i++) {
    $worker_content = rand(10, 99);
    while (true) {
        foreach ($pool as $worker) {
            // worker param이 없을때 넣어줌
            if ($worker->param == '') {
                $worker->param = $worker_content;
                echo "Worker Name : {$worker->name}, Content : {$worker_content}, lurl : {$worker->lurl}, res : {$worker->res}.\n";
                break 2;
            }
        }
        echo "Tick!\n";
        sleep(1);
    }
}

echo "----";

while (count($pool)) {
    foreach ($pool as $key => $threads) {
    	// worker param이 없을 때 종료됨
        if ($threads->param == '') {
            echo "Worker Name : {$threads->name}, lurl : {$threads->lurl}, res : {$threads->res}.\n";
            echo "{$threads->name} is overed!\n";

            $threads->runing = false;
            unset($pool[$key]);
        }
    }
    echo "ing....\n";
    sleep(1);
}

echo "End;\n";
```

##참고자료

- <http://www.php.net/manual/en/book.pthreads.php>

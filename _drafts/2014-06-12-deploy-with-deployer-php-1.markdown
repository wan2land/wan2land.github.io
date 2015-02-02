---
layout: post
title: 'Deployer : PHP로 배포하기(1).'
date: 2014-06-12 13:36:31.000000000 +09:00
---
PHP를 배포하는 방법이 수없이 많겠지만, PHP친화적으로 배포하는 방법을 소개하려고 합니다. 바로 `Deployer`라는 도구입니다.

- [deployer.in](http://deployer.in" target="_blank)

![Deployer](/content/images/2014/Jun/deployer.png)

물론 [Phing](http://www.phing.info" target="_blank)도 PHP로 제작된 배포용 도구이지만, 작성해야 하는 파일은 XML기반입니다. 그래서인지 [Ant](http://ant.apache.org" target="blank)를 사용하는 것과 크게 다르지않다는 인상을 받았습니다.

하지만 제가 소개하고자 하는 `Deployer`라는 도구는 크게 유명한 도구는 아니지만 부족한 부분은 여러분의 PHP실력으로 커버가 가능한 도구입니다.

## 설치하기

PHP친화적인 도구 답게 당연히 Composer를 지원합니다. 공식사이트에 나와있는 설치방법은 다음과 같이 설치하라고 나와있습니다.

```prettyprint lang-json linenums
"require": {
	"elfet/deployer": "dev-master@dev"
}
```

그렇지만, 안정화되어있는 마지막 버전을 사용하는게 좋습니다. 여기서는 `v0.4.2`를 사용해보도록 합시다.

```prettyprint lang-json linenums
"require": {
	"elfet/deployer": "v0.4.2"
}
```

## 사용하기

예제 파일 구조는 다음과 같습니다.

![](/content/images/2014/Jun/_____2014_06_12____1_51_09.png)

(.DS_Store는 윈도우에서 thumbs.db 같이 폴더내에 자동으로 생성되는 파일입니다.)

그리고 `deployer.php`파일은 다음과 같이 생겼습니다.

```prettyprint lang-php linenums
<?php
include __DIR__.'/vendor/autoload.php';
 
deployer();
 
define('LOCAL_ROOT', __DIR__);
define('BUILD_NAME', 'example_'.date('ymd_H') );
 
ignore(array(
	'deployer.php',
	'composer.json',
	'composer.lock'
));
 
task('init-master', '본서버에 사용할 값들을 정의합니다.', function() {
	define('SERVER_HOST', 'remotehost');
	define('SERVER_ID', 'myid');
	define('SERVER_PASSWORD', 'mypassword');
 
	define('REMOTE_ROOT', '/usr/shared/nginx');
	define('REMOTE_WWW', 'www');
});
 
 
task('connect', '서버에 접속합니다.', function() {
	connect( SERVER_HOST, SERVER_ID, SERVER_PASSWORD );
});
 
task('upload', "서버에 파일을 업로드 합니다.", function() {
 
	cd( REMOTE_ROOT );
 
	run('rm -rf '.BUILD_NAME);
	upload( LOCAL_ROOT, REMOTE_ROOT.'/'.BUILD_NAME );
 
	run('rm '.REMOTE_WWW);
	run('ln -s '.BUILD_NAME.' '.REMOTE_WWW);
});
 
task('master-deploy', '마스터 서버에 배포합니다.', ['init-master', 'connect', 'upload']);
 
start();
```

간단히 소스를 설명하자면, 일단 Composer기반이라서 autoload를 불러옵니다. 그리고 처음에 `deployer()`, 마지막에 `start()`를 반드시 넣어주어야 합니다.

중간에 `ignore(array(..))`는 업로드할 때 무시할 파일들을 지정합니다.

그리고 Deployer는 여타 배포툴과 비슷하게 태스크로 구성되어있습니다. 여기 예제에서는 서버에서 사용할 상수 선언, 서버접속, 파일 업로드로 구성해서 사용합니다. 이 예제에서는 `init-master`만 있지만 실제 사용하는 환경에서는 서버별로 이름을 구성(`init-server1`, `init-server2`.. 등등)해서 사용합니다. 

`BUILD_NAME`이라는 상수는 현재 시간을 기준으로 빌드이름을 정합니다. 그리고 `upload`라는 태스크에서 같은 시간내에 중복된 폴더가 있을 때를 대비해서 삭제하고, 파일을 업로드 합니다. 그리고 업로드가 종료 된 후 심볼릭 링크로 해당 폴더를 연결합니다. 심볼릭 링크를 사용하는 이유는 지금 배포한 프로젝트가 잘못되었을 때, 바로 롤백을 하기 위해서입니다.

그리고 `master-deploy`는 위에 만들어 놓은 과정을 순서대로 수행합니다.


```prettyprint lang-sh
$ php deployer.php
```

![](/content/images/2014/Jun/_____2014_06_12____2_00_40.png)

위와 같이 지정한 태스크에 대해 설명이 나옵니다. `master-deploy`를 실행하면 뭔가 진행이 될것 같습니다. 바로 실행해봅시다.

```prettyprint lang-sh
$ php deployer.php master-deploy
```

![](/content/images/2014/Jun/2014_06_12_14_12_30.gif)

위의 예제에서는 폴더이름이랑 설정이 살짝 다르지만, 대충 저런 느낌으로 작동하며 작성한 파일이 성공적으로 서버에 업로드 될 것입니다.


- 뒷 이야기는 [Deployer:PHP로 배포하기(2).](http://blog.wani.kr/deployer-php%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-2)에서..

## 참고자료

- [Deployer - Deployment Tool for PHP](http://deployer.in" target="_blank)

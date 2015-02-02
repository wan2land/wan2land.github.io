---
layout: post
title: 'Deployer : PHP로 배포하기(2).'
date: 2014-06-12 14:42:40.000000000 +09:00
---
[Deploy:PHP로 배포하기(1).](http://blog.wani.kr/deployer-php%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-1)에서는 전반적으로 Deployer를 사용하는 방법에 다루었습니다.

이번 **Deployer:PHP로 배포하기(2)**에서는 Deployer의 단점과 그 부분을 해소할 수 있는 방법에 대해 소개하고자 합니다.

## 해결하고자 하는 문제점

그 전에 [Composer Global로 사용하기.](http://blog.wani.kr/composer-global%EB%A1%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)라는 포스팅을 다루었던 적이 있습니다. 이와 함께 생각해보면 `Deployer`는 `bin`를 제공해주지 않기 때문에 매번 프로젝트를 생성할때마다 포함시켜주어야 하는 문제가 발생합니다.

그래서, 이를 해결해보고자 `Deployer`를 Global 프로그램으로 바꾸는 팁을 제공하고자 합니다.

## 해결법

이전 [Composer Global로 사용하기.](http://blog.wani.kr/composer-global%EB%A1%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)라는 글을 읽어보면서 그대로 수행했으면 문제가 없습니다. 그치만 다시한번 이 부분은 자세히 설명드리겠습니다.

지난 글에서 `.bash_profile`(또는 `.bashrc`)파일안에 두줄의 스크립트를 넣었습니다.

```prettyprint lang-sh
export PATH="~/.composer/vendor/bin:$PATH"
export PATH="~/.composer/bin:$PATH"
```

첫번째 줄은 `vendor/bin`에 있는 녀석이니까 당연한거지만 두번째 줄은 생성도 되어있지 않은 폴더인데 왜 PATH로 지정하는지 의문이 생겼을 겁니다. 바로 오늘같은 날을 위해서입니다. [Packagist](https://packagist.org" target="_blank)에는 굉장히 유용한 도구들이 많습니다. 그치만 Global로 사용하면 좋은 도구임에도 불구하고 `vendor/bin`을 제공하지 않는 도구들이 많습니다. 그래서 이런 도구들중 자주 사용하는 녀석들을 우리가 만들어보자는 의미입니다.

```prettyprint lang-sh
$ cd ~/.composer
$ mkdir bin
```

Composer Global 폴더에 `bin`폴더를 하나 생성합니다. 철저히 OSX기준이기 때문에 리눅스 사용자나 윈도우 사용자분들은 한번 확인해보시는게 좋을 것 같습니다.

```prettyprint lang-sh
$ cd ~/.composer/bin
$ vi deployer
```

그리고 그 `bin`폴더 내부에 `deployer`라는 파일을 생성합니다.

```prettyprint lang-php linenums
#!/usr/bin/env php
<?php
echo "Load Deploy :)\n---------------------------------------\n";
 
require __DIR__.'/../vendor/autoload.php';
 
deployer();
 
$file_path = $_SERVER['PWD'].'/deployer.php';
if ( file_exists( $file_path ) ) {
	require $file_path;
	start();
}
else {
	echo "\"deployer.php\" 파일이 없습니다.\n";
}
```

내용은 다음과 같이 작성하면 되겠네요.

```prettyprint lang-sh
$ cd ~/.composer/bin
$ chmod +x deployer
```

그리고 잊지말고 실행권한을 주어야 합니다. 그래야 실행이 됩니다.


## 사용하기

```prettyprint lang-php linenums
<?php
 
// Global Deployer Example
 
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
```

이제 내가 사용할 프로젝트에 deployer.php라는 파일을 추가해줍니다. 이전 포스팅과 비교해서 보시면 어느부분이 바뀌었는지 알 수 있습니다. 그전에는 위에 autoload관련 소스와, `deployer()`, `start()`가 들어갔었지만 이제는 상수선언과 `task()`로만 내용을 구성할 수 있게 되었습니다. 

```prettyprint lang-sh
$ deployer master-deploy
```

실행을 해보시면 자연스럽게 작동할 것입니다.

![](/content/images/2014/Jun/2014_06_12_15_19_22.gif)

역시 위에서 우리가 만들어 놓은 `deployer`라는 파일도 자동완성이 됩니다.

그리고 이전에 각 프로젝트마다 Deployer를 사용할 경우에는 `vendor`를 업로드 할때 사용하지 않는 수많은 파일들이 함께 올라갔지만 여기서는 Deployer와 관련이 없는 내용은 일체 올라가지 않는 다는 장점이 있습니다. :)

그리고 오늘 이 예제를 조금만 응용하시면 PHP와 Composer를 활용한 cli도구를 만들 수 있을 것 같습니다. 이 부분은 나중에 정리해서 올리도록 하겠습니다.

## 참고자료

- [PHP, 명령줄에서 PHP사용하기](http://php.net/manual/kr/features.commandline.php" target="_blank)
- [Deployer - Deployment Tool for PHP](http://deployer.in" target="_blank)
- [Composer](https://getcomposer.org" target="_blank)

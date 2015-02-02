---
layout: post
title: Alias PHP Built-in Server
date: 2014-10-10 11:47:44.000000000 +09:00
---
웹을 자주 개발하면서 테스트용으로 **PHP built-in Server**(이하 빌트인서버)를 사용하는 일이 많습니다.

빌트인서버의 이점은 PHP를 여러개 깔아놓고 Brew로 스위치하면서 여러가지 버전을 확인할 수 있다는 점, Apache나 Nginx를 같이 사용한다면 해당 설정의 Rewrite도 살짝 만져야 하는 번거로움이 없다는 점, 항상 테스트 주소를 **/**를 루트로 사용할 수 있다는 점 등이 있습니다.

그래서 매번 터미널에 하나 띄워놓고 프로젝트를 실행합니다.

```prettyprint lang-sh
$ php -S 0.0.0.0:8001
```

저 명령어 자체의 자세한 설명은 [PHP Built-in Web Server](http://php.net/manual/en/features.commandline.webserver.php" target="_blank)항목에 가서 읽도록 합시다.

또한 Github에서 새로 복사해온 프로젝트를 테스트로 실행하기도 좋습니다. 프론트앤드 프로젝트도 사용하기 너무 좋죠.

근데 단 하나의 문제가 있다면 명령어가 너무나 길다는 것! 사실 이 부분은 너무나 자연스럽게 타이핑 하던 것이라 불편함을 느끼지 않았다는 것입니다. 그러던 중 구독하던 어떤 블로그에서 다음과 같이 사용하는 것을 보고 충격을 먹었습니다.

`.bash_profile` (맥기준)에 추가하시면 됩니다.

```prettyprint lang-bash linenums
alias phps='php -S 0.0.0.0:8888'
```

이걸 보는 순간 그동안 저렇게 길게 사용해왔으면서도 불편함을 몰랐던 제 자신에게 충격이 있었습니다. 어쩌면 우리가 반복적으로 당연히 행하던 행동들 사이에 불편함이 존재하고 있을지도 모르는 것입니다. (반성)

한번에 여러개의 테스트 서버를 띄워놓고 개발하는 저에게 8888 하나로는 큰 의미가 없어 `bash script`를 좀더 개선해보았습니다.

```prettyprint lang-bash linenums
openPhpTestServer() {
	if [[ -z "$1" ]]
	then
		php -S 0.0.0.0:8000
	else
		php -S 0.0.0.0:$1
	fi
}
alias phps=openPhpTestServer
```

다음과 같이 사용할 수 있습니다.

```prettyprint lang-sh
$ phps
```

```prettyprint lang-sh
$ phps 8001
```

위의 형태의 경우는 기본 값으로 지정된 8000번 포트를 사용합니다. 아래의 경우는 지정된 포트를 열 수 있습니다.

## 참고자료
- [Akrabat.com, Alias For The PHP built-in Server](http://akrabat.com/php/alias-for-the-php-built-in-server" target="_blank)

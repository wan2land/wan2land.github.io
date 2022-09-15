---
layout: post
title: "Node.js에서 Github oAuth에 접근해보자 (1)."
date: 2015-02-11 16:58:46 +09:00
tags: ["javascript", "nodejs", "oauth"]
---

Github API를 이용하는 프로그램을 만들일이 생겼습니다. 예전에 Facebook API를 이용한 웹사이트를 만들어본적은 있었는데 Github API는 또 처음이라 간단히 몇가지 실험을 해볼 필요가 있었습니다.

우선 해당 실험을 진행한 이유에는 몇가지 이유가 있었습니다.

1. 일반적인 웹사이트의 경우 oAuth가 특정 URL을 통과해서 시작합니다. 그러나 웹사이트가 아닌 일반적인 프로그램의 경우는 그러한 과정이 없습니다.
2. 전체 인증과정의 이해를 위해 단순한 코드를 먼저 작성해봐야 합니다.

그리고 평상시대로라면 이 과정을 `PHP`를 통해 했었겠지만.. 이번에는 왠지 `Node.js`(이하 노드)로 진행해보고 싶었습니다. `PHP`에서는 `curl`을 사용해야 하는데,  노드에서는 직접 HTTP Request를 생성할 수 있어서 요즘 공부하는 내용을 실험하기에도 굉장히 좋았기 때문입니다.

## 간단한 HTTP Request 이해용 프로그램

전체 테스트를 진행하기에 앞서 Node의 HTTP Request가 어떤식으로 동작하는지 이해할 필요가 있습니다. 해당 내용을 안다면 다음 내용을 건너띄어도 됩니다. :)

### 서버용 프로그램 `server.js`

Request가 어떻게 들어오는지 관찰 할 수 있는 서버 프로그램입니다. 하는일은 단순합니다. 특정 리퀘스트가 들어오면 리퀘스트의 정보를 뿌려주고 "Hello Server"라는 내용을 단순히 보내주는 프로그램입니다.

```javascript
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log(request.headers);
    console.log(request.method);
    console.log(request.url);
    console.log(request.httpVersion);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello Server');
    response.end();
});

server.listen(8080);
```

### 클라이언트 프로그램 `client-sample.js`

이녀석은 위에 만들어 놓은 서버에 제대로 데이터가 전송되는지 확인하는 테스트용 파일입니다.

```javascript
var http = require('http');

var request = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/foo/bar',
    method: 'POST',
    headers: {
        'User-Agent' : 'Node Tester/0.0.1',
        'Content-Type' : 'application/json'
    }
}, function(response) {
    var body = "";
    response.on('data', function(contents) {
        body += contents;
    });
    response.on('end', function() {
        console.log(response.statusCode);
        console.log(body.toString());
    });
});

request.on('error', function(e) {
    console.log("Error!", e.message);
});

request.write(JSON.stringify({
    "text1": "text1",
    "text2": "text2"
}));
request.end();
```

이렇게 엄청 단순한 파일 2개를 만들고 쉘에서 서버를 켜놓고(`node server`) 클라이언트를 실행해서 신호를 보냅(`node client-sample`)니다.

### 서버쪽에서 출력되는 내용

```bash
node server
```

```
{ 'user-agent': 'Node Tester/0.0.1',
  'content-type': 'application/json',
  host: 'localhost:8080',
  connection: 'keep-alive',
  'transfer-encoding': 'chunked' }
POST
/foo/bar
1.1
```

### 클라이언트 쪽에서 출력되는 내용

```bash
node client-sample
```

```
200
Hello Server
```

간단한 소스를 통해 대충 위와 같은 메시지를 얻을 수 있었습니다. 이제 이 둘 소스를 활용해서 Github에 접근해봅시다.

## Github oAuth 인증하기

<https://developer.github.com/v3/oauth/>

위 사이트를 방문하면 간단히 어떤 방식을 통해 인증할 수 있는지 이야기가 나옵니다. 웹 어플리케이션이라면 [Web Application Flow](https://developer.github.com/v3/oauth/#web-application-flow)를 따라하면 쉽게 적용할 수 있습니다. 그러나 저는 [Non-Web Application Flow](https://developer.github.com/v3/oauth/#non-web-application-flow)를 따라서 진행을 할 필요가 있었습니다.

엄청 짧게 나와있습니다. 간단하게 [Basic Authentication](https://developer.github.com/v3/auth/#basic-authentication)를 이용하라는 것인데.. cURL로 나와있는데 저는 cURL이 그저 웹사이트 긁어노는 것인줄만 알았지 저런 인증체계가 있는지도 몰랐습니다. ~~(여러분 기초 공부가 부족하면 이렇게 사람이 멍청할 수 있습니다.)~~ 터미널에서 쳤을때는 뭔가 휘적휘적 나왔습니다. 이걸 어떻게 노드에 적용할지가 관건이었습니다.

그러나.. 생각보다 쉽게 해결되었습니다. 노드의 https.request 옵션중에 `auth`를 지원하고 있었습니다. ([참고링크](http://nodejs.org/api/https.html#https_https_request_options_callback)) 

위에서 작성한 `client-sample.js`를 Github API 인증항목의 [Via Username and Password](https://developer.github.com/v3/auth/#via-username-and-password)에 맞춰서 조금 수정했습니다.

### Github 단순 인증 프로그램 `client-github-oauth1.js`

```javascript
var https = require('https'); // http를 https로 고쳤습니다.

var request = https.request({
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    auth: 'wan2land:******', // ****에는 여러분들의 비밀번호를 넣습니다.
    headers: {
        'User-Agent' : 'Node Tester/0.0.1',
        'Content-Type' : 'application/json'
    }
}, function(response) {
    var body = "";
    response.on('data', function(contents) {
        body += contents;
    });
    response.on('end', function() {
        console.log(response.statusCode);
        console.log(JSON.parse(body.toString())); // JSON 파싱을 추가했습니다.
    });
});

request.on('error', function(e) {
    console.log("Error!", e.message);
});
request.end();
```

그리고 실행하면 다음과 같은 화면을 볼 수 있습니다.

![github oauth success](/images/2015/2015-02-11-github-oauth-via-node-1/github-oauth-success.png)

물론, 로그인 정보가 잘못되었다면 다음과 같이 출력됩니다.

![github oauth fail](/images/2015/2015-02-11-github-oauth-via-node-1/github-oauth-fail.png)

어떤 방식으로 인증하는지 궁금해서 제가 켜놓은 서버(`server.js`)로 실행해봤습니다. 그럼 다음과 같은 메시지를 확인할 수 있습니다.

```
{ 'user-agent': 'Node Tester/0.0.1',
  'content-type': 'application/json',
  host: 'localhost:8080',
  authorization: 'Basic d2FuMmxhbmQ6dGVzdHBhc3N3b3Jk',
  connection: 'keep-alive' }
GET
/user
1.1
```

헤더에 `authorization`이라는 항목에 내용이 추가되는 것을 볼 수 있습니다. 그리고 뒤에 알수없는 글자는 제 아이디와 비밀번호 정보를 `base64`로 인코딩 한것임을 알 수 있습니다. 무슨내용인지 궁금해서 디코딩 해보았습니다. (<https://www.base64decode.org>를 사용했습니다.)

![Auth Base64 Decode](/images/2015/2015-02-11-github-oauth-via-node-1/auth-base64-decode.png)

단순히 `id:password`를 `base64`로 인코딩한 텍스트였습니다. 지금 사용중인 노드에서처럼 `auth`라는 옵션을 지원하지 않더라도 이후에 다른 프로그래밍언어에서 직접 코딩해서 사용할 수 있을 것 같았습니다. :)

## 마무리

일단 여기까지의 내용을 통해 Github API에서 제공하는 모든 페이지에 접근할 수 있게 되었습니다. 하지만 매번 id, password를 보내는 것은 보안적으로 좋은 방식이 아닙니다. 다음 포스팅에서는 Github App을 생성해서 해당 앱을 통해 토큰을 받아오고 토큰을 통한 인증을 진행하도록 하겠습니다. :-)


## 참고자료

- <https://www.base64decode.org>
- <https://developer.github.com/v3/auth>
- <http://nodejs.org/api/https.html>

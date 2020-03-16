---
layout: post
title: "Measurement Protocol을 이용하여 Google Analytics 적용하기 (feat. Lambda)"
summary: "Google Analytics를 설치할 땐, 프론트엔드에 제공된 스크립트를 입력합니다. 프론트엔드가 없어서 서버사이드에서 직접 Google Analytics를 실행하는 방법인 Measurement Protocol에 대해 이야기합니다."
date: 2020-03-16 22:35:06 +09:00
tags: ["googleanalytics", "measurementprotocol", "serverless", "awslambda", "javascript"]
---

취미로 [corgi.photos](https://corgi.photos)라는 사이트를 운영중입니다.

![corgi.photos](/images/2020/200316-corgiphotos.png)

간단한 목업용 이미지 사이트입니다. URL에 이미지 사이즈 형식이 포함되어있고, 이 URL로 요청을 하면 이미지로 응답을 반환합니다.

일반적으로 Google Analytics(이하 GA)를 설치할 땐, 프론트엔드에 구글에서 제공된 스크립트를 입력합니다. 이 스크립트를 실행하려면 아무래도 Javascript를 실행할 수 있는 환경이 필요합니다. 그런데 이 목업용 사이트는 이미지로 응답(`image/jpg`)하기 때문에 스크립트를 입력하는 방식으로는 GA를 설치할 수 없습니다.

찾아보니 GA에서 API(Measurement Protocol)를 제공하고 있었습니다. [가이드 문서](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide)에서 **Page Tracking** 부분을 참고하였습니다. [Axios](https://github.com/axios/axios)를 사용하여 코드를 작성하였습니다. 이 API에 본문은 `x-www-form-urlencoded` 형식으로 전달해야합니다.

```js
const axios = require('axios')
const qs = require('querystring')

axios.post('http://www.google-analytics.com/collect', qs.stringify({
  v: 1,
  tid: 'UA-XXX',
  cid: clientId, // 사용자 Client ID, 랜덤한 키값을 사용하였습니다.

  t: 'pageview',
  dh: 'corgi.photos', // 프로토콜을 제외한 도메인 부분만 전달합니다.
  dp: '/something/something?foo=1', // Path의 전체를 전달합니다. Query String이 있는 경우 뒷 부분 모두를 전달합니다.
}))
```

이렇게 작성하고 Node로 실행하였습니다. Google Analytics 실시간 페이지에 들어가면 다음과 같이 접속 로그가 입력된 것을 확인할 수 있습니다.

![Google Analytics](/images/2020/200316-ga-realtime.png)

위 코드에서는 단순히 페이지의 Path만을 전달하였습니다. 실제 GA를 활용하려면 URL 뿐 아니라 다른 정보들도 수집해야합니다. 브라우저 환경이나, 이 페이지를 어디서 요청하였는지 등을 예로 들 수 있습니다. GA에서 사용가능한 변수는 [이 문서](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters)에서 확인할 수 있습니다.

위 문서를 바탕으로 우리가 추가할 내용은 다음과 같습니다.

- `dr` - Document Referrer, 이미지를 어떤 사이트에서 불러오는지 알 수 있습니다.
- `ua` - User Agent
- `ul` - User Language
- `uip` - IP, IP를 통해 접속 지역을 유추할 수 있습니다.

위 내용들은 HTTP Header를 파싱해서 얻을 수 있습니다. 해당 서비스는 Lambda위에서 동작하고 있으며, Lambda의 Request정보는 `event` 변수안에 들어있습니다. `event.headers` 안에 헤더값이 들어오는데, 대소문자가 섞여서 들어옵니다. 헤더 이름을 전부 소문자로 변경합니다.

```js
async function handler(event) {

  /* ... */
  const headers = Object.entries(event.headers || {})
    .map(([key, value]) => [key.toLowerCase(), value])
    .reduce((carry, [key, value]) => (carry[key] = value, carry), {})

  /* ... */
}
```

그리고 이 헤더값을 활용해서 필요한 형태로 가공합니다.

```js
async function handler(event) {

  /* ... */
  const headers = Object.entries(event.headers || {})
    .map(([key, value]) => [key.toLowerCase(), value])
    .reduce((carry, [key, value]) => (carry[key] = value, carry), {})

  await axios.post('http://www.google-analytics.com/collect', qs.stringify({
    v: 1,
    tid: 'UA-151383765-1',
    cid: uuid(), // Client ID는 그냥 랜덤으로 생성합니다.

    t: 'pageview',
    dr: headers.referer,
    dh: headers.host || 'corgi.photos', // 도메인을 바로 사용해도 되지만, 헤더에서 오는 Host값을 우선순위로 사용합니다.
    dp: (event.path || '/') + (Object.keys(event.queryStringParameters || {}).length ? `?${qs.stringify(event.queryStringParameters)}` : ''), // 쿼리스트링을 포함한 전체경로
    dt: 'Corgi Photo',

    ua: headers['user-agent'],
    ul: (headers['accept-language'] || '').split(',').filter(n => n)[0], // `Accept-Language` 헤더의 첫번째 정보를 Language로 전달
    uip: (headers['x-forwarded-for'] || '').split(',').map(n => n.trim()).filter(n => n)[0], // `X-Forwarded-For` 헤더의 첫번째 정보를 IP로 전달
  }))

  /* ... */
}

```

위와 같이 작성해서 서버에 배포하고 테스트해보니, 데이터가 제대로 들어왔습니다. 이미지를 하나씩 불러왔을 때는 문제가 없었습니다. 실제 목업이미지를 사용할 땐 이미지를 하나씩 불러오지말고 한 페이지내에 여러개의 이미지를 동시에 불러오게 됩니다. [corgi.photos 메인화면](https://corgi.photos)을 생각하면 이해하기 쉽습니다. 이 화면에 접속하게 되면 동시에 이미지 16개를 불러옵니다. 이런식으로 동시에 이미지를 불러오니 GA에 데이터가 엉망으로 들어오기 시작했습니다. GA에서는 이 16개의 이미지 리퀘스트를 모두 다른 사용자로 인식해버렸습니다. GA를 프론트엔드에서 실행할 때는 `cid`를 쿠키로 처리하는 로직이 포함되어있습니다. 위 소스코드를 보면 `cid` 부분을 랜덤한 키로 작성한 것을 볼 수 있습니다. 그래서 매 리퀘스트마다 전부 다른 사용자로 인식하는 문제가 발생하였습니다. 프론트와 마찬가지로 쿠키로 처리하려고 해도, 이미지는 동시에 병렬로 요청하기 때문에 모든 이미지의 첫번째 요청은 다른사용자로 인식해버리기는 마찬가지였습니다.

이 부분은 기존의 fingerprinting 기법을 활용하기로 하였습니다. 브라우저가 같고, 사용하는 언어가 같고, 설정된 쿠키값(우리가 설정하지 않은)이 같다면 같은 사용자라고 봐도 무방합니다. 아주 정교하게 사용자를 구분할 목적이 아니기 때문에 이 정도로도 충분합니다. 이 정보는 모두 헤더에서 얻을 수 있으며, 이 값을 해싱처리해서 Client ID를 얻을 수 있습니다. 코드를 다음과 같이 개선하였습니다.

```js
const fingerprint = [
  headers['user-agent'],
  headers['cookie'],
  headers['accept-encoding'],
  headers['accept-language'],
].join('__')
const clientId = crypto.createHash('sha256').update(fingerprint).digest('hex')

await axios.post('http://www.google-analytics.com/collect', qs.stringify({
  /* 생략 */
  cid: clientId,
  /* 생략 */
})
```

실제 서비스에서 동작하고있는 코드는 [Github corgi.photos 저장소](https://github.com/wan2land/corgi.photos/blob/master/photo.js)에서 확인할 수 있습니다. :-)

## 참고문서

- [GA Measurement Protocol Guide](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide)
- [GA Measurement Protocol Parameter Reference](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters)

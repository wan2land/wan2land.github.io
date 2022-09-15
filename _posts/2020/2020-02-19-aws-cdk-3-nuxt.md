---
layout: "post-aws-cdk"
chapter: "3"
title: "AWS CDK로 서버없이 서비스 운영해보기 (3) - Nuxt"
summary: "AWS CDK를 이용하여 Lambda위에 Vue.js 프레임워크인 Nuxt를 올려봅시다."
date: 2020-02-19 23:12:55 +09:00
tags: ["awscdk", "serverless", "vue", "nuxt", "typescript", "infrastructure"]
---

AWS Lambda위에 AWS CDK를 이용하여 Vue.js 프레임워크인 Nuxt를 올려보도록 하겠습니다. 저는 Vue.js를 주로 사용하기 때문에 Nuxt를 이용하여 Lambda에 올려보았지만,  원리만 이해한다면 Next나, Sapper 프로젝트도 적용가능하지 않을까 생각해봅니다. :-)

Nuxt는 Vue.js를 기반으로 만들어진 SSR 프레임워크입니다. 서버쪽 렌더링을 필요로 하기 때문에 Lambda위에 올려야 합니다. SSR이 필요없다면 굳이 Lambda위에 올리지 않아도 정적 파일 호스팅을 이용하면 더 쉽게 서버환경 구축이 가능합니다.

일단, 공식문서를 따라서 Nuxt를 설치해봅시다.

```bash
npx create-nuxt-app sample-nuxt-app
```

기본적으로 `create-nuxt-app`을 물어보면 여러가지 설정을 물어보는데, 전부 기본값으로 설정하였고, 패키지 매니저만 `npm`을 선택하였습니다. 설정의 자세한 내역은 다음과 같습니다. (전부 엔터 눌러서 빨리 지나갑니다.)

![Install Nuxt](/images/2020/200218-install-nuxt.svg)

다 설치했으면 일단 한번 실행해봅시다.

```bash
npm run dev
```

![Success](/images/2020/200218-sample-nuxt-app.png)

잘 실행됩니다. (뿌듯)

실서버(일반적인 리눅스 환경)에서 Nuxt를 운영할 땐 빌드 (`npm run build`)하고, 서버를 시작(`npm run start`)합니다. Nuxt 이 실행되면 Http 서버가 실행되고, 이 서버가 HTTP 리퀘스트를 처리합니다.

AWS Lambda 환경은 조금 다릅니다. AWS Lambda는 모든 요청이 함수를 통해서 실행됩니다. HTTP 요청은 API Gateway를 거쳐서 Lambda 함수를 실행합니다. 지난번 예시에서 Lambda위에 [Express](https://expressjs.com) 앱을 동작시켰었습니다. 근데 Nuxt 가이드에 보면 Express를 통해 서버를 실행할 수 있다고 합니다. 이 과정을 통해 Lambda위에 Nuxt를 실행할 수 있습니다.

즉, HTTP 요청(API Gateway) -> Labmda 함수 -> AWS Serverless Express -> Express -> Nuxt 순으로 실행되는 것이지요.

이 작업을 전부 구현하면 재미있겠지만, 이미 관련 라이브러리([Serverless Nuxt](https://github.com/wan2land/serverless-nuxt))가 있습니다. ~~이렇게 좋은 라이브러리를 누가 만들었는지..~~ 기존에 [Serverless Framework](https://serverless.com) 용도로 제작된 라이브러리인데, Serverless Framework가 AWS Lambda를 사용해서 동작됩니다. 즉, 이 라이브러리를 AWS CDK 환경에서도 사용가능하도록 적용해보도록 하겠습니다.

일단, 설치가이드에서 시키는대로 라이브러리를 설치합니다.

```bash
npm install serverless-nuxt
npm install nuxt-start
npm install nuxt -D
```

그리고 Lambda 핸들러(`handler.js`)를 다음과 같이 작성합니다.

```js
const { createNuxtApp } = require("serverless-nuxt")
const config = require("./nuxt.config.js")

module.exports.render = createNuxtApp(config)
```

Nuxt Config 파일(`nuxt.config.js`)을 불러오는 부분이 있는데, `create-nuxt-app`을 통해 자동생성된 Config 파일은 Node.js에서 바로 불러올 수 없는 형태입니다. Nuxt가 실행되면 Babel을 거쳐 Config를 읽어오기 때문입니다. Node.js 환경에서 불러올 수 있도록, 맨 처음 한줄(`export default = {`)을 다음과 같이 수정합니다. 이렇게 변경해도 Nuxt를 개발환경(`npm run dev`)으로 실행하는데 문제가 없습니다.

```js
module.exports = {
  ...
}
```

Nuxt쪽에서 해야할일은 다 끝났고, 이 소스를 배포하기 위해 AWS CDK 환경을 구성해보겠습니다. AWS CDK와 함께 추가로 필요한 관련 패키지들도 한번에 설치합니다.

```bash
npm install aws-cdk -D
npm install @aws-cdk/core @aws-cdk/aws-lambda @aws-cdk/aws-apigateway -D
```

1, 2편에서는 AWS CDK 관련 소스를 Babel을 이용하여 Typescript를 빌드하였지만, Nuxt의 경우 `babel`을 내장하고 있습니다. 자칫 잘못하면 패키지 의존관계가 꼬일 수 있기 때문에 여기서는 Typescript만 사용하여 빌드하도록 하겠습니다.

```bash
npm install typescript -D
npm install @types/node -D
```

`tsconfig.json` 파일은 다음과 같이 설정합니다. 빌드할 소스(`infra/**/*`)와 생성될 경로(`dist-infra`)를 꼭 포함시켜줍니다.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "moduleResolution": "node",
    "pretty": true,
    "strict": true,
    "esModuleInterop": true,
    "noImplicitReturns": true,
    "outDir": "dist-infra"
  },
  "include": [
    "infra/**/*"
  ]
}
```

`infra/entry.ts` 파일은 다음과 같이 작성합니다.

```ts
#!/usr/bin/env node

import { App } from '@aws-cdk/core'

import { NuxtStack } from './nuxt-stack'

const app = new App()

new NuxtStack(app, 'WaniSampleNuxtStack')
```

`infra/nuxt-stack.ts` 파일도 다음과 같이 작성하며, Labmda로 사용할 소스 코드의 경로는 `dist`로 설정합니다.

```ts
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { Code, Function as LFunction, Runtime } from '@aws-cdk/aws-lambda'
import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { join } from 'path'

export class NuxtStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const code = Code.fromAsset(join(__dirname, '../dist'))

    new LambdaRestApi(this, 'SampleNuxt', {
      handler: new LFunction(this, 'HomeHandler', {
        runtime: Runtime.NODEJS_12_X,
        code,
        handler: 'handler.render',
      }),
    })
  }
}
```

그리고 `package.json` 파일의 스크립트 영역에 불필요한 스크립트를 지우고, Infra 빌드 스크립트를 작성합니다.

```json
{
  ...
  "scripts": {
    "dev": "nuxt",
    "build:infra": "tsc",
    "build:nuxt": "nuxt build"
  },
  ...
}
```

AWS CDK 실행을 위해 `cdk.json` 파일을 추가합니다.

```json
{
  "app": "node dist-infra/entry"
}
```

AWS Lambda에서 Nuxt 앱을 실행하려면 빌드된 소스파일이 필요합니다. 다음 명령어를 통해 빌드할 수 있습니다.

```bash
npm run build:nuxt
```

빌드 후에 `.nuxt` 디렉토리 하위에 파일들이 생성됩니다. 이 디렉토리를 AWS Lambda에 업로드 하게 되면 Nuxt가 동작하게 됩니다. Infra 쪽 코드를 보면 앱 소스 코드 경로를 `dist` 디렉토리로 잡아두었습니다. Lambda에 배포할 파일들과 모듈들을 해당 경로에 복사하기 위해서 `distize`라는 라이브러리를 사용합니다.

```bash
npm install distize -D
```

`dist` 디렉토리에 `.nuxt`, `handler.js`, `nuxt.config.js` 파일을 복사합니다. 이를 스크립트로 작성하면 다음(`deploy` 참고)과 같습니다.

```json
{
  ...
  "scripts": {
    "dev": "nuxt",
    "build": "npm run build:infra && npm run build:nuxt",
    "build:infra": "tsc",
    "build:nuxt": "nuxt build",
    "deploy": "npm run build && distize .nuxt handler.js nuxt.config.js && cdk deploy"
  },
  ...
}
```

배포해봅시다.

```bash
npm run deploy
```

배포후에 `xxxxx.execute-api.ap-northeast-2.amazonaws.com/prod/` 와 같은 형태의 API Gateway URL이 생성됩니다. 접속해보면 Nuxt로 만든 페이지가 출력됩니다. 하지만 개발자도구에 들어가보면 모든 Static 파일들이 정상적으로 불러와지지 않습니다.

![Static File Error](/images/2020/200218-static-error.png)

Nuxt에서 빌드할 때, 모든 파일경로는 루트(`/`)를 기준으로 설정됩니다. 하지만, API Gateway에서는 `/prod`라는 스테이지 값을 prefix로 설정하게 됩니다. 자바스크립트 파일 경로를 예로 들면, 실제 자바스크립트 파일은 `https://xxxxx.execute-api.ap-northeast-2.amazonaws.com/prod/_nuxt/f7d305921b9f7fd593a8.js` 경로에 있지만, Nuxt는 `https://xxxxx.execute-api.ap-northeast-2.amazonaws.com/_nuxt/f7d305921b9f7fd593a8.js`로 요청하게 됩니다. 아쉽게도 Nuxt 빌드 스크립트 쪽에 이와 관련된 옵션은 제공하지 않습니다. 하지만, 실제 앱을 서비스 할땐, API Gateway에서 자동생성된 URL을 사용하지 않습니다. 도메인을 연결하게 되는데, 이 문제는 도메인을 연결하는 해결됩니다.


## 도메인 연결하기

이 도메인을 연결하는 과정도 AWS CDK로 작성하면 좋겠지만, 도메인 하나에 여러가지 서비스가 운영중이라 이 과정은 AWS Web Console을 통해 설명하곘습니다. 일단 ACM(AWS Certificate Manager)서비스 관리자에 들어갑니다. API Gateway를 최적화된 엣지로 연결하려고 합니다. 이를 위해서는 인증서를 미국 동부(버지니아 북부, us-east-1)에 발급 받아야 합니다. 인증서 요청을 누른 후, 인증서를 발급 받습니다.

![ACM](/images/2020/200218-acm.png)

APIGateway에 ACM을 연결하기 위해서 관련 AWS CDK 패키지를 설치합니다.

```bash
npm i @aws-cdk/aws-certificatemanager -D
```

`entry/nuxt-stack.ts` 파일에 다음과 같이 발급받은 인증서를 ARN 경로를 이용하여 연결합니다. 제 도메인은 `nuxtsample.dist.be` 입니다. 이 부분에 본인이 사용할 도메인을 집어넣어주시면 됩니다. 그리고 `arn:aws:acm:us-east-1:xxxxxxxxxx:certificate/xxxxxxxxxxxxxx` 부분에는 위 스크린샷에서 ARN(모자이크 처리 된 부분)을 통째로 복사해서 집어넣어줍니다.

```ts
import { EndpointType, LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { Code, Function as LFunction, Runtime } from '@aws-cdk/aws-lambda'
import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { join } from 'path'

export class NuxtStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const code = Code.fromAsset(join(__dirname, '../dist'))

    new LambdaRestApi(this, 'SampleNuxt', {
      domainName: {
        endpointType: EndpointType.EDGE,
        domainName: 'nuxtsample.dist.be',
        certificate: Certificate.fromCertificateArn(this, 'Certificate', 'arn:aws:acm:us-east-1:xxxxxxxxxx:certificate/xxxxxxxxxxxxxx'),
      },
      handler: new LFunction(this, 'HomeHandler', {
        runtime: Runtime.NODEJS_12_X,
        code,
        handler: 'handler.render',
      }),
    })
  }
}
```

그리고 다시 서버에 적용합니다.

```bash
npm run deploy
```

AWS Console에 들어가서 API Gateway -> "사용자 지정 도메인 이름" 메뉴로 접속하면 다음과 같이 도메인이 설정된 것을 볼 수 있습니다.

![API Gateway Custom Domain](/images/2020/200218-apigateway.png)

여기서 대상 도메인 이름(`dxxxxxxxx.cloudfront.net`)을 복사하여 도메인의 CNAME으로 설정합니다. Route53에서 도메인을 관리하는 경우, A레코드 Alias를 사용하는 것을 권장드립니다.

![Route53](/images/2020/200218-route53.png)

도메인에 연결되기까지 꽤 오랜 시간이 걸립니다. API Gateway 관리자에서 ACM 인증서 적용여부를 확인할 수 있습니다. 조금 기다렸다가, 내가 만든 도메인에 접속해봅시다. 위에 처음에 Nuxt 실행했을 때와 같은 화면이 반겨줄겁니다. :-)

전체 소스코드는 [Github](https://github.com/wan2land/aws-cdk-samples/tree/master/sample-nuxt-app)에 올려두었습니다. 해당 코드로 동작중인 코드는 [nuxtsample.dist.be](https://nuxtsample.dist.be/)에서 확인할 수 있습니다. (언제 내려갈지 모릅니다..)

간단한 웹앱을 돌리는데는 무리가 없습니다만, 최적화 해야할 부분이 많이 남아있습니다. 최적화에 대한 내용은 추후에 (언젠가) 다뤄보겠습니다.

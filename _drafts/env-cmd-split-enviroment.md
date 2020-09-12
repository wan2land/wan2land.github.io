
AWS CDK에서 배포시, 환경분리하는 방법

가장 기본 소스인 https://wani.kr/posts/2020/01/23/aws-cdk-1/ 를 기반으로 이야기해봅시다.

[`env-cmd`](https://www.npmjs.com/package/env-cmd)라는 도구를 이용하여 환경을 분리할 수 있습니다. 환경변수와 관련된 라이브러리를 몇개 사용해봤지만, 다양한 상황에 유연하게 대처가능한 유일한 라이브러리라서, 추천드립니다.

일반적으로 이 환경을 분리하는 이유는 데이터베이스 설정이나, 기타 서비스와 관련된 설정이 분리되기 때문입니다.

```bash
npm i env-cmd -D
```

`.env-cmdrc.js` 파일을 다음과 같은 형태로 작성합니다.

```js
module.exports = {
  dev: {
    STAGE: 'dev',
    NODE_ENV: 'development',
  },
  prod: {
    STAGE: 'prod',
    NODE_ENV: 'production',
  },
}
```

그리고 위 파일은 받드시 `.gitignore`에 추가하시는 것을 잊으시면 안됩니다.

```bash
echo '.env-cmdrc.js' >> .gitignore
```

`package.json` 파일은 다음과 같은 형태로 수정합니다.

```json
{
  "scripts": {
    "build": "npm run build:infra && npm run build:server",
    "build:server": "babel ./src --out-dir ./dist --extensions \".ts\"",
    "build:infra": "babel ./infra --out-dir ./infra-dist --extensions \".ts\"",
    "deploy:dev": "env-cmd -e dev cdk deploy",
    "deploy:prod": "env-cmd -e prod cdk deploy"
  }
}
```

```ts
#!/usr/bin/env node

import { App } from '@aws-cdk/core'

import { CiStack } from './ci-stack'

const app = new App()

const STAGE = process.env.STAGE ?? 'dev'

new CiStack(app, `DatableCiStack-${STAGE}`)
```

```ts
const STAGE = process.env.STAGE ?? 'dev'

export class CiStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const code = Code.fromAsset(join(__dirname, '../dist'))

    const api = new RestApi(this, `CiApi-${STAGE}`, {
      deployOptions: {
        stageName: STAGE,
      },
    })

    api.root.addMethod('GET', new LambdaIntegration(new LFunction(this, 'HomeHandler', {
      runtime: Runtime.NODEJS_12_X,
      code,
      handler: 'entry.handler',
    })))
  }
}
```

Stack 이름 당, 하나의 CloudFormation Stack 이 생성됩니다. 기존의 이름 뒤에 STAGE를 접미사로 붙여서 별도로 관리하게 되었습니다. 기존에 이미 배포된 STack이 있다면 관리자 콘솔에 들어가서 삭제하도록 합니다.


핸들러 코드는 다음고 ㅏ같습니다.

```js
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      ping: 'pong',
      stage: process.env.STAGE || 'unknown',
    }),
  }
}
```

```bash
npm run build && npm run deploy:dev
```

이상태에서 서버로 접속해보면 stage = unknown 으로 출력됩니다.

다음과 같이 람다에 환경변수를 전달해야합니다. 전체를 전달하는 것보다 다음과 같이 필요한 변수만 넘기는 것을 추천드립니다.

```ts
    api.root.addMethod('GET', new LambdaIntegration(new LFunction(this, 'HomeHandler', {
      runtime: Runtime.NODEJS_12_X,
      code,
      handler: 'entry.handler',
      environment: {
        STAGE: process.env.STAGE,
        NODE_ENV: process.env.NODE_ENV,
      },
    })))
```

이상태로 개발환경에서 이상없이 동작하는 것을 확인하였다면 실서버 환경도 쉽게 배포할 수 있습니다.


```bash
npm run deploy:prod
```

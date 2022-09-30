---
layout: post
title: "AWS CDK에서 Terraform으로 이주하기"
date: 2022-09-30 10:01:53 +09:00
tags: ["awscdk", "terraform", "infrastructure"]
thumbnail: "/images/2022/2022-09-30-aws-cdk-to-terraform/thumbnail.png"
---

2018년, 처음 저희 회사에 IaC(Infrastructure as Code)를 도입할 땐 Terraform을 사용 했습니다.(과거 포스팅, [Infrastructure as Code 삽질기](/posts/2018/11/18/infrastructure-as-code/))

이후 2020년쯤(과거 포스팅을 살펴보니), AWS에서 CDK(Cloud Development Kit)라는 인프라 관리 도구가 출시되었습니다. 대부분의 개발자에게 익숙한 Typescript와 Python으로 인프라를 관리할 수 있다는 점을 장점으로 내세웠습니다.
당시 저희회사는 전체 큰 그림은 Terraform을 사용했고, 작은 서비스는 Serverless Framework를 사용하고 있었습니다. Serverless Framework를 사용했기 때문에 CloudFormation에 이미 익숙한 상태였습니다.
인프라 스택을 하나 즉 CloudFormation으로 일원화하고 싶은 욕구가 생겨 CDK를 적극적으로 도입했습니다. ~~그런 짓은 하지 말아야 했는데 난 그 사실을 몰랐어.~~ 그때 당시 CDK와 관련된 포스팅도 여러 차례 올렸습니다. 😅

CDK는 인프라가 복잡해지면 복잡해질수록 사용하기가 어려웠습니다. 결국 Terraform으로 다시 돌아가기로 결정, 그동안 느꼈던 단점에 대해 몇 가지 이야기해보자면,

**1. 참고할 내용이 별로 없다.**

CDK를 도입하면서 가장 힘들었던 점입니다. 애초에 CDK 출시 초기에 도입했기 때문에 어느 정도의 불편함은 감수하고 있었습니다. CDK를 사용하다가 막히면 CloudFormation의 문서를 참고하였고, 이에 대응되는 CDK의 패키지와 객체 이름을 통해 추론하였습니다.
문제는, CloudFormation도 문서가 친절하지 않습니다. Terraform은 자원(Resource, 예, EC2 Instance, S3 Bucket 등) 별로 문서도 잘 정리되어있고 그에 대한 예시도 충분히 제공합니다. 스택오버플로우는 말할 것도 없지요.

**2. 상태를 추적하기 어렵다.**

CDK는 CloudFormation을 기반으로 동작합니다. Typescript를 이용해서 CloudFormation Template을 작성합니다. DSL(Domain-specific language)으로서 Typescript를 이용하는 셈이지요. 근데 Typescript는 마크업 언어가 아니고, 프로그래밍 언어입니다.
그래서 그런가.. 코딩 중간 중간 변수의 상태를 보려고 시도하였습니다. 중간에 만들어진 자원을 콘솔로그로 출력해보면  `'${Token[AWS.AccountId.7]}'`, `'${Token[TOKEN.116]}'`와 같은 문자열을 볼 수 있습니다. 실제 자원의 ARN이나 이름이 나올 줄 알았지만,
유추하기 어려운 문자열입니다. CDK로 작성한 로직이 전부 동작한 후, 위 토큰이 CloudFormation의 자원(CloudFormation 다른 자원의 ARN, ID 등)으로 대치되겠네요.

프로그래밍 언어라서 상태를 추적하면서 코딩 할 수 있을거란 기대가 있었는데, 크게 의미가 없었습니다.

**3. AWS 자원 구조에 익숙할 수록, 객체 방식의 추상화가 방해된다.**

Typescript 코드 자동완성은 코딩할 때 굉장히 편리합니다. 모든 것을 기억하지 않아도 되기 때문입니다. CDK를 사용하다보면 매개변수로 인터페이스 형식을 요청하는 경우가 많습니다. (물론, 이러한 방식이 실수를 방지하는데 큰 도움이 됩니다.)

다음은 RestAPI(Api Gateway)에 HTTPS를 위해 인증서를 연결하는 코드입니다.

```tsx
import { RestApi } from '@aws-cdk/aws-apigateway'
import { Certificate } from '@aws-cdk/aws-certificatemanager'

const certificate = Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:012345678910:certificate/00000000-1111-dddd-eeee-ffffffffffff',
)
new RestApi(this, 'MyRestApi', {
  domainName: {
    certificate,
  },
})
```

발급받은 인증서는 ARN을 이용해서 접근할 수 있습니다. RestApi 객체를 생성할 때 인증서 정보는 Certificate 인터페이스의 형태로 요구합니다. 이를 전달하기 위해 (1) `@aws-cdk/aws-certificatemanager` 패키지를 설치, (2) Certificate 객체를 ARN을 통해 생성, (3) 매개변수로 전달하는 과정을 거쳐야 합니다. 당연히 새롭게 설치한 패키지와 기존에 있던 CDK 관련 패키지끼리 버전도 똑같이 맞춰야 합니다. 😱

반면, Terraform은 자체적으로 구현한 HCL이란 언어를 통해 자원의 ARN을 바로 연결할 수 있습니다..

**4. 배포 실패 시 대응하기 어렵다.**

배포하다가 에러라도 발생한다면, 결국 AWS Console에 접속, CloudFormation으로 이동해서 로그를 살펴봐야 합니다.

**5. 리팩토링 하기가 어렵다.**

프로그래밍 과정에서 규모가 커지면 리팩토링이 필요하듯, 인프라도 규모가 커지면 리팩토링이 필요합니다. CloudFormation의 스택이 커지면 배포하는데 걸리는 시간도 점점 길어집니다. CloudFormation은 자원을 삭제하지 않고 자원을 분리해서 다른 스택으로 이동하는 작업이 굉장히 어렵습니다. (심지어 이러한 기능은 비교적 최근에 추가되었습니다.) 코드와 CLI 명령어로만 이러한 작업을 수행하는게 쉽지 않습니다. 거의 웹콘솔로 진행해야합니다.

이게 CDK를 걷어내야겠다고 생각하게된 결정적인 계기입니다. 리팩토링하면서 자원을 CloudFormation에서 분리할거라면 이번 기회에 Terraform으로 모두 옮기자고 생각했습니다.

---

## AWS CDK에서 Terraform으로 자원 이동하기

CloudFormation의 스택을 그냥 삭제하게 되면 그 안에 포함된 자원도 함께 삭제됩니다. S3나, DynamoDB, SQS Queue 등과 같은 자원은 데이터도 함께 삭제 될 수 있습니다. 따라서 이러한 자원의 경우 스택을 삭제하기 전에 자원이 삭제되지 않도록 설정해줘야 합니다.

**기존에 관리하는 CDK 소스코드를 수정하는 방법**이 있습니다. AWS CDK의 코드를 사용한다면 `removalPolicy`를 `Retain`으로 설정합니다. 대부분의 자원에 해당하는 값이 포함되어있습니다.

```typescript
import { Queue } from '@aws-cdk/aws-sqs'

const queueJobs = new Queue(this, 'Queue', {
  /* ... */
  removalPolicy: RemovalPolicy.RETAIN,
})
```

만약에 소스코드에 접근할 수 있는 상황이라면 **AWS CloudFormation에서 직접 수정하는 방법**이 있습니다. 스크린샷과 같이 "스택 업데이트"에 들어갑니다.

![](/images/2022/2022-09-30-aws-cdk-to-terraform/image1.png)

그리고 삭제되면 안되는 자원을 찾아서 `DeletionPolicy` 항목에 `Delete`라고 적혀있는 부분을 `Retain`으로 변경합니다.

![](/images/2022/2022-09-30-aws-cdk-to-terraform/image2.png)

위와 같은 식으로 서비스가 동작하는데 필요한 자원을 전부 삭제되지 않도록 수정하고 CloudFormation Stack을 제거합니다.

이제 Terraform에 자원을 추가해봅시다. Terraform은 AWS 상에 만들어져있는 자원을 추가하는 과정이 굉장히 쉽습니다. 우선 자원(resource)를 정의합니다. 이 때 상세한 옵션을 다 입력하지 않아도 됩니다. 공식 문서에 나오는 필수값만 채워줍시다.

```
resource "aws_sqs_queue" "my_queue" {
  name                       = "my_queue"
  delay_seconds              = 0
  max_message_size           = 262144
  visibility_timeout_seconds = 30
}
```

이제 Terraform `tfstate`에 자원을 입력(`import`)합니다. 자원마다 `import` 할 때 사용하는 고유값이 다릅니다. 대부분은 ARN을 사용하지만 아닌 경우도 있습니다. 공식문서에 import 항목에 잘 나와있습니다.

[Terraform - aws_sqs_queue #import](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue#import)

일단 ARN을 넣어보고 에러메시지를 보고 수정하는 방법도 괜찮습니다. 다음과 같이 `import` 명령어를 입력합니다.

```bash
terraform import \
  aws_sqs_queue.my_queue \
  https://sqs.ap-northeast-2.amazonaws.com/012345678910/my-queue
```

`plan` 명령어를 이용해서 실제 서비스에 적용되어있는 옵션값과 현재 코드 사이에 다른부분을 비교하면서 코드를 수정합니다. 수정할게 없다고 나올때까지 코드를 수정하거나, 빠져있는 옵션값을 추가합니다.

```bash
terraform plan
```

수정할게 없다고 나오면, `apply` 명령어를 통해 `tfstate`에 적용합니다.

```bash
terraform apply
```

`plan` 명령어를 통해 상태를 보면 `(known after apply)`과 같은 내용이 나올 때가 있습니다. 한번에 두개 이상의 자원을 정의하고, 이 자원간에 의존관계가 있으면 나옵니다. 이럴 땐, 두 자원 중 기반이 되는 자원을 먼저 추가하고 `apply` 합니다. 그리고 의존하는 자원을 추가하면 해당 메시지가 나올일이 거의 없습니다.

그 외, CDK에서 자동으로 생성해주는 IAM Role과 같은 자원들도 있는데, 이는 CloudFormation에 들어가서 Template을 살펴보면 자세한 내용을 확인할 수 있습니다.

### 정리

> "현재 사용중인 모든 CloudFormation을 걷어낼건가요?"  
> **"아니오."**

왜냐하면 CloudFormation을 기반으로 사용하는 프로젝트가 CDK만 있는게 아니기 때문입니다. Serverless Framework는 CloudFormation위에 사용하기 쉽게 만들어진 좋은 라이브러리라고 생각합니다. Serverless Framework는 개발자(특히 프론트엔드 개발자)가 CloudFormation의 자세한 구조를 몰라도 바로 사용할 수 있습니다. 만약 Lambda를 사용하기 위해 CDK를 사용한다면 코드를 업로드 하는 과정조차 쉽지 않습니다. `node_modules`를 함께 넣어줘야 합니다. 하지만 Serverless를 이용한다면? 누구나 손쉽게 AWS에 배포 할 수 있습니다.

> "현재 사용중인 CDK를 걷어낼건가요?"  
> **"네."**.

Serverless Framework는 서비스(간단한 WebHook과 같은)에 종속되는 아주 간단한 인프라를 만드는데 특화되어있습니다. 이에 비해서 CDK는 더 큰 인프라를 관리하는데 사용되는 도구 같은데, 규모가 커질 수록 더 관리하기 어려웠습니다. Terraform은 규모가 커질수록 관리하기 쉬웠습니다. AWS를 넘어서 GCloud, Azure로의 확장까지도 고려한다면 Terraform은 선택이 아닌 필수입니다.

혹시라도 IaC를 위해 AWS CDK를 고려하고 있다면 Terraform을 먼저 사용하시는 걸 추천드립니다. 🙂

**그 외..**

> "'CDK for Terraform'이라는 녀석이 있다는데요?"  
> **"그냥 HCL로 Terraform 사용하세요. 🥲"**

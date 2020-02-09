---
layout: post
title: "AWS EC2 + GOST(Go Simple Tunnel)를 사용하여 쉽게 Foward Proxy 서버 만들기"
summary: "GOST를 이용하여 쉽게 프록시 서버를 만들어봅시다."
date: 2019-09-25 17:13:54 +09:00
tags: ["gost", "forward proxy", "proxy server", "network"]
---

어째서일까요, 저희집 인터넷망에서는 [Apollo GraphQL](https://www.apollographql.com) 사이트가 접속이 되지 않습니다. ~~유플x스 인터넷 으으..~~

아주 다행이도, 집에서 AWS는 접속이 되더라구요. 그래서 간단하게 프록시 서버를 만들어보기로 했습니다. 보통 인터넷에 프록시(Proxy)를 검색하면
Reverse Proxy에 대해서 많이 나옵니다. Forward Proxy와 Reverse Proxy에 대한 자세한 설명은
[정광섭님의 게시글](https://www.lesstif.com/pages/viewpage.action?pageId=21430345)을 참고하시면 됩니다. 여기서는 Forward Proxy에 대해서만
이야기하도록 하겠습니다.

간단하게 쓸만한 오픈소스를 찾던 중, [GOST(GO Simple Tunnel)](https://github.com/ginuerzh/gost/blob/master/README_en.md)라는 라이브러리를
찾았습니다. 사용법을 읽어보니 무척이나 간단했습니다.


일단, 놀고있는 서버를 준비합니다. AWS에서 EC2 프리티어로도 충분합니다. (프리티어를 사용할 수 없다면, 그보다 낮은 `t3.nano`도 가능합니다.)
저는 우분투를 주로 사용하기 때문에 Ubuntu 18.04 버전으로 Ec2 서버를 띄웠습니다.

AWS의 보안 그룹(Security Group)설정에서 다음과 같이 설정해줍니다. 8080포트를 Proxy 포트로 사용할거라서 다음과 같이 추가합니다.
개인용으로 사용할거라면 내 IP를 설정하시면 됩니다.

![Security Group 설정](/images/2019/190925-gost0.png)

GOST는 `snap`을 통해 아주 쉽게 설치할 수 있습니다.

```bash
sudo snap install gost
```

실행은 다음과 같습니다.

```bash
gost -L=:8080
```

다 끝났습니다.


내 IP는 다음 명령어를 통해서 볼 수 있습니다. 다음과 같이 입력하면 본인의 IP가 출력됩니다.

```bash
curl canhazip.com
```

위에서 만든 프록시 서버를 통해서 확인해봅시다. `{서버아이피}`에 서버IP를 입력합니다. 그러면 아래쪽에 서버 IP가 출력됩니다.

```bash
curl -x {서버아이피}:8080 canhazip.com
```

## 브라우저에서 프록시 설정

크롬 확장프로그램을 통해 프록시 서버를 이용할 수 있습니다. 저는
[Falcon Proxy](https://chrome.google.com/webstore/detail/falcon-proxy/gchhimlnjdafdlkojbffdkogjhhkdepf?hl=ko)를 사용하였습니다.

![Security Group 설정](/images/2019/190925-gost1.png)

간단하게 사용하고 싶으신 분은 여기까지 읽으시면 됩니다. :D


## Packer를 통해 GOST 전용 서버 만들기

비밀번호를 설정하지 않아서 뭔가 찝찝한 부분이 있습니다. 또, 매번 인스턴스를 띄울 때 마다 반복하는 것도 귀찮습니다.

[Packer](https://www.packer.io)를 통해 AWS에 인스턴스 이미지(AMI)를 만들어놓고 인스턴스가 실행되자마자 바로 사용가능하도록 작업해봅시다.

일단은 `env` 파일입니다. 사용할 아이디와 비밀번호를 입력합니다.

```
USERNAME=wan2land
PASSWORD=test123
```

다음은 `systemctl`에 등록될 `gost.service` 파일입니다.

```
[Unit]
Description=Gost

[Service]
EnvironmentFile=/etc/gost/env
ExecStart=/snap/bin/gost -L=${USERNAME}:${PASSWORD}@:8080

[Install]
WantedBy=multi-user.target
```

마지막으로, Packer를 통해 이미지를 만들 `gost-ami.json` 파일입니다.

```json
{
  "_comment": "Gost Ubuntu 18.04 + KO AMI",
  "_comment_dep1": "- Gost: [https://github.com/ginuerzh/gost/blob/master/README_en.md]",
  "builders": [
    {
      "type": "amazon-ebs",
      "region": "ap-northeast-2",
      "instance_type": "t2.micro",
      "source_ami": "ami-0fd02cb7da42ee5e0",
      "ssh_username": "ubuntu",
      "ami_name": "gost-ubuntu-18.04-ko-{% raw %}{{isotime \"060102-150405\"}}{% endraw %}",
      "tags": {
        "Name": "gost-ubuntu-18.04-ko",
        "Packer": "true"
      }
    }
  ],
  "provisioners": [
    {
      "type": "file",
      "source": "gost.service",
      "destination": "/home/ubuntu/gost.service"
    },
    {
      "type": "file",
      "source": "env",
      "destination": "/home/ubuntu/env"
    },
    {
      "type": "shell",
      "inline": [
        "sudo apt-get update",
        "sudo snap install gost",
        "sudo mkdir /etc/gost",
        "sudo mv /home/ubuntu/env /etc/gost/env",
        "sudo mv /home/ubuntu/gost.service /etc/systemd/system/gost.service",
        "sudo systemctl enable gost",
        "sudo systemctl start gost"
      ]
    }
  ]
}
```

이미지를 생성해봅시다.

```bash
packer build gost-ami.json
```

서버를 띄우자마자 테스트 해봅시다. 서버아이피가 출력되는 것을 볼 수 있습니다.

```bash
curl -U wan2land:test123 -x {서버아이피}:8080 canhazip.com
```

진짜 끝.

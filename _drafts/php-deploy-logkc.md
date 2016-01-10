오래된 소스의 배포 로직을 

문제

1. 소스코드 폴더 내부에 어떤 심링크가 존재할지 모른다.
2. 소스코드 폴더 내부에 로그를 쌓고 있을 수도 있다.

실제로는 `git clone` 명령어로 배포를 시작해야하지만, 위 두가지 문제를 해결하기 위해서 `cp -r` 명령어를 통해 배포를 시작하기로 하였습니다.

혹시나 속시원히 `git clone`을 통해서 시작하실 분들은 우선 심링크를 찾아야 합니다.

```
$ find -L . -xtype l
```

그리고 내부에 로그를 쌓는 로직이 있는지 확인하여야 합니다. 보통은 그 로그를 쌓는 로직은 `/etc` 경로 하위에 있는 설정 파일에서 잡고 있을 수도 있습니다.

**참고** 다음, 명령어에서 `/var/old-project-dir`은 사용중인 경로를 의미합니다.

```
$ grep -r "/var/old-project-dir" /etc
```

ComposerAutoloaderInitc968c75da2ac7aa28667e989d607e028


su -

mkdir /var/gs-release
chown gameshuttle:gameshuttle /var/gs-release

# 관리자 권한으로 하면 안됨.
cp -r /var/gameshuttle.7.3 /var/gs-release/gameshuttle
ln -sfn gameshuttle /var/gs-release/current

# 관리자 권한으로 실행해야하는데, 주의.
ln -sfn gs-release/current /var/gameshuttle
chown -h gameshuttle:root /var/gameshuttle

# 위 작업시 이상생기면 해야할 작업
ln -sfn gameshuttle.7.3 /var/gameshuttle
chown -h gameshuttle:root /var/gameshuttle


위에가 선행 작업.



ln -sfn 151230_130004 /var/gs-release/current

## 나중에 해야할 작업

rm -rf /var/gameshuttle.7.3


심링크 갈아치울때 로직.
ln -sfn gameshuttle/ ./current


## Trouble Shoot
OPCache내에 남아있는 클래스하고,
새로 경로 바뀐 곳의 클래스와의 충돌. 할 수 있음. 즉, Composer Install은 반드시 수행.


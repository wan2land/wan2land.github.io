## Login Root

yum update
adduser wan2land
passwd wan2land
usermod -a -G wheel wan2land


chmod 0777 /etc/sudoers
vi /etc/sudoers

%wheel  ALL=(ALL)       ALL

chmod 0440 /etc/sudoers

## Login wan2land

mkdir ~/.ssh
touch ~/.ssh/authorized_keys

chown -R wan2land:wan2land ~/.ssh
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

sudo vi /etc/ssh/sshd_config

PermitRootLogin no
PasswordAuthentication no ## 사용자 로그인 비밀번호로 접근 하는 것을 막으려면..

sudo /etc/init.d/sshd restart
	or sudo service sshd restart

## vimrc
$ vi ~/.vimrc


## Docker Install

$ sudo yum install http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
$ sudo yum install docker-io

$ vi /etc/sudoers.d/wan2land

```
wan2land ALL=NOPASSWD:/usr/bin/docker
```

## MySQL Server

```
$ wget http://dev.mysql.com/get/mysql57-community-release-el6-7.noarch.rpm
$ sudo yum localinstall mysql57-community-release-el6-7.noarch.rpm
$ yum repolist enabled | grep "mysql.*-community.*"
$ sudo yum install mysql-community-server
```

```
$ sudo service mysqld start
```



## 기타 프로그램 설치

sudo yum install -y git
sudo yum install -y zsh

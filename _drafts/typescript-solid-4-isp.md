---
layout: post
title: "Typescript SOLID (4) - 인터페이스분리원칙(ISP)"
summary: "인터페이스 분리 원칙(ISP, Interface Segregation Principle)~~~~"
date: 2020-03-10 22:38:12 +09:00
tags: ["cleancode", "solid", "designpattern", "typescript"]
---


## ISP : Interface Segregation Principle (인터페이스 분리 원칙)

??? 아마도 슈퍼 인터페이스 만들지 말란 얘긴듯.

하나 긴능 바뀌면 다른 클라이언트에 옇ㅇ향 미침.

슈퍼클래스가 있다면 인터페이스를 쪼개자.

```php
<?php
interface Readable
{
	public function read();
}

interface Writeable
{
	public function write();
}

class HardDisk implements Readable, Writeable
{
	public function write()
	{
		echo "HardDisk :: Write!\n";
	}
	public function read()
	{
		echo "HardDisk :: Read!\n";
	}
}


class CompactDisk implements Readable
{
	public function read()
	{
		echo "CD :: Read!\n";
	}
}

class Client
{
	public function read(Readable $disk)
	{
		$disk->read();
	}

	public function write(Writeable $disk)
	{
		$disk->write();
	}
}


$client = new Client();
$client->read(new HardDisk);
$client->read(new CompactDisk);

$client->write(new HardDisk);
// $client->write(new CompactDisk); // Error :)

$client->crush(new HardDisk);
$client->crush(new CompactDisk);
```

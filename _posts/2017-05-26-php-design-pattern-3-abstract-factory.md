---
layout: "post-design-pattern"
chapter: "1.3"
title: "디자인패턴 공부하기 - 3. 추상팩토리 (Abstract Factory)"
date: 2017-06-12 01:06:45 +09:00
tags: ['designpattern', 'php']
---

그동안의 팩토리 패턴들은 일반 객체를 생성했습니다. 그런데 만약에 생성해야 하는 객체가 특정 인터페이스를 구현하고 있는 클래스라면 어떻게 되어야 할까요?

서비스에서 Cache를 사용한다고 가정합시다.

```php
<?php
class ArrayCache
{
    protected $caches;

    public function get(string $key, $default = null)
    {
        return $this->caches[$key] ?? $default;
    }

    public function set(string $key, $value)
    {
        $this->caches[$key] = $value;
    }
}
```

이를 생성하기위해서 일반적인 팩토리패턴을 사용하였습니다.

```php
<?php
class CacheFactory
{
    public function factory(): ArrayCache
    {
        return new ArrayCache();
    }
}
```

그런데 이제 서비스 환경을 개선하기 위해 Redis를 사용하기로 하였습니다. 그리하여 다음과 같이 `RedisCache`를 추가하였습니다. 기존의 `ArrayCache`와 호환되기 위해서 `interface`도 하나 만듭니다.

```php
<?php
interface Cache
{
    public function get(string $key, $default = null);
    public function set(string $key, $value);
}

class ArrayCache implements Cache
{
    // 생략
}

class RedisCache implements Cache
{
    // 생략
}
```

이제 이 `RedisCache`를 생성하기 위해서 어떻게 해야할까요? 기존에 방식대로라면, `RedisCacheFactory`를 만들면 해결됩니다.

```php
<?php
class RedisCacheFactory
{
    public function createCache(): RedisCache
    {
        return new RedisCache;
    }
}
```

그런데 `Cache`를 구현화한 클래스들이 많아지면 문제가 발생합니다. `MemcachedCache`라던가, `ApcuCache`라던가.. 그러면 동시에 `MemcachedCacheFactory`, `ApcuCacheFactory`도 계속해서 추가될 것입니다.

그래서 `Factory` 객체도 추상화할 필요성이 생깁니다. 바로 이것이 추상팩토리(Abstract Factory)입니다. 이름에서 알 수 있듯이 추상클래스(Abstract Class)를 사용합니다만, 인터페이스(Interface)를 사용해도 괜찮습니다.

```php
<?php
interface CacheFactory
{
    public function createCache(): Cache;
}

class ArrayCacheFactory implements CacheFactory
{
    public function createCache(): Cache
    {
        return new ArrayCache;
    }
}

class RedisCacheFactory implements CacheFactory
{
    public function createCache(): Cache
    {
        return new RedisCache;
    }
}
```

<div class="mermaid">
classDiagram

ArrayCacheFactory --> ArrayCache : create
RedisCacheFactory --> RedisCache : create

CacheFactory <|.. ArrayCacheFactory
CacheFactory <|.. RedisCacheFactory
CacheFactory : + createCache()
ArrayCacheFactory : +createCache()
RedisCacheFactory : +createCache()

Cache <|.. ArrayCache
Cache <|.. RedisCache
Cache : + get(string $key, $default = null)
Cache : + set(string $key, $value)
ArrayCache : + get(string $key, $default = null)
ArrayCache : + set(string $key, $value)
RedisCache : + get(string $key, $default = null)
RedisCache : + set(string $key, $value)

</div>

## 왜 추상화인가?

여기서 이제 드는 의문점 한가지, "왜 굳이 추상화를 해서 사용해야하나요?"

객체지향 프로그래밍은 기존의 소스에는 영향을 주지 않고 소스를 확장할 수 있어야 합니다. 이 한 부분만 설명하기 위해서는 많은 이야기를 해야합니다만, 간단히 소스로 살펴보도록 하겠습니다.

위의 `Cache` 객체를 들어 설명하겠습니다. 일단 두가지 방식의 소스를 먼저 보여드리겠습니다.

```php
<?php

// 첫번째 방식
class UserController
{
    public function index(ArrayCache $cache)
    {
        if ($users = $cache->get("users")) {
            return $users;
        }
        $users = User::all();
        $cache->set('users', $users);
        return $users;
    }
}

// 두번째 방식
class UserController
{
    public function index(Cache $cache)
    {
        if ($users = $cache->get("users")) {
            return $users;
        }
        $users = User::all();
        $cache->set('users', $users);
        return $users;
    }
}
```

첫번째 방식과 두번째 방식의 차이를 보면 알 수 있습니다. 첫번째 방식에서 `RedisCache`로 교체하려면 `UserController` 클래스를 수정해야합니다. 하지만 두번째 방식에서는 `index`라는 메서드를 호출할때 매개변수로 넣어준 `ArrayCache` 대신에 `RedisCache`를 넣어주면 해결이 됩니다. 지금 여기서는 둘다 한번씩 수정했기 때문에 크게 차이를 못느낄 수 있습니다.

하지만, `ArrayCache`를 사용하고 있는 곳이 100개 이상이라면, 100개의 타입을 다 수정해주어야 하는 번거로움이 있습니다. 하지만 두번째 방식이라면 100개를 수정할 필요 없습니다. 처음에 `Cache`를 생성하는 로직 한개만 수정하면 됩니다.

지금은 `Cache`를 이야기 하고 있지만, `Factory`를 추상화하는 이유 역시 동일합니다. :-)

## 다시 추상팩토리로

그렇다면, 추상팩토리를 사용하고 있는 가장 대표적인 소스는 무엇이 있을까요?

PSR-17로 토론중인 Http Factory를 예로 들 수 있습니다.

 - https://github.com/php-fig/fig-standards/blob/master/proposed/http-factory/http-factory.md

당장 Http Request 객체만 해도 환경에 따라서 다르게 생성해야하기 때문입니다.

[Laravel의 Http Request](https://laravel.com/docs/5.4/requests)와 [Guzzle의 Http Request](http://docs.guzzlephp.org/en/stable/psr7.html)가 같은 Http Request지만 그 성격이 다른 것을 알 수 있습니다. 

Laravel은 사용자가 우리서버에게 요청한 Request 객체입니다. 하지만 Guzzle은 우리서버가 다른 서버로 요청한 Request 객체입니다. 즉, 한쪽은 받은 Request 객체이고, 나머지는 보내는 Request 객체입니다. 이 상황에 따라서 Http Request Factory도 달라져야 하는 것이지요. 그리고 그에 맞춰서 `Http Factory Interface`는 자연스럽게 생겨난 요구가 아닌가 생각이 듭니다.


음.. Route53에서 만든 도메인에 접속이 안됩니다.

AAAA Alias와 A Alias 설정..

DNS_PROBE_FINISHED_NXDOMAIN



```bash
nslookup api.arrangeapp.kr 1.1.1.1
```

```
Server:		1.1.1.1
Address:	1.1.1.1#53

** server can't find api.arrangeapp.kr: NXDOMAIN
```

```bash
nslookup api.arrangeapp.kr 8.8.8.8
```

```
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	api.arrangeapp.kr
Address: 52.85.231.87
Name:	api.arrangeapp.kr
Address: 52.85.231.78
Name:	api.arrangeapp.kr
Address: 52.85.231.51
Name:	api.arrangeapp.kr
Address: 52.85.231.89
```

8.8.8.8 DNS를 통해 요청하면 정상처리되는데, 1.1.1.1 DNS를 통해 요청하면 결과가 제대로 나오지 않는다.

일단 1.1.1.1에서 DNS 캐시를 날려보자

https://1.1.1.1/purge-cache/

조금 시간이 지나봤는데 그래도 안된다.

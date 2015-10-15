
Varnish Esi를 통해 REST 성능을 향상시켜보자.


Ubuntu기준으로 `etc/default/varnish`파일, CentOS계열에서는 `/etc/sysconf/varnish`파일에는 Varnish 데몬을 위한 설정이 존재합니다.

일반적인 HTML, XML 방식의 문서는 문제가 없으나 JSON을 통한 API를 성능향상을 하기 위해서는 문제가 생깁니다.
여튼 이 옵션을 넣습니다.

-p feature=+esi_disable_xml_check

이 옵션은 xml 방식이 아니어도 사용이 가능하도록 도와줍니다.
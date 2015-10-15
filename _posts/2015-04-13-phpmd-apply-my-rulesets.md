---
layout: post
title: "Mess Detector에서 나만의 커스텀 룰셋 적용하기"
date: 2015-04-13 16:00:59 +09:00
tags: ['PHP', 'Mess Detector', 'PHPMD', 'Rulesets']
---

본 글은 기본적으로 Mess Detector와 PHPStorm을 사용하고 있는 분을 대상으로 삼고 있습니다. :)

## 문제의 발단.

이제는 PHP 코딩에서 필수 도구가 되어버린 PHP Mess Detector(이하 PHPMD), PHP 좀 하신 분들이라면 누구나 한번쯤 사용해 봤을 것입니다.

![Mess Detector](/images/dev/php/phpmd.png)

[phpmd.com](http://phpmd.org)

PHPMD를 켜놓고 신나게 코딩을 하다 보면 다음과 같은 메시지를 심심치 않게 만나게 됩니다.

![Naming Warning](/images/dev/php/phpmd-warning-with-naming.png)

`Avoid variables with short names like $id. Configured minimum length is 3.`

짧은 단어로 된 변수이름을 사용하지 말라는 것인데, 깔끔한 코드를 사용하는데 있어서 경고를 띄워주는건 이해가 갑니다. 그러나 반드시 꼭 3글자 이하로 써야하는 변수들이 몇가지가 있습니다. 예를들면 `$i`, `$j` 정도가 있겠습니다. 단순한 루프문에서 무조건 3글자이상의 이름을 사용할 순 없습니다. **아! 물론 저 경고를 무시하고 코딩하시는 분은 그냥 이제 뒤로 가셔도 됩니다.** 저는 저런 사소한 경고따위 용납하지 않는 스타일이라 저 경고를 없애기 위해 이리저리 삽질을 했습니다.

## 문제의 해결.

만약 PHPMD를 `compsoer`를 통해서 설치했다면 `vendor/phpmd/phpmd/src/main/resources/rulesets` 폴더안에 다양한 룰셋이 xml을 통해 정의되어있는 것을 볼 수 있습니다. 뭔가 가닥이 잡히네요. 저는 여기서 `naming.xml`파일을 하나 복사해서 `custom-naming.xml`파일로 저장을 하였습니다.

```xml
    <rule name="ShortVariable"
          since="0.2"
          message="Avoid variables with short names like {0}. Configured minimum length is {1}."
          class="PHPMD\Rule\Naming\ShortVariable"
          externalInfoUrl="http://phpmd.org/rules/naming.html#shortvariable">
        <description>
Detects when a field, local, or parameter has a very short name.
        </description>
        <priority>3</priority>
        <properties>
            <property name="minimum" description="Minimum length for a variable, property or parameter name" value="3"/>
            <property name="exceptions" description="Comma-separated list of exceptions" value="id,i,j,k,e"/>
        </properties>
        <example>
            <![CDATA[
class Something {
    private $q = 15; // VIOLATION - Field
    public static function main( array $as ) {  // VIOLATION - Formal
        $r = 20 + $this->q; // VIOLATION - Local
        for (int $i = 0; $i < 10; $i++) { // Not a Violation (inside FOR)
            $r += $this->q;
        }
    }
}
            ]]>
        </example>
    </rule>
```

그리고 저는 위와같이 소스를 수정하였습니다. 물론 다른 부분은 그대로입니다. :-) 이 소스 한줄이 추가 되었습니다. `<property name="exceptions" description="Comma-separated list of exceptions" value="id,i,j,k,e"/>` 즉, 3글자 이내에서 경고를 내는데, 다음과 같은 이름으로 된 녀석들은 제외한다는 의미입니다.

이제 PHPStorm에서 설정(Preference)을 켭니다. 그리고 `Inspections`를 들어가면 `PHP Mess Detector`라는 항목을 볼 수 있습니다.

![PHPStorm Inspections](/images/dev/php/phpstorm-inspections.png)

자, 이제 우측에 `Naming Rules` 체크를 해제하고 아래 `+`버튼을 통해 우리가 아까 저장했던 `custom-naming.xml`파일을 불러옵니다.

![PHPStorm PHPMD Custom](/images/dev/php/phpstorm-phpmd-custom.png)

이제 적용을 하고 나옵시다.

![PHPStorm PHPMD No Warning](/images/dev/php/phpmd-custom-apply-complete.png)

이제 경고 밑줄 없는 화면을 볼 수 있습니다. :-)

이러한 룰셋을 자기 입만에 튜닝해서 사용하면 좋습니다. 또한, 팀프로젝트의 경우 프로젝트 폴더 최상위 폴더에 `Rulesets`폴더를 만들어서 함께 공통된 코딩룰을 만들어서 사용할 수도 있습니다. 더 자세히 보고싶으시다면 PHPMD사이트의 [rules](http://phpmd.org/rules/index.html) 문서를 참고하시면 됩니다.
---
layout: post
title: "Facebook Webdriver를 이용하여 Selenium 테스트하기"
date: 2016-08-08 20:47:42 +09:00
tags: ['PHP', 'unittest', selenium', 'facebook webdriver']
---

최근 서비스에 UI 테스트를 할일이 생겼습니다.

PHP쪽 UI Test 툴에는 코드셉션(Codeception) 이라는 끝판왕이 있지만, 이미 기존에 PHPUnit 으로 꽤 많은 유닛테스트가 작성되어있어서 옮기기 귀찮았습니다. 그래서 그냥 PHPUnit 기반으로 할 방법이 없나 하고 고민을 하던 중, 코드셉션을 살짝 열어보았습니다. 그 안을 보니 `facebook/webdriver`라는 패키지를 사용하는 것을 보고, 해당 패키지를 이용하여 테스트를 작성해 보았습니다.

...그냥 보통은 코드셉션 쓰면 됩니다...


## 라이브러리 설치

두가지의 패키지가 필요합니다.

- `phpunit/phpunit`
- `facebook/webdriver`

이 두개의 도구는 컴포저(composer)를 통해 쉽게 설치 할 수 있고, 커맨드는 다음과 같습니다.

```
composer require --dev phpunit/phpunit
composer require --dev facebook/webdriver
```

## PHPUnit 설정

`composer.json` 파일이 있는 폴더에 `phpunit.xml` 파일을 하나 만듭니다. 물론, PHPUnit을 이미 잘 사용중인 개발자분이라면 그냥 건너뛰어도 됩니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit backupGlobals="false"
         backupStaticAttributes="false"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnError="false"
         stopOnFailure="false"
         syntaxCheck="true"
         verbose="true"
        >
    <testsuites>
        <testsuite name="My Test Suite">
            <!-- 유닛테스트 파일이 위치하는 곳.. -->
            <directory suffix="Test.php">./tests</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

## Selenium 다운 및 실행

기본으로 셀레늄은 Firefox Webdriver를 가지고 실행합니다. 저의 경우는 크롬(Chrome)을 사용하고 싶어서 Chrome Driver를 별도로 다운받았습니다. :-)

- [Selenium Release](https://selenium-release.storage.googleapis.com/index.html)
- [Chrome Driver](http://chromedriver.storage.googleapis.com/index.html)

자기 환경에 맞는 버전을 선택해서 다운받으면 됩니다. 저의 경우는 버전은 셀레늄은 `2.53` 크롬드라이버는 `2.21` 버전을 선택하였습니다.

그리고 자바를 통해서 셀레늄을 실행할 수 있습니다.

** OSX **

크롬드라이버 파일명이 `chromedriver`이고 셀레늄 파일이 `selenium-server-standalone-2.53.0.jar`라면 명령어는 다음과 같이 실행할 수 있습니다.

```sh
java -Dwebdriver.chrome.driver=./chromedriver -jar selenium-server-standalone-2.53.0.jar
```

그리고 위 과정을 매번 반복하기 때문에 다음과 같이 `test-on-osx.sh`파일로 저장하였습니다.

```sh
# https://selenium-release.storage.googleapis.com/index.html
if [ ! -f "selenium-server-standalone-2.53.0.jar" ]; then
    echo "Download Selenium..."
    wget https://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.0.jar
fi

# http://chromedriver.storage.googleapis.com/index.html
if [ ! -f "chromedriver" ]; then
    echo "Download Chrome Driver..."
    wget http://chromedriver.storage.googleapis.com/2.21/chromedriver_mac32.zip
    unzip chromedriver_mac32.zip
    rm chromedriver_mac32.zip
fi

java -Dwebdriver.chrome.driver=./chromedriver -jar selenium-server-standalone-2.53.0.jar > /dev/null 2>/dev/null &

```

** Window **

윈도우용 `test-on-win.bat` 파일입니다. 하나 생성해서 그냥 실행하시면 셀레늄이 자동으로 실행됩니다.

```sh
php -r "if (!file_exists('selenium-server-standalone-2.53.0.jar')) copy('https://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.0.jar', 'selenium-server-standalone-2.53.0.jar');"
php -r "if (!file_exists('chromedriver.exe')) {copy('http://chromedriver.storage.googleapis.com/2.21/chromedriver_win32.zip', 'chromedriver_win32.zip');}"
php -r "if (!file_exists('chromedriver.exe')) {$zip = new ZipArchive();$zip->open('chromedriver_win32.zip');$zip->extractTo('.');}"
php -r "if (!file_exists('chromedriver.exe')) {unlink('chromedriver_win32.zip');}"

start java -Dwebdriver.chrome.driver=chromedriver.exe -jar selenium-server-standalone-2.53.0.jar
```

## 유닛테스트 작성

유닛테스트 디렉토리를 `tests`로 잡았다면 그 바로 하위에 `SeleniumTestCase.php` 파일을 하나 생성합니다. 그리고 다음과 같이 작성하면 됩니다.

```php
<?php
namespace YourTest;

use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;
use PHPUnit_Framework_TestCase;
use RuntimeException;

class SeleniumTestCase extends PHPUnit_Framework_TestCase
{
    const SELENIUM_DRIVER = 'chrome';

    const SELENIUM_HOST = 'http://blog.wani.kr';

    /** @var \Facebook\WebDriver\Remote\RemoteWebDriver */
    protected $browser;

    public function setUp()
    {
        // selenium 
        $host = 'http://localhost:4444/wd/hub';

        switch (static::SELENIUM_DRIVER) {
            case 'chrome':
                $capability = DesiredCapabilities::chrome();
                break;
            default:
                // 기본값은 firefox 
                $capability = DesiredCapabilities::firefox();
        }
        $capability->setCapability('acceptSslCerts', false);

        $this->browser = RemoteWebDriver::create($host, $capability);
    }

    public function tearDown()
    {
        if (isset($this->browser)) {
            $this->browser->close();
        }
    }
    
    public function onPage($path = '/')
    {
        if ($path[0] !== '/') {
            $path = '/' . $path;
        }
        $this->browser->get(static::SELENIUM_HOST . $path);
    }

    /**
     * @param string $selector
     * @return \Facebook\WebDriver\Remote\RemoteWebElement[]
     */
    public function getElements($selector)
    {
        return $this->browser->findElements(WebDriverBy::cssSelector($selector));
    }

    /**
     * @param string $selector
     * @return \Facebook\WebDriver\Remote\RemoteWebElement
     */
    public function getElement($selector)
    {
        return $this->browser->findElement(WebDriverBy::cssSelector($selector));
    }

    /**
     * @param string $selector
     * @param string $text
     */
    public function doFillInput($selector, $text)
    {
        $this->getElement($selector)->sendKeys($text);
    }

    /**
     * @param string $selector
     */
    public function doClick($selector)
    {
        $this->getElement($selector)->click();
    }
    
    public function assertSeleniumUrlEquals($expected)
    {
        $actual = $this->browser->getCurrentURL();
        $this->assertEquals(static::SELENIUM_HOST . $expected, $actual);
    }
    
    public function assertSeleniumBodyContain($expected)
    {
        $this->assertContains(
            $expected,
            $this->browser->findElement(WebDriverBy::tagName('body'))->getText() // <body></body>에 있는 텍스트 전체를 출력
        );
    }

    public function assertSeleniumBodyNotContain($expected)
    {
        $this->assertNotContains(
            $expected,
            $this->browser->findElement(WebDriverBy::tagName('body'))->getText() // <body></body>에 있는 텍스트 전체를 출력
        );
    }

    public function assertSeleniumAlertEquals($expected)
    {
        sleep(1);
        $this->assertEquals($expected, $this->browser->switchTo()->alert()->getText());
        sleep(1);
        $this->browser->switchTo()->alert()->accept();
        sleep(1);
    }
}
```

그냥 내부에서 실제로 쓰고있는 소스가 일부 포함되어있습니다. [...] 이제 셀레늄 관련 테스트를 할 때는 해당 파일을 상속받아서 진행하시면 됩니다.

만약에 웹드라이버를 바꾸고 싶다면 상단에 `SELENIUM_DRIVER` 상수를 변경하시면 됩니다. 테스트할 도메인을 바꾸고 싶다면 `SELENIUM_HOST`를 변경하시면 됩니다. 여기서는 테스트를 위해서 `http://blog.wani.kr`을 사용한다고 가정하였습니다. 실제 테스트에서는 `localhost` 기반의 URL 돌리고 있습니다.

이제 테스트할 파일을 하나 작성하여 봅시다. 파일명은 `HelloSeleniumTest.php`입니다.

```php
<?php
namespace YourTest;

use YourTest\SeleniumTestCase;

class HelloSeleniumTest extends SeleniumTestCase
{
    public function test_메인페이지_정상출력()
    {
        $this->onPage('/');
        $this->assertSeleniumBodyContain('완이의 웹으로 먹고살기');
    }

    public function test_About링크_정상작동()
    {
        $this->onPage('/');
        $this->doClick("a[href='/about']");

        $this->assertSeleniumUrlEquals('/about/');
        $this->assertSeleniumBodyContain('덕질하는 개발개발인간');
    }
}
```

그리고 `phpunit` 명령어를 통해서 실행하면 잘 돌아갑니다.

위에서 이야기한 "Selenium 다운 및 실행"에서 `selenium`을 실행시키지 않았다면 여기서 에러가 날 수 있습니다.

## 더 공부하고 싶다면..

사실 위에 테스트한 두가지 내용은 아~주 기본중의 기본입니다. 더 자세히 보고 싶다면 `facebook/webdriver`에서 제공하는 Example 문서를 살펴보시면 됩니다.

- [PHP Webdriver - Example Command Ref.](https://github.com/facebook/php-webdriver/wiki/Example-command-reference)

찾아보면 자바스크립트 코드를 주입해서 테스트도 가능합니다. :-) 즉, 브라우저에서 벌어질 상황은 다 구현가능합니다.

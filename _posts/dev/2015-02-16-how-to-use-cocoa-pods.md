---
layout: post
title: "Swift 프로젝트에 Cocoa Pods 이용하기"
date: 2015-02-16 17:26:17
categories: Dev Swift CocoaPods
tags: ['Swift', 'Cocoa Pods', 'Xcode']
---

맨날 웹개발 + 백엔드(수박겉핥기)만 죽어라 하다가 설도 껴있겠다 기념으로 전부터 보고싶었던 것을 가지고 놀아보자 라는 심정으로 스위프트를 시작해보기로 했습니다. 매번 [Cordova](http://cordova.apache.org)만 사용하는데 네이티브앱을 도전해보기 위해서 였습니다. 그리고 이게 되면 아이폰도 앱의 형태이긴 하지만 내 맘대로 튜닝이 될것 같아서이기도 했습니다.

뭐 처음 스위프트를 시작하게된건 위와 같은데 "Cocoa Pods는 왜 찾아보게 된것인가?"라는 내용으로 넘어와야할 것 같습니다. 보통 Node.js나, PHP, Python 등의 스크립트만 작성하던 저에게 Swift를 시작할 때 한가지 걱정거리가 있었습니다. 그것은 모든 내용을 다 내가 직접 구현해서 써야만 하는가 였습니다. 물론 iOS에는 UIKit이라는 훌륭한 라이브러리를 지원해주긴 하지만 이것만으로 충분하지 않을 때가 많기 때문입니다. 처음에 가장 크게 필요했던게 JSON Parser였습니다. 그러던 중 발견한 Xcode용 패키지 관리자가 바로 [Cocoa Pods](http://cocoapods.org)(이하 Pod) 였습니다. 설치할 때 필요한 리소스가 있는데 바로 Ruby입니다. 보통 맥에는 기본적으로 루비가 깔려있습니다. (Homebrew를 깔았다면 Ruby가 깔려있는 겁니다.) 웹사이트에 설치법이 간단히 나와있습니다.

```bash
$ sudo gem install cocoapods
```

그러나!!!! 저희는 저렇게 입력하면 안되고 `--pre`라는 옵션을 사용해야합니다.

```bash
$ gem install cocoapods --pre
```

바로 이렇게요. 왜냐하면 아직 Swift가 나온지 얼마 안된 언어이고 Pod 정식버전에서는 Objective-C 패키지만을 사용할 수 있기 때문입니다. 즉 Swift를 지원하는 베타버전을 사용해야하기 때문에 `--pre`라는 옵션을 붙여주는 것입니다. (작성일 기준에서는) 처음에 저 옵션을 몰라 얼마나 헤맸는지를 생각하면.. (부들부들)

설치는 명령어를 입력함과 동시에 끝이 납니다.

그리고 Pod의 사용가능한 패키지 정보를 읽어와야 합니다.

```bash
$ pod setup
```

그러면 패키지 정보들을 읽어오는데 이 내용은 `~/.cocoapods` 아래에 저장됩니다. 이제 작업할 프로젝트의 디렉터리로 이동을 합니다.

프로젝트의 이름이 MyMessage라고 하면 다음과 같이 폴더 리스트가 있을 것입니다.

```bash
$ ls
MyMessage
MyMessage.xcodeproj
MyMessageTests
```

여기서 `Podfile`을 생성해주어야 합니다. 생성법은 간단합니다. 여타의 패키지 관리 툴들과 같습니다. `pod init`입니다.

그러면 `Podfile`이 생성되어있을 것입니다.

```
# Uncomment this line to define a global platform for your project
# platform :ios, '6.0'
target 'MyMessage' do
end
target 'MyMessageTests' do
end
```

뭐 대충 이런식으로 써있는데 여기에 제가 추가할 프로젝트를 추가해줍니다. 저는 JSON을 사용하기 위해서 설치한 것이었습니다. 그래서 [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON)을 설치 할 것입니다.

```
# Uncomment this line to define a global platform for your project
# platform :ios, '6.0'
pod 'SwiftyJSON', '2.1.3'
target 'MyMessage' do
end
target 'MyMessageTests' do
end
```

이렇게 한줄을 추가하고 저장한다음 `pod install` 명령어를 입력하면 뭐가 막 어쩌구 저쩌구 하면서 설치가 완료됩니다.

```bash
$ pod install
Analyzing dependencies
Downloading dependencies
Installing SwiftyJSON (2.1.3)
Generating Pods project
Integrating client project

[!] From now on use `MyMessage.xcworkspace`.
```

여기서 주목해야하는 것은 마지막 줄입니다. 이제부터 `MyMessage.xcworkspace`를 사용할 수 있다고 합니다. 그전 까지는 `MyMessage.xcodeproj`를 통해 프로젝트를 관리해야 했다면 이제는 Pod를 포함한 Workspace를 통해 개발을 해야합니다. 그래야 빌드 하는 과정에 Pod를 통해 다운받은 패키지를 포함할 수 있습니다.

![import swiftyJSON](/images/dev/swift/pod/import-swiftyjson.png)

그리고 상단 import하는 부분에 `import SwiftyJSON`이라고 적어넣기만 하면 해당파일에서 해당 패키지의 내용을 가져다 쓸 수 있습니다. 빌드는 알아서 잘 해줍니다. (캬~ 역시 패키지관리자가 최고야)

이상입니다. :-)
---
layout: post
title: "PHP 기본 객체 정리(1) - Overview"
date: 2016-05-18 17:58:21 +09:00
tags: ['php', 'php7', 'class', 'interface']
---

PHP Framework 만든다고 꽁냥꽁냥 거리는데, `wandu/http`라는 패키지를 다듬던 중, Session 쪽을 개선하려고 보는데, PHP 자체 인터페이스에 **SessionHandlerInterface**가 있다는 사실을 알게 되었습니다. 이게 왜 충격이었냐하면, 그동안 바보같이.. [SessionAdapterInterface](https://github.com/Wandu/Http/blob/c67e28f9279b3b521a36a4691f050a48d0241111/Contracts/SessionAdapterInterface.php)라는 녀석을 만들어서 사용하고 있었거든요..

프레임워크에서 인터페이스를 사용하려면 가장 보편적인 것을 사용해야 한다고 생각합니다. 굳이 있는 것을 새로 만든다는 것은 그만큼 의존성이 생기는 것을 의미하기 때문입니다. ~~뭐.. 조만간 다 옮기겠죠..ㅠㅠ~~

그리하여, 오늘의 주제는 PHP에 기본 선언되어있는 인터페이스와 클래스를 알아보자입니다. :-)

```php
<?php
get_declared_interfaces();
get_declared_traits();
get_declared_classes();
```

위 3가지 함수의 도움을 받았습니다. 최대한 PHP 추가 익스텐션은 배제한 환경입니다. 물론, 패키지 매니저로 설치한 만큼 기본으로 딸려오는 녀석들도 있을 겁니다.

## Interfaces

기본 인터페이스는 총 18개입니다. 그리고 PHP 문서에 따라서 분류해봤더니 7가지로 분류가 됩니다.

- Predefined Interfaces
- Other Basic Extensions > SPL Interfaces
- Other Basic Extensions > SPL > Miscellaneous Interfaces
- Other Basic Extensions > JSON
- Date and Time Related Extensions > Date/Time
- Session Extensions > Sessions

각각 자세히 살펴보면 다음과 같습니다.

- Predefined Interfaces
	1. `Traversable`
	1. `Iterator` extends Traverable
	1. `IteratorAggregate` extends Traverable
	1. `Throwable` (>= 7.0)
	1. `ArrayAccess`
	1. `Serializable`

일단 간단히 설명하자면, `Traversable`, `IteratorAggregate`, `Iterator` 이 3가지는 이터레이터를 관련한 녀석들입니다. 이 녀석들을 구현하면 `for`, `foreach`문에서 돌아가는 객체를 만들 수 있습니다. `Throwable`은 PHP7에서 추가 되었으며 모든 `Error`처리가 해당 인터페이스를 통해서 다시 정의되었습니다. `ArrayAccess`는 배열 접근을 재 정의할 수 있도록 연산자 오버로딩을 제공합니다. `Serializable`은 `serialize`, `unserialize`라는 함수를 통해 객체를 직렬화 할 때, 동작을 지정할 수 있는 인터페이스를 제공합니다.

- Other Basic Extensions > SPL Interfaces
	1. `Countable`
	1. `OuterIterator` extends Iterator
	1. `RecursiveIterator` extends Iterator
	1. `SeekableIterator` extends Iterator

`Countable`은 해당 객체를 `count`매서드를 통해서 호출할 때의 동작을 기술할 수 있습니다. 그리고 3가지 `Iterator`는 위에서 한번 이야기한 이터레이터를 좀더 상세히 서술 할 수 있도록 기능을 제공합니다.

- Other Basic Extensions > SPL > Miscellaneous Interfaces
	1. `SplObserver`
	1. `SplSubject`

처음보는데, Observer Design Pattern을 구현하고 있다고 합니다.

- Other Basic Extensions > JSON
	1. `JsonSerializable`

객체가 `json_encode` 매서드를 통해 호출될 때의 동작을 기술 할 수 있습니다.

- Date and Time Related Extensions > Date/Time
	1. `DateTimeInterface`

DateTime객체가 해당 인터페이스를 구현하고 있습니다.

- Session Extensions > Sessions
	1. `SessionHandlerInterface`
	1. `SessionIdInterface` (문서에 없음)
	1. `SessionUpdateTimestampHandlerInterface` (>= 7.0)

세션의 인터페이스를 정의하고 있습니다.

- Variable and Type Related Extensions > Reflection
	1. `Reflector`

모든 Reflection 객체는 다 해당 객체를 구현하고 있으며, Reflection은 PHP의 꽃이라고 생각합니다.

## Classes

일단 기본 정의된 클래스가 많은데, PECL에 의존도가 있는 클래스(cf. PDO)는 최대한 배제하였습니다. PHP 문서에 따라서 분류 했으며 총 19개로 분류됩니다. 또한 여기에는 PHP 공식문서에도 없는 클래스도 존재합니다. (왜일까요..) 그런 클래스는 최대한 비슷하게 묶일 수 있는 클래스와 함께 분류하였습니다.

- Predefined Exceptions
- Predefined Classes
- Other Basic Extensions > SPL > Exceptions
- Other Basic Extensions > SPL > Iterators
- Other Basic Extensions > SPL > Miscellaneous Interfaces
- Other Basic Extensions > SPL > File Handling
- Other Basic Extensions > SPL > Datastructures
- Other Basic Extensions > Streams
- Other Services > cURL
- Date and Time Related Extensions > Date/Time
- Database Extensions > Vendor Specific Database Extensions > SQLite3
- File System Related Extensions > Directories
- Session Extensions > Sessions
- Variable and Type Related Extensions > Reflection
- Web Services > Soap
- XML Manipulation > libxml
- XML Manipulation > DOM
- XML Manipulation > SimpleXML
- XML Manipulation > XMLReader/Writer/XSL



- Predefined Exceptions
    1. `stdClass`
	1. `Exception`
	1. `ErrorException` extends Exception
	1. `Error` implements Throwable (>= 7.0)
	1. `ArithmeticError` extends Error (>= 7.0)
	1. `AssertionError` extends Error (>= 7.0)
	1. `DivisionByZeroError` extends Error (>= 7.0)
	1. `ParseError` extends Error (>= 7.0)
	1. `TypeError` extends Error (>= 7.0)

- Predefined Classes
    1. `Closure`
    1. `Generator` implements Iterator
    1. `ClosedGeneratorException` (문서에 없음)

- Date and Time Related Extensions > Date/Time
	1. `DateTime` implements DateTimeInterface
	1. `DateTimeImmutable` implements DateTimeInterface
	1. `DateTimeZone`
	1. `DateInterval`
	1. `DatePeriod` implements Traversable

- XML Manipulation > libxml
    1. `LibXMLError`

- Database Extensions > Vendor Specific Database Extensions > SQLite3
    1. `SQLite3`
    1. `SQLite3Stmt`
    1. `SQLite3Result`

- Other Services > cURL
    1. `CURLFile`

- XML Manipulation > DOM
    1. `DOMAttr` extends DOMNode
    1. `DOMCdataSection` extends DOMText
    1. `DOMCharacterData` extends DOMNode
    1. `DOMComment` extends DOMCharacterData
    1. `DOMDocument` extends DOMNode
    1. `DOMDocumentFragment` extends DOMNode
    1. `DOMDocumentType` extends DOMNode
    1. `DOMElement` extends DOMNode
    1. `DOMEntity` extends DOMNode
    1. `DOMEntityReference` extends DOMNode
    1. `DOMException` extends Exception
    1. `DOMImplementation`
    1. `DOMNamedNodeMap` implements Traversable
    1. `DOMNode`
    1. `DOMNodeList` implements Traversable
    1. `DOMNotation` extends DOMNode
    1. `DOMProcessingInstruction` extends DOMNode
    1. `DOMText` extends DOMCharacterData
    1. `DOMXPath`
    1. `DOMStringList` (문서에 없음)
    1. `DOMNameList` (문서에 없음)
    1. `DOMImplementationList` (문서에 없음)
    1. `DOMImplementationSource` (문서에 없음)
    1. `DOMNameSpaceNode` (문서에 없음)
    1. `DOMTypeinfo` (문서에 없음)
    1. `DOMUserDataHandler` (문서에 없음)
    1. `DOMDomError` (문서에 없음)
    1. `DOMErrorHandler` (문서에 없음)
    1. `DOMLocator` (문서에 없음)
    1. `DOMConfiguration` (문서에 없음)
    1. `DOMStringExtend` (문서에 없음)

- Other Basic Extensions > SPL > Exceptions
	1. `BadFunctionCallException` extends LogicException
	1. `BadMethodCallException` extends BadFunctionCallException
	1. `DomainException` extends LogicException
	1. `InvalidArgumentException` extends LogicException
	1. `LengthException` extends LogicException
	1. `LogicException` extends Exception
	1. `OutOfBoundsException` extends RuntimeException
	1. `OutOfRangeException` extends LogicException
	1. `OverflowException` extends RuntimeException
	1. `RangeException` extends RuntimeException
	1. `RuntimeException` extends Exception
	1. `UnderflowException` extends RuntimeException
	1. `UnexpectedValueException` extends RuntimeException

- Other Basic Extensions > SPL > Iterators
    1. `AppendIterator` extends IteratorIterator implements OuterIterator
    1. `ArrayIterator` implements ArrayAccess , SeekableIterator , Countable , Serializable
    1. `CachingIterator` extends IteratorIterator implements OuterIterator , ArrayAccess , Countable
    1. `CallbackFilterIterator` extends FilterIterator implements OuterIterator
    1. `DirectoryIterator` extends SplFileInfo implements SeekableIterator
    1. `EmptyIterator` implements Iterator
    1. `FilesystemIterator` extends DirectoryIterator implements SeekableIterator
    1. `FilterIterator` extends IteratorIterator implements OuterIterator
    1. `GlobIterator` extends FilesystemIterator implements SeekableIterator , Countable
    1. `InfiniteIterator` extends IteratorIterator implements OuterIterator
    1. `IteratorIterator` implements OuterIterator
    1. `LimitIterator` extends IteratorIterator implements OuterIterator
    1. `MultipleIterator` implements Iterator
    1. `NoRewindIterator` extends IteratorIterator
    1. `ParentIterator` extends RecursiveFilterIterator implements RecursiveIterator , OuterIterator
    1. `RecursiveArrayIterator` extends ArrayIterator implements RecursiveIterator
    1. `RecursiveCachingIterator` extends CachingIterator implements Countable , ArrayAccess , OuterIterator , RecursiveIterator
    1. `RecursiveCallbackFilterIterator` extends CallbackFilterIterator implements OuterIterator , RecursiveIterator
    1. `RecursiveDirectoryIterator` extends FilesystemIterator implements SeekableIterator , RecursiveIterator
    1. `RecursiveFilterIterator` extends FilterIterator implements OuterIterator , RecursiveIterator
    1. `RecursiveIteratorIterator` implements OuterIterator
    1. `RecursiveRegexIterator` extends RegexIterator implements RecursiveIterator
    1. `RecursiveTreeIterator` extends RecursiveIteratorIterator implements OuterIterator
    1. `RegexIterator` extends FilterIterator

- Other Basic Extensions > SPL > Miscellaneous Interfaces
    1. `ArrayObject` implements IteratorAggregate , ArrayAccess , Serializable , Countable

- Other Basic Extensions > SPL > File Handling
	1. `SplFileInfo`
    1. `SplFileObject` extends SplFileInfo implements RecursiveIterator, SeekableIterator
	1. `SplTempFileObject` extends SplFileObject implements SeekableIterator , RecursiveIterator

- Other Basic Extensions > SPL > Datastructures
    1. `SplDoublyLinkedList` implements Iterator , ArrayAccess , Countable
    1. `SplStack` extends SplDoublyLinkedList implements Iterator , ArrayAccess , Countable
    1. `SplQueue` extends SplDoublyLinkedList implements Iterator , ArrayAccess , Countable
    1. abstract `SplHeap` implements Iterator , Countable
    1. `SplMaxHeap` extends SplHeap implements Iterator , Countable
    1. `SplMinHeap` extends SplHeap implements Iterator , Countable
    1. `SplPriorityQueue` implements Iterator , Countable
    1. `SplFixedArray` implements Iterator , ArrayAccess , Countable
    1. `SplObjectStorage` implements Countable , Iterator , Serializable , ArrayAccess

- Session Extensions > Sessions
    1. `SessionHandler` implements SessionHandlerInterface
    1. `__PHP_Incomplete_Class` (문서에 없음)

- Other Basic Extensions > Streams
    1. `php_user_filter`

- File System Related Extensions > Directories
    1. `Directory`

- Variable and Type Related Extensions > Reflection
    1. `Reflection`
    1. `ReflectionClass` implements Reflector
    1. `ReflectionZendExtension` implements Reflector
    1. `ReflectionExtension` implements Reflector
    1. `ReflectionFunction` extends ReflectionFunctionAbstract implements Reflector
    1. `ReflectionFunctionAbstract` implements Reflector
    1. `ReflectionMethod` extends ReflectionFunctionAbstract implements Reflector
    1. `ReflectionObject` extends ReflectionClass implements Reflector
    1. `ReflectionParameter` implements Reflector
    1. `ReflectionProperty` implements Reflector
    1. `ReflectionType`
    1. `ReflectionGenerator`
    1. `ReflectionException` extends Exception

- XML Manipulation > SimpleXML
    1. `SimpleXMLElement` implements Traversable
    1. `SimpleXMLIterator` extends SimpleXMLElement implements RecursiveIterator , Countable

- Web Services > Soap
    1. `SoapClient`
    1. `SoapServer`
    1. `SoapFault` extends Exception
    1. `SoapHeader`
    1. `SoapParam`
    1. `SoapVar`

- XML Manipulation > XMLReader/Writer/XSL
    1. `XMLReader`
    1. `XMLWriter`
    1. `XSLTProcessor`

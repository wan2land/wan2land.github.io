---
layout: post
title: "Zeros in PHP"
date:  2015-01-27 22:26:00 +09:00
tags: ["php"]
---

<style type="text/css">
td.true {
	color:#318DCB;	
}
td.error {
	background:#eee;	
}
</style>

해당 포스팅은 과거 2013년 11월 28일에 작성된 포스팅에 부가 설명을 첨부한 포스팅입니다. 작성할 당시 [Zeros in Javascript](http://zero.milosz.ca)를 보고난 후 PHP에서는 어떻게 작동할지 궁금해서 작성했었습니다.

### 다양한 값의 비교

PHP 코드를 짜다가 null과 0, 그리고 공백문자 empty(), isset() 등등을 자유자재로 쓰기 위해 만들어본 표입니다.

`No Declair`의 경우 아무것도 지정하지 않은 변수를 사용하였습니다. `==`과 `===`의 경우에는 `No Declair`의 경우 모두 `Notice: Undefined..` 경고를 발생시키나 에러가 뜨지 않는 다는 가정하에 표를 작성하였습니다.

<table>
	<thead>
		<tr>
			<th>==</th>
			<th>true</th>
			<th>1</th>
			<th>-1</th>
			<th>"1"</th>
			<th>"-1"</th>
			<th>"string"</th>
			<th>false</th>
			<th>0</th>
			<th>"0"</th>
			<th>array()</th>
			<th>""</th>
			<th>" "</th>
			<th>null</th>
			<th>array(0)</th>
			<th>array(null)</th>
			<th>No Declair</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>true</th>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>1</th>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>-1</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"1"</th>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"-1"</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"string"</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>false</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>0</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>"0"</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>array()</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>""</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>" "</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>null</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>array(0)</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>array(null)</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>No Declair</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
	</tbody>
</table>

<table>
	<thead>
		<tr>
			<th>===</th>
			<th>true</th>
			<th>1</th>
			<th>-1</th>
			<th>"1"</th>
			<th>"-1"</th>
			<th>"string"</th>
			<th>false</th>
			<th>0</th>
			<th>"0"</th>
			<th>array()</th>
			<th>""</th>
			<th>" "</th>
			<th>null</th>
			<th>array(0)</th>
			<th>array(null)</th>
			<th>No Declair</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>true</th>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>1</th>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>-1</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"1"</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"-1"</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"string"</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>false</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>0</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>"0"</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>array()</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>""</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>" "</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>null</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>array(0)</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>array(null)</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>No Declair</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
	</tbody>
</table>

### 다양한 값의 조건문 처리

기왕 작성하는거 자주 사용하는 조건문도 사용해보았습니다. `with Error`라고 적은 부분은 `Notice: Undefined..` 경고를 나타내는 녀석입니다. 기본적으로 `if`와 `empty` 그리고 `isset`과 `is_null`은 서로 반대값을 나타냅니다. 그리고 `isset`과 `empty`의 경우 선언되지 않는 변수를 사용하여도 경고를 발생하지 않습니다. 이 4가지의 미묘한 차이를 알면 다양한 상황에 잘 활용할 수 있을 것 같습니다. :)

<table>
	<thead>
		<tr>
			<th>Function</th>
			<th>true</th>
			<th>1</th>
			<th>-1</th>
			<th>"1"</th>
			<th>"-1"</th>
			<th>"string"</th>
			<th>false</th>
			<th>0</th>
			<th>"0"</th>
			<th>array()</th>
			<th>""</th>
			<th>" "</th>
			<th>null</th>
			<th>array(0)</th>
			<th>array(null)</th>
			<th>No Declair</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>if(...)</th>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false error">false (with Error)</td>
		</tr>
		<tr>
			<th>empty(...)</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
		</tr>
		<tr>
			<th>isset(...)</th>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="true">true</td>
			<td class="false">false</td>
		</tr>
		<tr>
			<th>is_null(...)</th>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true">true</td>
			<td class="false">false</td>
			<td class="false">false</td>
			<td class="true error">true (with Error)</td>
		</tr>
	</tbody>
</table>





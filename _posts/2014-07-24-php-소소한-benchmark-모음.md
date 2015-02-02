---
layout: post
title: PHP 소소한 Benchmark 모음.
---
## Null 비교

`is_null()`과 `isset()` 그리고 직접 `== null`과 비교했을 때 어느것이 성능이 나은지 비교해보았습니다.

소스는 다음 소스를 사용하였습니다.

https://gist.github.com/wan2land/bb0917420204c9ce596f

```prettyprint lang-php linenum
<?php
// benchmark.php
function benchmark( $callback, $times = 100 ) {
	if ( !($callback instanceof Closure) ) return false;
	$st = explode(" ", microtime());

	for ($i = 0; $i < $times; $i++) {
		$ret = $callback( $i );
	}

	$et = explode(" ", microtime());

	echo sprintf("Running Time : %d.%08ds\n",
			$et[1]- $st[1],
			( (int)substr($et[0], 2)-(int)substr($st[0],2)+100000000 )%100000000 );

	return $ret;
}
```

```prettyprint lang-php linenum
<?php
// compare-null.php
require "benchmark.php";
 
$is_null = null;
 
$result1 = benchmark(function() use( $is_null ) {
	return $is_null === null;
}, 10000);
 
$result2 = benchmark(function() use( $is_null ) {
	return !isset($is_null);
}, 10000);
 
$result3 = benchmark(function() use( $is_null ) {
	return is_null($is_null);
}, 10000);
 
var_dump( $result1 );
var_dump( $result2 );
var_dump( $result3 );
 
/**
Running Time : 0.00270500s
Running Time : 0.00183700s
Running Time : 0.00252700s
bool(true)
bool(true)
bool(true)
**/
 
$result1 = benchmark(function() {
	return @$undefined === null; // 경고 차단.
}, 10000);
 
$result2 = benchmark(function() {
	return !isset($undefined);
}, 10000);
 
$result3 = benchmark(function() {
	return @is_null($undefined); // 경고 차단.
}, 10000);
 
var_dump( $result1 );
var_dump( $result2 );
var_dump( $result3 );
 
/**
Running Time : 0.00803400s
Running Time : 0.00122800s
Running Time : 0.00869200s
bool(true)
bool(true)
bool(true)
*/
```


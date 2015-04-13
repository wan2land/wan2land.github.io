<?php
use Wuild\Console;

Wuild::task('create:post', function() {
    // $this->arguments 사용가능해야함.
    if (!isset($_SERVER['argv'][2])) {
        return false;
    }
    $subject = $_SERVER['argv'][2];
    $fileName = '_posts/' . date('Y-m-d') . '-' . $subject . '.md';
    $date = date('Y-m-d H:i:s');
    file_put_contents($fileName, "---
layout: post
title: \"{$subject}\"
date: {$date}
categories: 
---

");
    Console::execute("open {$fileName}");
    Console::writeLine("Create Success!");
});